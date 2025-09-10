import os
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import logging
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

@api_view(['GET'])
def search_jobs(request):
    """
    Proxy API endpoint for searching jobs using SerpApi Google Jobs API
    """
    try:
        # Get query parameters
        query = request.GET.get('query', '')
        location = request.GET.get('location', '')
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('pageSize', 10))
        
        if not query:
            return Response({
                'error': 'Query parameter is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get SerpApi key from environment
        serpapi_key = os.getenv('SERPAPI_KEY')
        
        if not serpapi_key:
            logger.warning('SERPAPI_KEY not found, returning mock data')
            return get_mock_job_data(query, location, page, page_size)
        
        # Make request to SerpApi
        serpapi_url = 'https://serpapi.com/search'
        params = {
            'engine': 'google_jobs',
            'q': query,
            'location': 'Kigali, Rwanda',
            'api_key': serpapi_key,
            'hl': 'en',
            'gl': 'us'
        }
        
        response = requests.get(serpapi_url, params=params, timeout=30)
        
        if not response.ok:
            logger.error(f'SerpApi request failed: {response.status_code} {response.text}')
            return get_mock_job_data(query, location, page, page_size)
        
        data = response.json()
        
        if data.get('error'):
            logger.error(f'SerpApi error: {data.get("error")}')
            return get_mock_job_data(query, location, page, page_size)
        
        # Transform SerpApi response to our format
        transformed_data = transform_serpapi_response(data, page)
        
        return Response(transformed_data, status=status.HTTP_200_OK)
        
    except requests.exceptions.RequestException as e:
        logger.error(f'Request error: {str(e)}')
        return get_mock_job_data(query, location, page, page_size)
    except Exception as e:
        logger.error(f'Unexpected error: {str(e)}')
        return Response({
            'error': 'Internal server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def transform_serpapi_response(data, page):
    """Transform SerpApi response to our frontend format"""
    jobs_results = data.get('jobs_results', [])
    
    transformed_jobs = []
    for job in jobs_results:
        salary = extract_salary(job.get('detected_extensions', {}).get('salary') or job.get('salary_info'))
        location = job.get('location', 'Location not specified')
        company = job.get('company_name', 'Company not specified')
        
        transformed_job = {
            'id': job.get('job_id', f'serpapi-{hash(job.get("title", ""))}'),
            'title': job.get('title', 'Job Title Not Specified'),
            'company': company,
            'company_logo': job.get('thumbnail'),
            'company_industry': extract_industry(job),
            'company_size': None,
            'location': location,
            'description': job.get('description') or job.get('snippet', 'No description available'),
            'requirements': extract_requirements(job.get('description') or job.get('snippet', '')),
            'nice_to_have': [],
            'salary_min': salary.get('min'),
            'salary_max': salary.get('max'),
            'salary_currency': salary.get('currency', 'USD'),
            'employment_type': extract_employment_type(job),
            'experience_level': extract_experience_level(job.get('title', ''), job.get('description')),
            'posted_date': format_posted_date(job.get('detected_extensions', {}).get('posted_at') or job.get('posted_at')),
            'application_deadline': None,
            'apply_url': job.get('apply_options')[0].get('link') or job.get('apply_link') or job.get('share_link', '#'),
            'skills_match_percentage': 0,
            'matched_skills': [],
            'source': 'Google Jobs (SerpApi)',
            'remote_allowed': is_remote_job(job.get('title', ''), job.get('description'), location),
            'benefits': extract_benefits(job.get('description', '')),
            'team_size': None,
            'department': get_department(job.get('title', ''))
        }
        transformed_jobs.append(transformed_job)
    
    total_results = data.get('search_metadata', {}).get('total_results', '0')
    try:
        total = int(total_results.replace(',', '')) if total_results else len(transformed_jobs)
    except:
        total = len(transformed_jobs)
    
    return {
        'jobs': transformed_jobs,
        'total': total,
        'page': page,
        'hasMore': data.get('pagination', {}).get('next') is not None
    }


def extract_salary(salary_info):
    """Extract salary information from SerpApi response"""
    if not salary_info:
        return {'currency': 'USD'}
    
    if isinstance(salary_info, str):
        salary_text = salary_info.lower()
        currency_match = 'USD'  # Default currency
        
        # Look for range patterns
        import re
        range_match = re.search(r'(\d+)[,k]*\s*[-–to]\s*(\d+)[,k]*', salary_text)
        if range_match:
            min_val = parse_salary_number(range_match.group(1))
            max_val = parse_salary_number(range_match.group(2))
            return {'min': min_val, 'max': max_val, 'currency': currency_match}
        
        # Look for single number
        single_match = re.search(r'(\d+)[,k]*', salary_text)
        if single_match:
            amount = parse_salary_number(single_match.group(1))
            return {'min': amount, 'currency': currency_match}
    
    return {'currency': 'USD'}


def parse_salary_number(str_num):
    """Parse salary number from string"""
    try:
        num = int(str_num.replace(',', ''))
        return num * 1000 if num < 1000 else num
    except:
        return None


def extract_industry(job):
    """Extract industry from job data"""
    title = (job.get('title', '') or '').lower()
    company = (job.get('company_name', '') or '').lower()
    
    if 'software' in title or 'developer' in title or 'engineer' in title or 'tech' in company:
        return 'Technology'
    elif 'marketing' in title or 'advertising' in title or 'marketing' in company:
        return 'Marketing'
    elif 'sales' in title or 'business development' in title or 'sales' in company:
        return 'Sales'
    elif 'design' in title or 'creative' in title or 'design' in company:
        return 'Design'
    elif 'finance' in title or 'accounting' in title or 'bank' in company or 'financial' in company:
        return 'Finance'
    elif 'healthcare' in title or 'medical' in title or 'health' in company or 'medical' in company:
        return 'Healthcare'
    elif 'education' in title or 'teacher' in title or 'school' in company or 'university' in company:
        return 'Education'
    
    return None


def extract_requirements(description):
    """Extract requirements from job description"""
    requirements = []
    text = description.lower()
    
    tech_skills = [
        'javascript', 'python', 'java', 'react', 'node.js', 'typescript', 'sql', 'aws',
        'docker', 'kubernetes', 'git', 'html', 'css', 'angular', 'vue.js', 'mongodb',
        'postgresql', 'redis', 'graphql', 'rest api', 'microservices', 'agile', 'scrum'
    ]
    
    soft_skills = [
        'communication', 'teamwork', 'leadership', 'problem solving', 'analytical thinking',
        'project management', 'time management', 'creativity', 'adaptability'
    ]
    
    for skill in tech_skills:
        if skill.lower() in text:
            requirements.append(skill)
    
    for skill in soft_skills[:2]:
        if skill.lower() in text or len(requirements) < 3:
            requirements.append(skill)
    
    return requirements[:8]


def extract_employment_type(job):
    """Extract employment type from job data"""
    title = (job.get('title', '') or '').lower()
    description = (job.get('description', '') or job.get('snippet', '')).lower()
    
    if 'part time' in title or 'part time' in description:
        return 'Part-time'
    elif 'contract' in title or 'contract' in description or 'freelance' in description:
        return 'Contract'
    elif 'intern' in title or 'internship' in description:
        return 'Internship'
    
    return 'Full-time'


def extract_experience_level(title, description=None):
    """Extract experience level from job data"""
    text = f"{title} {description or ''}".lower()
    
    if 'senior' in text or 'sr.' in text or 'lead' in text or 'principal' in text:
        return 'Senior Level'
    elif 'junior' in text or 'jr.' in text or 'entry' in text or 'graduate' in text:
        return 'Entry Level'
    elif 'mid' in text or 'intermediate' in text:
        return 'Mid Level'
    elif 'director' in text or 'manager' in text or 'head of' in text:
        return 'Management'
    
    return 'Mid Level'


def format_posted_date(posted_at):
    """Format posted date"""
    from datetime import datetime, timedelta
    import re
    
    if not posted_at:
        return datetime.now().isoformat()
    
    now = datetime.now()
    if 'day' in posted_at:
        days = int(re.search(r'(\d+)', posted_at).group(1) if re.search(r'(\d+)', posted_at) else 0)
        return (now - timedelta(days=days)).isoformat()
    elif 'week' in posted_at:
        weeks = int(re.search(r'(\d+)', posted_at).group(1) if re.search(r'(\d+)', posted_at) else 0)
        return (now - timedelta(weeks=weeks)).isoformat()
    elif 'month' in posted_at:
        months = int(re.search(r'(\d+)', posted_at).group(1) if re.search(r'(\d+)', posted_at) else 0)
        return (now - timedelta(days=months*30)).isoformat()
    
    return now.isoformat()


def is_remote_job(title, description=None, location=None):
    """Check if job is remote"""
    text = f"{title} {description or ''} {location or ''}".lower()
    return 'remote' in text or 'work from home' in text or 'wfh' in text or 'anywhere' in text


def extract_benefits(description):
    """Extract benefits from job description"""
    benefits = []
    text = description.lower()
    
    benefit_keywords = {
        'health insurance': ['health insurance', 'medical insurance', 'healthcare'],
        'dental insurance': ['dental insurance', 'dental coverage'],
        '401k': ['401k', '401(k)', 'retirement plan'],
        'pto': ['pto', 'paid time off', 'vacation days'],
        'remote work': ['remote work', 'work from home', 'flexible location'],
        'stock options': ['stock options', 'equity', 'rsu'],
        'learning budget': ['learning budget', 'training', 'professional development'],
        'gym membership': ['gym membership', 'fitness', 'wellness']
    }
    
    for benefit, keywords in benefit_keywords.items():
        if any(keyword in text for keyword in keywords):
            benefits.append(benefit)
    
    return benefits


def get_department(job_title):
    """Get department from job title"""
    title = job_title.lower()
    if 'engineer' in title or 'developer' in title or 'software' in title:
        return 'Engineering'
    elif 'design' in title or 'ux' in title or 'ui' in title:
        return 'Design'
    elif 'product' in title:
        return 'Product'
    elif 'marketing' in title or 'growth' in title:
        return 'Marketing'
    elif 'data' in title or 'analyst' in title:
        return 'Data'
    elif 'sales' in title or 'business development' in title:
        return 'Sales'
    elif 'manager' in title or 'director' in title:
        return 'Management'
    return 'General'


def get_mock_job_data(query, location, page, page_size):
    """Return mock job data when SerpApi is not available"""
    import random
    from datetime import datetime, timedelta
    
    companies = [
        {"name": "Google", "industry": "Technology", "size": "Large"},
        {"name": "Microsoft", "industry": "Technology", "size": "Large"},
        {"name": "Amazon", "industry": "E-commerce", "size": "Large"},
        {"name": "Apple", "industry": "Technology", "size": "Large"},
        {"name": "Meta", "industry": "Social Media", "size": "Large"},
    ]
    
    job_titles = [
        f"Senior {query} Engineer",
        f"{query} Developer",
        f"Lead {query} Specialist",
        f"Principal {query} Architect",
        f"{query} Manager"
    ]
    
    locations = [location] if location else ["San Francisco, CA", "New York, NY", "Remote", "Seattle, WA"]
    
    jobs = []
    for i in range(min(page_size, 10)):
        company = random.choice(companies)
        job_title = random.choice(job_titles)
        job_location = random.choice(locations)
        
        job = {
            'id': f'mock-{hash(job_title + company["name"] + str(i))}',
            'title': job_title,
            'company': company['name'],
            'company_logo': f'https://logo.clearbit.com/{company["name"].lower()}.com',
            'company_industry': company['industry'],
            'company_size': company['size'],
            'location': job_location,
            'description': f'We are looking for a talented {job_title} to join our team at {company["name"]}.',
            'requirements': ['Python', 'JavaScript', 'React', 'Communication', 'Problem Solving'],
            'nice_to_have': ['AWS', 'Docker', 'TypeScript'],
            'salary_min': 80000 + random.randint(0, 40000),
            'salary_max': 120000 + random.randint(0, 80000),
            'salary_currency': 'USD',
            'employment_type': random.choice(['Full-time', 'Contract', 'Part-time']),
            'experience_level': random.choice(['Entry Level', 'Mid Level', 'Senior Level']),
            'posted_date': (datetime.now() - timedelta(days=random.randint(1, 30))).isoformat(),
            'application_deadline': None,
            'apply_url': f'https://careers.{company["name"].lower()}.com/job-{i}',
            'skills_match_percentage': 0,
            'matched_skills': [],
            'source': 'Mock Data',
            'remote_allowed': job_location == 'Remote' or random.choice([True, False]),
            'benefits': ['Health Insurance', '401k', 'Remote Work', 'PTO'],
            'team_size': random.randint(5, 25),
            'department': get_department(job_title)
        }
        jobs.append(job)
    
    return Response({
        'jobs': jobs,
        'total': len(jobs) * 5,  # Simulate more total results
        'page': page,
        'hasMore': page < 3  # Simulate pagination
    }, status=status.HTTP_200_OK)
