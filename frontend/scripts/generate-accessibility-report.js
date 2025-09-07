#!/usr/bin/env node

/**
 * Accessibility Report Generator for JobCompass
 *
 * This script combines results from multiple accessibility testing tools
 * and generates comprehensive reports in multiple formats.
 */

const fs = require('fs');
const path = require('path');

const REPORTS_DIR = './accessibility-reports';
const OUTPUT_DIR = './accessibility-reports/combined';

// Ensure directories exist
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Read and parse JSON report files
 */
function readReportFile(filename) {
  try {
    const filePath = path.join(REPORTS_DIR, filename);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    }
    return null;
  } catch (error) {
    console.warn(`Warning: Could not read ${filename}:`, error.message);
    return null;
  }
}

/**
 * Process axe-core results
 */
function processAxeResults(axeData) {
  if (!axeData)
    return { violations: [], passes: [], incomplete: [], inapplicable: [] };

  return {
    violations: axeData.violations || [],
    passes: axeData.passes || [],
    incomplete: axeData.incomplete || [],
    inapplicable: axeData.inapplicable || [],
    testEngine: axeData.testEngine || {},
    testRunner: axeData.testRunner || {},
    testEnvironment: axeData.testEnvironment || {},
    timestamp: axeData.timestamp || new Date().toISOString(),
    url: axeData.url || 'Unknown',
  };
}

/**
 * Process Lighthouse results
 */
function processLighthouseResults(lighthouseData) {
  if (!lighthouseData) return { score: null, audits: {} };

  const accessibilityCategory = lighthouseData.categories?.accessibility;
  const audits = lighthouseData.audits || {};

  return {
    score: accessibilityCategory?.score || null,
    scoreDisplayMode: accessibilityCategory?.scoreDisplayMode || 'numeric',
    title: accessibilityCategory?.title || 'Accessibility',
    description: accessibilityCategory?.description || '',
    audits: Object.keys(audits).reduce((acc, auditId) => {
      const audit = audits[auditId];
      if (
        audit.scoreDisplayMode === 'binary' ||
        audit.scoreDisplayMode === 'numeric'
      ) {
        acc[auditId] = {
          id: auditId,
          title: audit.title,
          description: audit.description,
          score: audit.score,
          scoreDisplayMode: audit.scoreDisplayMode,
          displayValue: audit.displayValue,
          details: audit.details,
        };
      }
      return acc;
    }, {}),
    timestamp: lighthouseData.fetchTime || new Date().toISOString(),
    url: lighthouseData.finalUrl || 'Unknown',
  };
}

/**
 * Process Pa11y results
 */
function processPa11yResults(pa11yData) {
  if (!pa11yData) return { issues: [], documentTitle: '', pageUrl: '' };

  // Pa11y can return array of results or single result
  const results = Array.isArray(pa11yData) ? pa11yData : [pa11yData];

  return results.map((result) => ({
    documentTitle: result.documentTitle || '',
    pageUrl: result.pageUrl || '',
    issues: (result.issues || []).map((issue) => ({
      code: issue.code,
      type: issue.type,
      typeCode: issue.typeCode,
      message: issue.message,
      context: issue.context,
      selector: issue.selector,
      runner: issue.runner,
    })),
  }));
}

/**
 * Generate severity levels for issues
 */
function categorizeBySeverity(violations) {
  const categories = {
    critical: [],
    serious: [],
    moderate: [],
    minor: [],
  };

  violations.forEach((violation) => {
    const impact = violation.impact || 'minor';
    if (categories[impact]) {
      categories[impact].push(violation);
    } else {
      categories.minor.push(violation);
    }
  });

  return categories;
}

/**
 * Generate summary statistics
 */
function generateSummary(axeResults, lighthouseResults, pa11yResults) {
  const totalViolations = axeResults.violations.length;
  const totalPa11yIssues = pa11yResults.reduce(
    (sum, result) => sum + result.issues.length,
    0
  );
  const lighthouseScore = lighthouseResults.score
    ? Math.round(lighthouseResults.score * 100)
    : 'N/A';

  const severityBreakdown = categorizeBySeverity(axeResults.violations);

  return {
    overview: {
      totalIssues: totalViolations + totalPa11yIssues,
      axeViolations: totalViolations,
      pa11yIssues: totalPa11yIssues,
      lighthouseScore: lighthouseScore,
      testDate: new Date().toISOString().split('T')[0],
      testTime: new Date().toLocaleTimeString(),
    },
    severity: {
      critical: severityBreakdown.critical.length,
      serious: severityBreakdown.serious.length,
      moderate: severityBreakdown.moderate.length,
      minor: severityBreakdown.minor.length,
    },
    compliance: {
      wcag2aViolations: axeResults.violations.filter((v) =>
        v.tags?.includes('wcag2a')
      ).length,
      wcag2aaViolations: axeResults.violations.filter((v) =>
        v.tags?.includes('wcag2aa')
      ).length,
      wcag21aaViolations: axeResults.violations.filter((v) =>
        v.tags?.includes('wcag21aa')
      ).length,
    },
  };
}

