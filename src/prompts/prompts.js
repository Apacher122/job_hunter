export const prompts = { 
    experience: (resumeData, jobPostingContent) =>`
    Rules:
    Make adjustments for each position I held in my JSON-formatted maximize compatibility with a job description.
    Optimize it for ATS.
    Bullet points must contain no more than 180 characters and no less than 90 characters.
    You are allowed to remove or rephrase any "responsibilities" or "description" item for each position held if it is
    redundant, wordy, annoying, cliché, and/or irrelevant.
    Avoid common resume mistakes.
    Take into account what current skills are in demand in the current job market.
    Utilize best practice for resume writing, as well as proven methods to pass ATS.
    I don't want recruiters to look at my resume and say something like "Oh brother this is the same old stuff."
    I included a word-vomit description of what I did at a job (not all have this), so you can use that to help you infer on what I did in that job and create bullet points that might be effective at landing me an interview.
    If possible and if available, use application data from the company I am applying for to help you make the resume more effective.
    Try your best to make me stand out from other applicants. Think about what makes me unique and how I can best present that as an asset to the company.
    Avoid patterns that identify me as a "job hopper" or "resume spammer."
    Avoid using the same words over and over again.
    Avoid using the same sentence structure over and over again.
    Avoid using the same phrases over and over again.
    Avoid patterns that identify the resume as "AI generated."
    Avoid stuffing my resume with keywords just to pass ATS. Make it realistic, but do not downplay my experience.
    Avoid sentence structures that are too complex or convoluted.
    Avoid making my resume annoying.
    Utilize wording that is more likely to be used by a well-educated human.
    You are not allowed to remove experiences, only descriptions/responsibilities.
    You may infer/suggest new "responsibilities" or "description" bullet points based off current experience, but they must match my experience level and the role.
    You may combine existing bullet points if it makes complete sense, not misleading, and justifiable.
    Provide justification for changes.
    There must be at least 4 "responsibilities" or "description" items for each position.
    You may add more than 4 bullet points if effective.
    DO NOT LIE.
  
    My resume as a JSON: ${resumeData}\n\n
    Description of job I am applying for: ${jobPostingContent}`,

    skills: (resumeData, jobPostingContent) =>`
    Make adjustments for technical skills notated in my JSON-formatted resume to better match a job description.
    Optimize it for ATS.

    Rules:
    From the technical skills section of my resume, pick skills relevant to the job description, but do not leave each category too sparse.
    You may leave certain technologies in if they are translatable to the job, or if they are a good indicator of diversified knowledge.
    Each skill has a number in parenthesis next to it, which indicates the level of proficiency I have with that skill.
    For the chosen relevant skills, order them by levels of proficiency, but do not include the number in parenthesis.
    No soft skills in this section.
    Do not add technologies that are not in my resume.
    Provide justification for changes made to each skill category.
    DO NOT LIE.
  
    My resume as a JSON: ${resumeData}\n\n
    Description of job I am applying for: ${jobPostingContent}`,

    projects: (resumeData, jobPostingContent) =>`
    Make adjustments for each project listed on my JSON-formatted resume to better match a job description.
    Optimize it for ATS.

    Rules:
    If a long description is given instead of bullet points, you may split it into bullet points.
    Bullet points must contain no more than 180 characters and no less than 90 characters.
    Prioritize recent projects and ongoing projects.
    If there are multiple ongoing projects, place the most relevant one first.
    Add, remove, and/or rephrase any "description" bullet points to each project as necessary to better match the job description and requirements.
    Make sure to include the programming languages and technologies used in the project as it fits the job description and requirements.
    Do not add technologies not already mentioned in the project.
    There must be at least 3 bullet points for each project.
    Only change the project name if it is unprofessional.
    Do not change roles or statuses of projects.
    Provide justification for changes made to each project.
    DO NOT LIE.
    
    My resume as a JSON: ${resumeData}\n\n
    Description of job I am applying for: ${jobPostingContent}`,

    applicationGuide: (jobPostingContent, resume = null) =>`
    I will provide a job posting and my resume.

    To provide insight on how compatible I am with the job and company, you must:
    - Score my compatibility to the job and company out of 100.
    - Justify the score.
    - Provide a probability of success for my applicant profile.
    - "True" if I am compatible, "False" if I am not.

    
    To provide insight on how to improve my resume, you must:
    - Score my resume out of 100.
    - Provide constructive feedback on my resume.

    For any other suggestions
    - Provide a helpful suggestion.
    - Justify the suggestion.
    `,

    reviewCoverLetter: (coverLetterData, jobPostingContent) =>`
    Review my cover letter to ensure it is optimized for the job description.

    You provide the following scores:
    - Score cover letter content out of 100.
    - Score cover letter grammar out of 100.
    - Score cover letter format out of 100.
    `,

    reviewResume: (resumeData, jobPostingContent) =>`
    Review my resume to ensure it is optimized for the job description.

    Rules:
    Simulate an ATS screen by:
    - Extracting job description keywords.
    - Parsing my resume.
    - Scoring overlap.
    - Giving feedback on what to add, remove, or reword.
    - Keyword Matching: compare resume to a job description and highlight missing or mismatched keywords (skills, titles, tools).
    - Section Structure Analysis: flag missing sections (e.g., summary, skills, education, experience) or formatting that might confuse an ATS parser.
    - Parsing Test: simulate how ATS might extract job titles, dates, company names, and education to identify errors or formatting issues.
    - Scoring & Fit: give a reasoned judgment about my resume's likely match score based on the presence of required qualifications.
    `,

    match_summary : (resumeData, jobPostingContent) =>`
    Review my resume that is a PDF converted to Base64 and the job description I am applying for.
    You provide the following match scores out of 100 with justifications:
    - Company Culture Fit
    - Job Description Fit
    - Skills Fit
    - Experience Fit
    - Education Fit
    - Overall Fit

    For each score, provide:
    - A probability of success for my applicant profile.
    - A probability of success equation.
    - A probability of success justification.
    - A boolean indicating if I am compatible with the job and company.

    Then provide an overall match summary.

    Then list things I could do to improve my chances of getting an interview.

    My base64 PDF resume: ${resumeData}\n\n
    Description of job I am applying for: ${jobPostingContent}
    `
}
