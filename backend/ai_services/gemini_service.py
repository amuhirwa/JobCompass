import google.generativeai as genai
from django.conf import settings
import json
import logging
import re
from typing import Dict, List, Optional
from decimal import Decimal

logger = logging.getLogger(__name__)


class GeminiService:
    """Service for interacting with Google's Gemini AI"""
    
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        
        # Configure generation settings with timeout
        generation_config = {
            "temperature": 0.7,
            "top_p": 1,
            "top_k": 40,
            "max_output_tokens": 4096,
        }
        
        self.model = genai.GenerativeModel(
            'gemini-2.5-flash'        )
    
    def generate_market_insights(self, occupation_name: str, occupation_description: str = "") -> Dict:
        """Generate market insights for an occupation using Gemini AI"""
        
        prompt = f"""
        Generate comprehensive market insights for the occupation: {occupation_name}
        
        {f"Occupation Description: {occupation_description}" if occupation_description else ""}
        
        Please provide a JSON response with the following structure:
        {{
            "average_salary": <number representing average salary in USD>,
            "growth_rate": <number representing growth rate percentage (can be negative)>,
            "remote_opportunities_percentage": <number representing percentage of remote opportunities (0-100)>,
            "demand_level": "<one of: low, medium, high, very_high>",
            "market_trends": "<well-formatted analysis with clear sections and bullet points>",
            "key_regions": ["<list of key regions with high demand>"],
            "industry_outlook": "<comprehensive industry outlook analysis>"
        }}
        
        For market_trends, structure your response with clear sections using proper formatting:
        - Use line breaks between major points
        - Use bullet points (•) for sub-points
        - Keep paragraphs concise and readable
        - Avoid excessive markdown formatting
        - Focus on current trends, emerging technologies, and market dynamics
        
        Base your response on current market data, industry trends, and realistic projections.
        Make sure all numbers are realistic and based on actual market conditions.
        """
        
        try:
            response = self.model.generate_content(prompt)
            # Clean the response to extract JSON
            response_text = response.text.strip()
            
            # Remove markdown code blocks if present
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.startswith('```'):
                response_text = response_text[3:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            
            # Parse JSON
            market_data = json.loads(response_text.strip())
            
            # Clean and format the market trends text
            if 'market_trends' in market_data:
                market_data['market_trends'] = self._format_market_trends(market_data['market_trends'])
            
            # Validate and clean the data
            return self._validate_market_insights(market_data)
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error for {occupation_name}: {str(e)}")
            return self._get_default_market_insights()
        except Exception as e:
            logger.error(f"Error generating market insights for {occupation_name}: {str(e)}")
            # Return default values if API fails
            return self._get_default_market_insights()
    
    def generate_career_paths(self, occupation_name: str, occupation_description: str = "") -> List[Dict]:
        """Generate career progression paths for an occupation"""
        
        prompt = f"""
        Generate 2-3 comprehensive career progression paths for the occupation: {occupation_name}
        
        {f"Occupation Description: {occupation_description}" if occupation_description else ""}
        
        Please provide a JSON response with the following structure:
        {{
            "career_paths": [
                {{
                    "path_name": "<name of the career path>",
                    "description": "<description of the career progression>",
                    "estimated_duration": "<total time to complete path>",
                    "difficulty_level": "<one of: beginner, intermediate, advanced, expert>",
                    "steps": [
                        {{
                            "step_number": <integer>,
                            "title": "<job title for this step>",
                            "description": "<detailed description of role and responsibilities>",
                            "estimated_duration": "<time to spend at this level>",
                            "requirements": "<requirements to reach this step>",
                            "typical_salary_range": "<salary range for this level>",
                            "required_skills": [
                                {{
                                    "skill_name": "<skill name>",
                                    "importance_level": "<one of: essential, important, helpful, optional>",
                                    "proficiency_level": "<one of: basic, intermediate, advanced, expert>"
                                }}
                            ]
                        }}
                    ]
                }}
            ]
        }}
        
        Make sure the career paths are realistic and represent actual progression routes in the field.
        Include 3-4 steps per path, and 3-5 skills per step (keep skills concise and focus on the most essential ones).
        
        For skill names, use common, standardized skill names like:
        - Technical skills: "Python", "JavaScript", "SQL", "Data Analysis", "Machine Learning", "Cloud Computing"
        - Soft skills: "Communication", "Leadership", "Problem Solving", "Project Management", "Teamwork"
        - Industry-specific: "Customer Service", "Sales", "Marketing", "Financial Analysis", "Quality Assurance"
        """
        
        try:
            response = self.model.generate_content(
                prompt            )
            print("Got response")
            response_text = response.text.strip()
            
            # Clean response
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.startswith('```'):
                response_text = response_text[3:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            
            career_data = json.loads(response_text.strip())
            return career_data.get('career_paths', [])
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error for career paths {occupation_name}: {str(e)}")
            return self._get_default_career_paths(occupation_name)
        except Exception as e:
            logger.error(f"Error generating career paths for {occupation_name}: {str(e)}")
            return self._get_default_career_paths(occupation_name)
    
    def generate_learning_resources(self, skill_name: str, skill_description: str = "") -> List[Dict]:
        """Generate learning resources for a specific skill"""
        
        prompt = f"""
        Generate a comprehensive list of learning resources for the skill: {skill_name}
        
        {f"Skill Description: {skill_description}" if skill_description else ""}
        
        Please provide a JSON response with the following structure:
        {{
            "resources": [
                {{
                    "title": "<resource title>",
                    "description": "<detailed description of the resource>",
                    "resource_type": "<one of: course, book, tutorial, certification, bootcamp, workshop, documentation, practice>",
                    "url": "<URL if available, or empty string>",
                    "provider": "<provider/platform name>",
                    "duration": "<estimated time to complete>",
                    "difficulty_level": "<one of: beginner, intermediate, advanced>",
                    "is_free": <true or false>,
                    "rating": <rating out of 5, or null>,
                    "cost": "<cost information if not free>"
                }}
            ]
        }}
        
        Include a mix of free and paid resources, different types (courses, books, tutorials, etc.),
        and various difficulty levels. Aim for 6-10 resources per skill.
        """
        
        try:
            response = self.model.generate_content(
                prompt            )
            response_text = response.text.strip()
            
            # Clean response
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.startswith('```'):
                response_text = response_text[3:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            
            resources_data = json.loads(response_text.strip())
            return resources_data.get('resources', [])
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error for learning resources {skill_name}: {str(e)}")
            return self._get_default_learning_resources(skill_name)
        except Exception as e:
            logger.error(f"Error generating learning resources for {skill_name}: {str(e)}")
            return self._get_default_learning_resources(skill_name)
    
    def _format_market_trends(self, text: str) -> str:
        """Format market trends text for better readability"""
        if not text:
            return text
        
        # Clean up excessive markdown formatting
        text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)  # Remove bold markdown
        text = re.sub(r'\*([^*]+)\*', r'\1', text)      # Remove italic markdown
        
        # Convert bullet points to clean format
        text = re.sub(r'\* \*\*([^*]+):\*\*', r'• \1:', text)  # Convert markdown bullets
        text = re.sub(r'\*\s*', '• ', text)                     # Convert asterisk bullets
        
        # Clean up excessive spacing
        text = re.sub(r'\n\s*\n\s*\n+', '\n\n', text)         # Remove excessive line breaks
        text = re.sub(r'\s+', ' ', text)                        # Normalize spaces
        
        # Split into paragraphs and clean them
        paragraphs = text.split('\n\n')
        cleaned_paragraphs = []
        
        for paragraph in paragraphs:
            paragraph = paragraph.strip()
            if paragraph:
                # Ensure bullet points are properly formatted
                if '•' in paragraph:
                    lines = paragraph.split('\n')
                    formatted_lines = []
                    for line in lines:
                        line = line.strip()
                        if line.startswith('•'):
                            formatted_lines.append(line)
                        elif line and not line.startswith('•') and formatted_lines:
                            # This is likely a continuation of the previous bullet point
                            formatted_lines[-1] += ' ' + line
                        elif line:
                            formatted_lines.append(line)
                    paragraph = '\n'.join(formatted_lines)
                
                cleaned_paragraphs.append(paragraph)
        
        return '\n\n'.join(cleaned_paragraphs)
    
    def _validate_market_insights(self, data: Dict) -> Dict:
        """Validate and clean market insights data"""
        validated = {}
        
        # Validate average_salary
        try:
            salary = float(data.get('average_salary', 50000))
            validated['average_salary'] = max(20000, min(500000, salary))  # Reasonable bounds
        except (ValueError, TypeError):
            validated['average_salary'] = 50000
        
        # Validate growth_rate
        try:
            growth = float(data.get('growth_rate', 5))
            validated['growth_rate'] = max(-50, min(100, growth))  # Reasonable bounds
        except (ValueError, TypeError):
            validated['growth_rate'] = 5
        
        # Validate remote_opportunities_percentage
        try:
            remote = float(data.get('remote_opportunities_percentage', 30))
            validated['remote_opportunities_percentage'] = max(0, min(100, remote))
        except (ValueError, TypeError):
            validated['remote_opportunities_percentage'] = 30
        
        # Validate demand_level
        valid_demand_levels = ['low', 'medium', 'high', 'very_high']
        demand = data.get('demand_level', 'medium')
        validated['demand_level'] = demand if demand in valid_demand_levels else 'medium'
        
        # Validate text fields
        validated['market_trends'] = str(data.get('market_trends', ''))[:2000]  # Limit length
        validated['industry_outlook'] = str(data.get('industry_outlook', ''))[:2000]
        
        # Validate key_regions
        regions = data.get('key_regions', [])
        if isinstance(regions, list):
            validated['key_regions'] = [str(region)[:100] for region in regions[:10]]  # Max 10 regions
        else:
            validated['key_regions'] = []
        
        return validated
    
    def _get_default_market_insights(self) -> Dict:
        """Return default market insights if AI generation fails"""
        return {
            'average_salary': 50000,
            'growth_rate': 5.0,
            'remote_opportunities_percentage': 30.0,
            'demand_level': 'medium',
            'market_trends': 'Market insights unavailable at this time.',
            'key_regions': ['United States', 'Europe', 'Asia-Pacific'],
            'industry_outlook': 'Industry outlook data unavailable at this time.'
        }
    
    def _get_default_career_paths(self, occupation_name: str) -> List[Dict]:
        """Return default career path if AI generation fails"""
        return [
            {
                'path_name': f'Traditional {occupation_name} Path',
                'description': 'Standard career progression in this field.',
                'estimated_duration': '5-10 years',
                'difficulty_level': 'intermediate',
                'steps': [
                    {
                        'step_number': 1,
                        'title': f'Junior {occupation_name}',
                        'description': 'Entry-level position in the field.',
                        'estimated_duration': '1-2 years',
                        'requirements': 'Basic education and foundational skills.',
                        'typical_salary_range': '$30,000 - $45,000',
                        'required_skills': []
                    }
                ]
            }
        ]
    
    def _get_default_learning_resources(self, skill_name: str) -> List[Dict]:
        """Return default learning resources if AI generation fails"""
        return [
            {
                'title': f'Introduction to {skill_name}',
                'description': f'Basic tutorial for learning {skill_name}',
                'resource_type': 'tutorial',
                'url': '',
                'provider': 'Online Tutorial',
                'duration': '2-4 hours',
                'difficulty_level': 'beginner',
                'is_free': True,
                'rating': None,
                'cost': ''
            }
        ]
