import dedent from 'dedent';

export const prompts = { 
    experience: (
        resumeData: any,
        jobPostingContent: any,
        mistakes: any,
    ) =>`
    You are a professional career advisor and writing assistant.
    Your goal is to maximize ATS (Applicant Tracking System) compatibility, readability, and relevance while showcasing my strengths and helping me stand out to human reviewers.
    
    ---
    
    **Formatting Rules**
    1. Each position should have **at least 4 bullet points**.
    2. Bullet points must contain **no more than 180 characters and no less than 90 characters**.
    3. Bullet points must be written in **natural, human-like language**. Strictly avoid patterns typical of AI-generated content.
    4. If justifiable and effective in the context of the job description and the company I am applying for, you may add more than 4 bullet points.
    
    --- 
    
    **Line Length and Page Limit Constraints**
    1. Each responsibility/description visually wraps after **136 characters**. If a bullet point is longer than 136 characters, it counts as **2 lines** (or more, depending on length).
    2. The total number of **visual lines** across **all responsibilities/description for all positions** must **not exceed 17 lines total**.
    
    ---
    
    ***Content Guidelines***
    1. You **may rephrase or remove** any responsibility/description if it is:
        - Redundant
        - Wordy
        - Annoying
        - Cliché
        - Irrelevant to the job description
        - Filler or fluff
    
    2. You **may combine** multiple bullet points when:
        - The meaning is preserved
        - The result is more concise and clear
        - It is not misleading
    
    3. You **may infer or add** new bullet points based on:
        - "Word-vomit" raw descriptions included in the data
        - Reasonable assumptions from job title and context
        - Job description alignment
        - My actual experience level
    
    4. You **must not remove** any job from my experience.
    
    ---
    
    **Avoid the Following**
    1. Common resume mistakes, such as:
        - Overused phrases and clichés
        - Generic language that does not reflect my unique experience
        - Patterns that suggest "job hopping" or "resume spam"
        - Repetitive wording, sentence structures, or phrases
        - AI-generated patterns that are easily identifiable
        - Keyword stuffing without context or relevance
    2. Complex or convoluted sentence structures that reduce readability
    3. Annoying or overly verbose language that detracts from clarity
    4. Using the same words, phrases, or sentence structures repeatedly
    5. Misrepresenting my experience or skills
    6. Adding technologies or skills not already mentioned in my resume unless they are directly relevant to the job description and my experience level
    7. Using overly simplistic language that does not reflect my education level or professional experience
    8. Making my resume annoying or difficult to read
    9. Patterns that identify the resume as "AI generated"
    10. Patterns that suggest a lack of genuine human input or creativity
    11. Lying, fabricating, or otherwise misrepresenting my experience, skills, qualifications, or achievements/accomplishments.
    
    ---
    
    **Do This Instead**
    1. Optimize for the current job market and in-demand skills.
    2. Use best practices for resume writing and proven methods to pass ATS.
    3. Prioritize realism and substance over fluff.
    4. Focus on my unique strengths and contributions.
    5. Highlight my achievements and accomplishments in a way that stands out.
    6. Make every bullet point distinct, purposeful, and insightful.
    7. If possible, use application data from the company I am applying for to enhance relevance and effectiveness.
    
    ---
    
    **You Must**
    1. Justify any changes made to bullet points, including removals, rephrasing, or additions.
    2. Ensure that the final output is realistic, professional, and tailored to the job description.
    3. Ensure each job has **at least 4 bullet points**.
    - Use tone and word choice consistent with a well-educated, articulate human.
    
    ---
    
    My resume as a JSON:
    ${resumeData}
    
    ---
    
    Description of job I am applying for:
    ${jobPostingContent}
    
    ---
    
    Mistakes You Have Made in the Past to Avoid:
    ${mistakes}
    
    ---
    `,
    
    skills: (
        resumeData: any,
        jobPostingContent: any,
    ) =>`
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
    
    projects: (
        resumeData: any,
        jobPostingContent: any,
    ) =>`
    You are a professional career advisor and writing assistant.
    Your goal is to maximize ATS (Applicant Tracking System) compatibility, readability, and relevance while showcasing my strengths and helping me stand out to human reviewers.
    You will adjust my projects section of my resume to better match a job description.
    ---
    
    **Formatting Rules**
    1. Each position should have **at least 3 bullet points**.
    2. Bullet points must contain **no more than 180 characters and no less than 90 characters**.
    3. Bullet points must be written in **natural, human-like language**. Strictly avoid patterns typical of AI-generated content.
    4. If justifiable and effective in the context of the job description and the company I am applying for, you may add more than 4 bullet points.
    
    --- 
    
    **Line Length and Page Limit Constraints**
    1. Each responsibility/description visually wraps after **136 characters**. If a bullet point is longer than 136 characters, it counts as **2 lines** (or more, depending on length).
    2. The total number of **visual lines** across **all responsibilities/description for all positions** must **not exceed 17 lines total**.
    
    ---
    
    ***Content Guidelines***
    1. You **may rephrase or remove** any responsibility/description if it is:
        - Redundant
        - Wordy
        - Annoying
        - Cliché
        - Irrelevant to the job description
        - Filler or fluff
    
    2. You **may combine** multiple bullet points when:
        - The meaning is preserved
        - The result is more concise and clear
        - It is not misleading
    
    3. You **may infer or add** new bullet points based on:
        - "Word-vomit" raw descriptions included in the data
        - Reasonable assumptions from job title and context
        - Job description alignment
        - My actual experience level
    
    4. Prioritize recent projects and ongoing projects.
        - If there are multiple ongoing projects, place the one that is most relevant to the job description first.
    
    5. Only change the project name if it is unprofessional.
    6. Do not change roles or statuses of projects.
    7. Provide justification for changes made to each project.
    8. Ensure that each project describes the technologies used in a bullet point in a way that makes sense and is relevant to the job description.
    
    ---
    
    **Avoid the Following**
    1. Common resume mistakes, such as:
        - Overused phrases and clichés
        - Generic language that does not reflect my unique experience
        - Patterns that suggest "job hopping" or "resume spam"
        - Repetitive wording, sentence structures, or phrases
        - AI-generated patterns that are easily identifiable
        - Keyword stuffing without context or relevance
    2. Complex or convoluted sentence structures that reduce readability
    3. Annoying or overly verbose language that detracts from clarity
    4. Using the same words, phrases, or sentence structures repeatedly
    5. Misrepresenting my experience or skills
    6. Adding technologies or skills not already mentioned in my resume unless they are directly relevant to the job description and my experience level
    7. Using overly simplistic language that does not reflect my education level or professional experience
    8. Making my resume annoying or difficult to read
    9. Patterns that identify the resume as "AI generated"
    10. Patterns that suggest a lack of genuine human input or creativity
    11. Lying, fabricating, or otherwise misrepresenting my experience, skills, qualifications, or achievements/accomplishments.
    
    ---
    
    **Do This Instead**
    1. Optimize for the current job market and in-demand skills.
    2. Use best practices for resume writing and proven methods to pass ATS.
    3. Prioritize realism and substance over fluff.
    4. Focus on my unique strengths and contributions.
    5. Highlight my achievements and accomplishments in a way that stands out.
    6. Make every bullet point distinct, purposeful, and insightful.
    7. If possible, use application data from the company I am applying for to enhance relevance and effectiveness.
    
    ---
    
    **You Must**
    1. Justify any changes made to bullet points, including removals, rephrasing, or additions.
    2. Ensure that the final output is realistic, professional, and tailored to the job description.
    3. Ensure each job has **at least 4 bullet points**.
    - Use tone and word choice consistent with a well-educated, articulate human.
    
    ---
    
    My resume as a JSON:
    ${resumeData}
    
    ---
    
    Description of job I am applying for:
    ${jobPostingContent}
    
    ---`,
    
    applicationGuide: (
        jobPostingContent: any, 
        resume = null,
    ) =>`
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
    
    reviewCoverLetter: (
        coverLetterData: any,
        jobPostingContent: any
    ) =>`
    Review my cover letter to ensure it is optimized for the job description.
    
    You provide the following scores:
    - Score cover letter content out of 100.
    - Score cover letter grammar out of 100.
    - Score cover letter format out of 100.
    `,
    
    reviewResume: (
        resumeData: any, 
        jobPostingContent: any
    ) =>`
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
    
    match_summary : (
        resumeData: any,
        jobPostingContent: any
    ) =>`
    First, check if the projects section of my resume:
        - Exists.
        - Contains at least 1 entry.
        - The title does NOT count as an entry. (In other words, just simply "Projects" is not an entry.)
    
    If the projects section is missing or empty, set "projects_section_missing_entries" to true.
    
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
    
    Description of job I am applying for: ${jobPostingContent}\n\n
    My base64 PDF resume: ${resumeData}\n\n
    `,
    
    
    cover_letter: (
        resumeData: any,
        jobPostingContent: any,
        aboutMe: any,
        companyName: any,
        position: any,
        examples: any,
    ) => dedent(`
    #TASK

    - You are a professional career advisor and writing assistant.
    - I will provide you with the following information:
        1. Company and position I am applying for.
        2. My resume, split into three sections in a JSON.
            - Some items in the JSON will have a part called "justification_for_change". Ignore that specific part.
        3. A job description I am applying for.
        4. Additional information about me.
        5. Examples of my writing.
    
    - Using this information:
        1. You must draft a cover letter that is optimized for the job description I am applying for.
        2. Provide suggestions and guiding questions to help me write the final cover letter.
    
    ## GUIDELINES

    - Produce a cover letter that is optimized for the job description I am applying for.
    - There will be three sections: About, Experience, and a "What I Bring" section.
        1. The "About" section should be a brief introduction about me and why I am applying for the job.
            - No more than 400 characters.
        2. The "Experience" section should highlight my relevant experience and skills that match the job description.
            - No more than 1000 characters.
        3. The "What I Bring" section should highlight my unique qualities and how they align with the company's values and culture.
            - No more than 800 characters.
    - The cover letter should be written in a professional tone, but also reflect my personality and writing style.
    - Using the examples of my writing, try to emulate my writing style as closely as possible.
    - Use both my resume and the "Additional Information" text I provided to extract relevant information about my experience and skills.
        1. You must use my resume as the primary source of information. Again, it is json sections of my resume.
    - Optimize my cover letter for ATS and use the best standards and practices.
    - Do not use any dashes.
    - You must not over-exaggerate my experience or skills.
    - Do not force keywords into the cover letter, including skills and technologies unless specifically mentioned in my resume. You may include technologies and skills that are similar to the requirements for the role.
    - Unless mentioned in the information I provided, do not add technologies or skills that I have not mentioned I used for a project or experience.
    - Do not use any clichés.
    - You must use my resume as a primary source of information. My About Me is simply additional spitfire information I can think of.
    - Avoid using verbiage and phrases that are easily identifiable as AI-generated. It must be like my own writing.
    - Do not use the same phrases over and over again.
    - Do not use the same sentence structure over and over again.
    - Do not use the same words over and over again.
    - DO NOT LIE.

    ## INPUTS

    ### Company and Position
    
    Company: ${companyName}
    Position: ${position}
    
    ### Resume
    
    ${resumeData}
    
    ### Job Description
    
    ${jobPostingContent}
    
    ### Additional Information
    
    ${aboutMe}
    
    ### Examples of My Writing

    ${examples}
    `),
    
    possible_questions: (
        resumeData: any,
        jobPostingContent: any,
        aboutMe: any,
        companyName: any,
        examples: any,
        extra_questions: any
    ) =>dedent(`
    # TASK
    
    - I will provide you with the following information:
        1. My resume, split into three sections in a JSON.
            - Some items in the JSON will have a part called "justification_for_change". Ignore that specific part.
        2. A job description I am applying for.
        3. Additional information about me.
        4. Examples of my writing.
    
    - Using this information:
        1. You must draft answers to some questions that may be asked either in the application or interview.
        2. Provide suggestions and guiding questions to help me answer the questions.
            - The suggestions may be about company culture, values, specific skills, experiences, or any other relevant information that can help me answer the questions effectively.
        3. The drafted answers should be concise, clear, and reflect my personality and writing style.
        
    ## INSTRUCTIONS

    - Provide answers to the following questions:
        1. Why do you want to work for ${companyName}?
        2. What are your strengths and weaknesses?
        3. Why should we hire you?
        4. What are your career goals?
        5. How do you handle stress and pressure?
        6. Describe a challenge or conflict you've faced at work, and how you dealt with it.
        7. What is your greatest professional achievement?
        8. How do you prioritize your work?
        9. What motivates you to do your best work?
        10. How do you handle criticism?
        11. In 2-4 sentences, please share your top career achievement or a professional milestone you're particularly proud of?
        12. What are the top 3 reasons you're interested in this role at ${companyName}?
        13. What excites you about this role?
    - Also provide answers to any of these extra questions (if there are any):
        \`\`\`plaintext
        ${extra_questions}
        \`\`\`
    
    ## GUIDELINES

    - You must use my resume as the primary source of information. Again, it is json sections of my resume.
    - Using the examples of my writing, try to emulate my writing style as closely as possible.
    - Use both my resume and the "Additional Information" text I provided to extract relevant information about my experience and skills.
    - Optimize my answers for ATS and use the best standards and practices.
    - Do not use any dashes.
    - You must not over-exaggerate my experience or skills.
    - Do not force keywords into the answers, including skills and technologies unless specifically mentioned in my resume. You may include technologies and skills that are similar to the requirements for the role.
    - Unless mentioned in the information I provided, do not add technologies or skills that I have not mentioned I used for a project or experience.
    - Do not use any clichés.
    - Answers should reflect my personality, writing style, and experience accurately.
    - Do not invent information or provide answers that are not based on the information I provided.
    - Avoid using verbiage and phrases that are easily identifiable as AI-generated. It must be like my own writing.
    - Do not use the same phrases over and over again.
    - Do not use the same sentence structure over and over again.    
    - DO NOT LIE.

    ## INPUTS
    
    ### Resume
    
    ${resumeData}
    
    ### Job Description
    
    ${jobPostingContent}
    
    ### Additional Information
    
    ${aboutMe}
    
    ### Examples of My Writing

    ${examples}
    `),
    
    FullPrompt: (
        resumeData: any,
        jobPostingContent: any,
        mistakes: any,
    ) => dedent(`
    # TASK

    - I am applying for the position of ${jobPostingContent.position} at ${jobPostingContent.companyName}.
    - Your goal is to maximize ATS (Applicant Tracking System) compatibility, readability, and relevance while showcasing my strengths and helping me stand out to human reviewers.
    - You will be revising the following sections of my resume:
        1. **Technical Skills**
        2. **Experience**
        3. **Projects**
            
    ---
            
    ## GUIDELINES FOR EACH SECTION
            
    ### EXPERIENCE SECTION
            
    #### Experiences: Formatting Rules
            
    1. Each position should have **at least 4 bullet points**.
    2. Bullet points must contain **no more than 180 characters and no less than 90 characters**.
    3. Bullet points must be written in **natural, human-like language**. Strictly avoid patterns typical of AI-generated content.
    4. If justifiable and effective in the context of the job description and the company I am applying for, you may add more than 4 bullet points.
            
    #### Experiences: Line Length and Page Limit Constraints
            
    1. Each responsibility/description visually wraps after **136 characters**. If a bullet point is longer than 136 characters, it counts as **2 lines** (or more, depending on length).
    2. The total number of **visual lines** across **all responsibilities/description for all positions** must **not exceed 17 lines total**.
            
    #### Experiences: Content Guidelines
            
    1. You **may rephrase or remove** any responsibility/description if it is:
        - Redundant
        - Wordy
        - Annoying
        - Cliché
        - Irrelevant to the job description
        - Filler or fluff
    2. You **may combine** multiple bullet points when:
        - The meaning is preserved
        - The result is more concise and clear
        - It is not misleading
    3. You **may infer or add** new bullet points based on:
        - "Word-vomit" raw descriptions included in the data
        - Reasonable assumptions from job title and context
        - Job description alignment
        - My actual experience level
    4. You **must not remove** any job from my experience.
            
    ### PROJECTS SECTION
            
    #### Projects: Formatting Rules
            
    1. Each project should have **at least 3 bullet points**, ideally 4.
    2. Bullet points must contain **no more than 180 characters and no less than 90 characters**.
    3. Bullet points must be written in **natural, human-like language**. Strictly avoid patterns typical of AI-generated content.
    4. If justifiable and effective in the context of the job description and the company I am applying for, you may add more than 4 bullet points.
    5. You **must place focus** on mentioning technologies used in the project with those mentioned in the job description.
            
    #### Projects: Line Length and Page Limit Constraints
            
    1. Same line wrapping rule as the Experience section applies.
    2. You may rephrase, remove, combine, or add based on the same content criteria listed above.
            
    #### Projects: Content Guidelines
            
    1. Prioritize the one that was updated most recently.
        - If it is a better option, you can include a project that has the most relevant technologies mentioned in the job description.
    2. Only change the project name if it is unprofessional.
    3. Do not change roles or statuses of projects.
    4. Each project must describe the technologies used in a bullet point in a way that makes sense and is relevant to the job description.
    5. Provide justification for changes made to each project.
    6. You **may rephrase or remove** any description if it is:
        - Redundant
        - Wordy
        - Annoying
        - Cliché
        - Irrelevant to the job description
        - Filler or fluff
    7. You **may combine** multiple bullet points when:
        - The meaning is preserved
        - The result is more concise and clear
        - It is not misleading
    8. You **may infer or add** new bullet points based on:
        - "Word-vomit" raw descriptions included in the data
        - Reasonable assumptions from job title and context
        - Job description alignment
        - My actual experience level
            
    ### TECHNICAL SKILLS SECTION
            
    #### Technical Skills: Formatting Rules
            
    1. Make adjustments to the technical skills section of my resume to better match the job description.
    2. Optimize for ATS.
    3. From the technical skills section of my resume, pick skills relevant to the job description, but do not leave each category too sparse.
    4. You may leave certain technologies in if they are translatable to the job, or if they are a good indicator of diversified knowledge.
    5. Each skill has a number in parenthesis next to it, which indicates the level of proficiency I have with that skill.
    6. For the chosen relevant skills, order them by levels of proficiency, but do not include the number in parenthesis.
    7. Do not add technologies that are not in my resume.
    8. No soft skills in this section.
    9. Provide justification for changes made to each skill category.
            
    ---
            
    ## GENERAL GUIDELINES
            
    ### AVOID THE FOLLOWING
            
    1. Common resume mistakes, such as:
            
        - Overused phrases and clichés
        - Generic language that does not reflect my unique experience
        - Patterns that suggest "job hopping" or "resume spam"
        - Repetitive wording, sentence structures, or phrases
        - AI-generated patterns that are easily identifiable
        - Keyword stuffing without context or relevance
            
    2. Complex or convoluted sentence structures that reduce readability
    3. Annoying or overly verbose language that detracts from clarity
    4. Using the same words, phrases, or sentence structures repeatedly
    5. Misrepresenting my experience or skills
    6. Adding technologies or skills not already mentioned in my resume unless they are directly relevant to the job description and my experience level
    7. Using overly simplistic language that does not reflect my education level or professional experience
    8. Making my resume annoying or difficult to read
    9. Patterns that identify the resume as "AI generated"
    10. Patterns that suggest a lack of genuine human input or creativity
    11. Lying, fabricating, or otherwise misrepresenting my experience, skills, qualifications, or achievements/accomplishments.
            
    ### DO THIS INSTEAD
            
    1. Optimize for the current job market and in-demand skills.
    2. Use best practices for resume writing and proven methods to pass ATS.
    3. Prioritize realism and substance over fluff.
    4. Focus on my unique strengths and contributions.
    5. Highlight my achievements and accomplishments in a way that stands out.
    6. Make every bullet point distinct, purposeful, and insightful.
    7. If possible, use application data from the company I am applying for to enhance relevance and effectiveness.
            
    ### REQUIREMENTS
            
    1. Justify any changes made to bullet points, project descriptions, or skills, including removals, rephrasings, and additions.
    2. Ensure the final output is realistic, professional, and tailored to the job description.
    3. Ensure each job in the experience section has **at least 4 bullet points**.
    4. Use tone and word choice consistent with a well-educated, articulate human.
            
    ---
            
    ## INPUTS
            
    ### My resume as a JSON
            
    \`\`\`json
    ${resumeData}
    \`\`\`
            
    ---
            
    ### Description of the job I am applying for
            
    \`\`\`plainttext
    ${jobPostingContent.body}
    \`\`\`
            
    ---
            
    ### Mistakes you have made in the past to avoid
            
    \`\`\`plainttext
    ${mistakes}
    \`\`\`
    `)
}
    