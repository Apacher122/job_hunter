
export const formatSuccessMetric = (metric: any): string => [
    `### ${metric.scoreTitle}`,
    `- Score: ${metric.score}`,
    `- Justification: ${metric.scoreJustification}`,
    `- Compatible: ${metric.isCompatible ? 'Yes' : 'No'}`,
    `- Probability of Success: ${metric.probabilityOfSuccess}`,
    `- Probability of Success Equation: ${metric.probabilityOfSuccessEquation || 'N/A'}`,
    `- Probability of Success Justification: ${metric.probabilityOfSuccessJustification || 'N/A'}`
].join('\n')

export const formatOverallMatchSummary = (summary: any): string => [
    `## Overall Match Summary:`,
    `- Summary:\n\t- ${summary.summary.join('\n\t- ')}`,
    `- Suggestions:\n\t- ${summary.suggestions.join('\n\t- ')}`,
    '',
].join('\n');