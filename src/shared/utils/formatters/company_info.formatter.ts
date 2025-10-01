import { CompanyInfoType } from "../../../features/job_guide/models/company_info.models.js"
import { dedent } from "ts-dedent"
import { format } from 'path';

export const companyInfoFormatter = (info: CompanyInfoType): string => {
    return dedent(`
# ${info.company_name || "Unknown Company (Might be an error... )"}

## Description

**Location:** ${info.company_location || "N/A"}

${info.company_description || "No description available."}

- **Website:** [${info.company_website || "N/A"}](${info.company_website || "#"})

## Stats and Info

- **Industry:** ${info.company_industry || "N/A"}
- **Size:** ${info.company_size || "N/A"}

### Culture

${info.company_culture || "N/A"}

### Values

${info.company_values || "N/A"}

### Benefits

${info.company_benefits || "N/A"}

## Job Specific Information:

- **Position Title:** ${info.job_info.position_title || "N/A"}

### Position Review

${info.job_info.position_review}

### Salary

- **Typical salary ask:** ${info.job_info.typical_salary_ask || "N/A"}
    - ${info.job_info.typical_salary_ask_reason || "N/A"}
- **Advised salary ask:** ${info.job_info.advised_salary_ask || "N/A"}
    - ${info.job_info.advised_salary_ask_reason || "N/A"}

## Application Process

### Overview

${info.job_info.application_process}

- Expected Response Time: ${info.job_info.expected_response_time || "N/A"}

### Behavioral Questions

${formatInterviewQuestions(info.job_info.behavioral_questions || [])}

### Technical Questions

${formatInterviewQuestions(info.job_info.technical_questions || [])}

### Coding Questions

${formatInterviewQuestions(info.job_info.coding_questions || [])}

### Additional Information

${formatAdditionalInformation(info.job_info.additional_information || [])}
`).trim();
};
    
const formatInterviewQuestions = (
    questions: {
        question: string;
        question_source: string;
        answer: string;
        what_they_look_for: string;
        what_to_study: string;
    }[]
): string => {
    return questions
        .map(q => 
            [
            `- **Question:** ${q.question || "N/A"}`,
            `  - **Answer:** ${q.answer || "N/A"}`,
            `  - **What they look for:** ${q.what_they_look_for || "N/A"}`,
            `  - **What to study:** ${q.what_to_study || "N/A"}`,
            `  - **Source of question:** ${q.question_source || "N/A"}`
            ].join('\n')
        ).join('\n\n');
}

const formatAdditionalInformation = (
    additionalInfo: {
        information_title: string;
        text: string;
    }[]
): string => {
    return additionalInfo
    .map(info =>
        [
        `- **${info.information_title || "N/A"}:**`,
        `  - ${info.text || "N/A"}`,
        ].join('\n')
        ).join('\n');
    }