/**
 * Generate HTML report
 */
function generateHTMLReport(
  summary,
  axeResults,
  lighthouseResults,
  pa11yResults
) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JobCompass Accessibility Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 40px; }
        .score { font-size: 3em; font-weight: bold; color: ${summary.overview.lighthouseScore >= 90 ? '#059669' : summary.overview.lighthouseScore >= 70 ? '#d97706' : '#dc2626'}; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 30px 0; }
        .card { background: #f9fafb; padding: 20px; border-radius: 6px; border-left: 4px solid #3b82f6; }
        .card h3 { margin: 0 0 10px 0; color: #1f2937; }
        .card .number { font-size: 2em; font-weight: bold; color: #3b82f6; }
        .violations { margin-top: 40px; }
        .violation { background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 15px; margin: 10px 0; }
        .violation h4 { margin: 0 0 10px 0; color: #dc2626; }
        .violation .impact { display: inline-block; padding: 2px 8px; border-radius: 3px; font-size: 0.8em; font-weight: bold; text-transform: uppercase; }
        .impact.critical { background: #dc2626; color: white; }
        .impact.serious { background: #f59e0b; color: white; }
        .impact.moderate { background: #3b82f6; color: white; }
        .impact.minor { background: #6b7280; color: white; }
        .help-text { color: #6b7280; font-size: 0.9em; margin-top: 5px; }
        .nodes { margin-top: 10px; }
        .node { background: white; padding: 10px; margin: 5px 0; border-radius: 3px; font-family: monospace; font-size: 0.8em; }
        .footer { margin-top: 50px; text-align: center; color: #6b7280; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>JobCompass Accessibility Report</h1>
            <div class="score">${summary.overview.lighthouseScore}${typeof summary.overview.lighthouseScore === 'number' ? '/100' : ''}</div>
            <p>Generated on ${summary.overview.testDate} at ${summary.overview.testTime}</p>
        </div>
        
        <div class="grid">
            <div class="card">
                <h3>Total Issues</h3>
                <div class="number">${summary.overview.totalIssues}</div>
            </div>
            <div class="card">
                <h3>Critical Issues</h3>
                <div class="number" style="color: #dc2626;">${summary.severity.critical}</div>
            </div>
            <div class="card">
                <h3>Serious Issues</h3>
                <div class="number" style="color: #f59e0b;">${summary.severity.serious}</div>
            </div>
            <div class="card">
                <h3>WCAG 2.1 AA</h3>
                <div class="number">${summary.compliance.wcag21aaViolations} violations</div>
            </div>
        </div>
        
        <div class="violations">
            <h2>Detailed Issues</h2>
            ${axeResults.violations
              .map(
                (violation) => `
                <div class="violation">
                    <h4>${violation.help}</h4>
                    <span class="impact ${violation.impact || 'minor'}">${violation.impact || 'minor'}</span>
                    <div class="help-text">${violation.description}</div>
                    <div class="nodes">
                        ${violation.nodes
                          .map(
                            (node) => `
                            <div class="node">
                                <strong>Element:</strong> ${node.html}<br>
                                <strong>Selector:</strong> ${node.target.join(', ')}<br>
                                ${node.failureSummary ? `<strong>Issue:</strong> ${node.failureSummary}` : ''}
                            </div>
                        `
                          )
                          .join('')}
                    </div>
                </div>
            `
              )
              .join('')}
        </div>
        
        <div class="footer">
            <p>Report generated by JobCompass Accessibility Testing Suite</p>
            <p>Tools used: axe-core, Lighthouse, Pa11y</p>
        </div>
    </div>
</body>
</html>`;

  return html;
}

/**
 * Generate markdown report
 */
function generateMarkdownReport(
  summary,
  axeResults,
  lighthouseResults,
  pa11yResults
) {
  const markdown = `# JobCompass Accessibility Report

**Generated:** ${summary.overview.testDate} at ${summary.overview.testTime}
**Lighthouse Score:** ${summary.overview.lighthouseScore}${typeof summary.overview.lighthouseScore === 'number' ? '/100' : ''}

## Summary

| Metric | Count |
|--------|-------|
| Total Issues | ${summary.overview.totalIssues} |
| Critical Issues | ${summary.severity.critical} |
| Serious Issues | ${summary.severity.serious} |
| Moderate Issues | ${summary.severity.moderate} |
| Minor Issues | ${summary.severity.minor} |
| WCAG 2.1 AA Violations | ${summary.compliance.wcag21aaViolations} |

## Detailed Issues

${axeResults.violations
  .map(
    (violation) => `
### ${violation.help}

**Impact:** ${violation.impact || 'minor'}  
**Description:** ${violation.description}  
**Help URL:** [${violation.helpUrl}](${violation.helpUrl})

**Affected Elements:**
${violation.nodes
  .map(
    (node) => `
- \`${node.target.join(', ')}\`
  - HTML: \`${node.html}\`
  ${node.failureSummary ? `- Issue: ${node.failureSummary}` : ''}
`
  )
  .join('')}
`
  )
  .join('')}

## Pa11y Issues

${pa11yResults
  .map(
    (result) => `
### Page: ${result.documentTitle || result.pageUrl}

${result.issues
  .map(
    (issue) => `
**${issue.type}:** ${issue.message}  
**Code:** ${issue.code}  
**Element:** \`${issue.selector}\`  
**Context:** \`${issue.context}\`
`
  )
  .join('')}
`
  )
  .join('')}

## Recommendations

1. **Address Critical Issues First:** Focus on ${summary.severity.critical} critical issues that severely impact accessibility
2. **WCAG Compliance:** Fix ${summary.compliance.wcag21aaViolations} WCAG 2.1 AA violations for legal compliance
3. **Screen Reader Testing:** Manually test with NVDA, JAWS, and VoiceOver
4. **Keyboard Navigation:** Verify all functionality is keyboard accessible
5. **Color Contrast:** Ensure all text meets minimum contrast ratios

---
*Report generated by JobCompass Accessibility Testing Suite*
`;

  return markdown;
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Generating accessibility report...');

  // Read report files
  const axeData =
    readReportFile('axe/results.json') || readReportFile('axe.json');
  const lighthouseData = readReportFile('lighthouse.json');
  const pa11yData = readReportFile('pa11y.json');

  // Process results
  const axeResults = processAxeResults(axeData);
  const lighthouseResults = processLighthouseResults(lighthouseData);
  const pa11yResults = processPa11yResults(pa11yData);

  // Generate summary
  const summary = generateSummary(axeResults, lighthouseResults, pa11yResults);

  // Create combined report object
  const combinedReport = {
    summary,
    axe: axeResults,
    lighthouse: lighthouseResults,
    pa11y: pa11yResults,
    generatedAt: new Date().toISOString(),
  };

  // Write reports
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'combined-report.json'),
    JSON.stringify(combinedReport, null, 2)
  );

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'accessibility-report.html'),
    generateHTMLReport(summary, axeResults, lighthouseResults, pa11yResults)
  );

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'accessibility-report.md'),
    generateMarkdownReport(summary, axeResults, lighthouseResults, pa11yResults)
  );

  // Console output
  console.log('📊 Accessibility Report Summary:');
  console.log(`   Total Issues: ${summary.overview.totalIssues}`);
  console.log(`   Critical: ${summary.severity.critical}`);
  console.log(`   Serious: ${summary.severity.serious}`);
  console.log(`   Lighthouse Score: ${summary.overview.lighthouseScore}`);
  console.log('');
  console.log('📁 Reports generated in:', OUTPUT_DIR);
  console.log('   - combined-report.json (machine readable)');
  console.log('   - accessibility-report.html (human readable)');
  console.log('   - accessibility-report.md (documentation)');

  // Exit with error code if critical issues found
  if (summary.severity.critical > 0) {
    console.error('');
    console.error('❌ CRITICAL ACCESSIBILITY ISSUES FOUND!');
    console.error(
      `   ${summary.severity.critical} critical issues must be fixed before deployment.`
    );
    process.exit(1);
  } else if (summary.overview.totalIssues > 0) {
    console.warn('');
    console.warn('⚠️  Accessibility issues found that should be addressed.');
    process.exit(0);
  } else {
    console.log('');
    console.log('✅ No accessibility issues found!');
    process.exit(0);
  }
}

// Run the script
if (require.main === module) {
  main().catch((error) => {
    console.error('Error generating accessibility report:', error);
    process.exit(1);
  });
}

module.exports = {
  processAxeResults,
  processLighthouseResults,
  processPa11yResults,
  generateSummary,
  generateHTMLReport,
  generateMarkdownReport,
};
