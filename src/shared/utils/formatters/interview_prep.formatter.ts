import { InterviewPrepType } from "../../../job_guide/models/interview_prep.models";

export const interviewPrepFormatter = (info: InterviewPrepType): string => {
    return `
# Interview Preparation Guide

## Tech Stack

${formatTechStack(info.tech_stack_info)}

## Job Requirements

${formatJobRequirements(info.job_requirement_info)}

## Product Information

${formatProductInfo(info.product_info)}

## Team Specifics

${formatTeamSpecifics(info.team_specifics)}

## Interview Questions

### Behavioral Questions

${formatInterviewQuestions(info.behavioral_questions)}

### Technical Questions

${formatInterviewQuestions(info.technical_questions)}

### Coding Questions

${formatInterviewQuestions(info.coding_questions, true)}
`
};


const formatTechStack = (techStack: any[]): string => {
    return techStack.map(item => {
        const techHeader = `* **${item.tech}**`;
        const techDetails = item.tech_info.map((info: any) => `  - ${info.info}`).join('\n');
        return `${techHeader}\n${techDetails}`;
    }).join('\n\n');
}

const formatJobRequirements = (requirements: any[]): string => {
    return requirements.map(item => {
        return `* **${item.requirement}**\n  - ${item.things_to_know}`;
    }).join('\n\n');
}

const formatProductInfo = (product: any): string => {
    const productHeader = `* **${product.product_name}**`;
    const productDetails = product.product_info.map((info: any) => `  - ${info.info}`).join('\n');
    return `${productHeader}\n${productDetails}`;
}

const formatTeamSpecifics = (teams: any[]): string => {
    return teams.map(item => {
        return `* **${item.team}**\n  - Structure: ${item.team_structure}\n  - Working Style: ${item.team_working_style}\n  - Goals: ${item.team_goals}`;
    }).join('\n\n');
}

const formatInterviewQuestions = (
    questions: {
        question: string;
        question_source: string;
        answer: string;
        what_they_look_for: string;
        what_to_study: string;
    }[],
    formatAsCodeBlock: boolean = false
): string => {
    return questions
        .map(q => 
            [,
            `- **Question:** ${q.question || "N/A"}`,
            `  - **Answer:** ${q.answer || "N/A"}`,
            `${formatAsCodeBlock ? `${q.answer}` : `  - ${q.answer}`}`,
            `  - **What they look for:** ${q.what_they_look_for || "N/A"}`,
            `  - **What to study:** ${q.what_to_study || "N/A"}`,
            `  - **Source of question:** ${q.question_source || "N/A"}`,
            ].join('\n')
        ).join('\n\n');
}