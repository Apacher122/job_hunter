import * as path from 'path';

import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../../..');

const resolveRoot = (...segments: string[]) => {
    return path.join(root, ...segments);
};
const latexRoot = resolveRoot('src', 'shared', 'templates', 'latex', 'original-template');

const outputPaths = {
    dir: resolveRoot('output'),
    tempPdf: (uid = '', jobId = 0) =>resolveRoot('output', 'temp', `${uid}`, 'pdf'),
    tempDir: (uid = '', jobId = 0) =>resolveRoot('output', 'temp', `${uid}`),
    tempJson: (uid = '', docType = '') =>resolveRoot('output', 'temp', `${uid}`, 'json', `${docType}`),
    resumes: resolveRoot('output', 'resumes'),
    coverLetters: resolveRoot('output', 'cover_letters'),
    changeReport: resolveRoot('output', 'change-summary.md'),
    jsonResume: (title = '', id = '') => resolveRoot('output', 'json_resume', `${title}_resume_${id}.json`),
    matchSummary: (title = '', id = '') => resolveRoot('output', 'match_summaries', `${title}_match_summary_${id}.md`),
    compiledResume: (title = '', id = 0) => resolveRoot('output', `${title}_resume_${id}.pdf`),
    movedResume: (title = '', id = 0) => resolveRoot('output', 'resumes', `${title}_resume_${id}.pdf`),
    compiledCoverLetter: (title = '', id = '') => resolveRoot('output', `${title}_cover_letter_${id}.pdf`),
    movedCoverLetter: (title = '', id = '') => resolveRoot('output', 'cover_letters', `${title}_cover_letter_${id}.pdf`),
    sectionJson: (title = '') => resolveRoot('output', 'json_resume', `${title}.json`),
    guidingAnswers: (title = '', id = '') => resolveRoot('output', 'guiding_answers', `${title}_guiding_answers_${id}.md`),
    plaintextResume: (title = '') => resolveRoot('output', `resumes`, `plain_text`, `${title}_resume.txt`),
    companyInfo: (title = '', id = '') => resolveRoot('output', 'company_info', `${title}_company_info_${id}.md`),
}

const dataPaths = {
    privateKey: resolveRoot('config', 'private_key.pem'),
    currentResumeData: resolveRoot('data', 'user_info', 'resume.json'),
    currentCoverLetter: resolveRoot('data', 'user_info', 'coverLetter.txt'),
    currentResumeTxt: resolveRoot('data', 'user_info', 'resume.txt'),
    jobData: (title = '', id = 0) => resolveRoot('data', 'job_data', `${title}_job_posting_${id}.txt`),
    aboutMe: resolveRoot('data', 'user_info', 'aboutMe.txt'),
    mistakes: resolveRoot('data', 'corrections', 'mistakesMade.txt'),
    corrections: resolveRoot('data', 'corrections', 'correctionsToCoverLetter.txt'),
    possibleQuestions: resolveRoot('data', 'possible_questions.txt'),
    writingExamples: (fileName = '') => resolveRoot('data', 'my_writing', `${fileName}.txt`),
    writingExamplesDir: resolveRoot('data', 'user_info', 'my_writing'),
    jobList: resolveRoot('data', 'job_list.json'),
    considerations: resolveRoot('data', 'user_info', 'considerations.txt'),
    processedJobInfo: resolveRoot('data', 'processed_job_info.txt'),
    processedJobInfoTemplate: resolveRoot('data', 'processed_job_info_template.txt'), 
}

const logPaths = {
    infoLogFile: resolveRoot('logs', 'info.log'),
    errorLogFile: resolveRoot('logs', 'error.log'),
}

const googleAuthPaths = {
    googleCredentials: resolveRoot('config', 'gmail_api', 'credentials.json'),
    googleToken: resolveRoot('config', 'gmail_api', 'token.json'),
}

const latexPaths = {
    class: path.join(latexRoot, 'awesome-cv.cls'),
    resume: {
        education: path.join(latexRoot, 'compiled', 'education.tex'),
        educationTemplate: path.join(latexRoot, 'templates', 'education-template.tex'),
        experiences: path.join(latexRoot, 'compiled', 'experience.tex'),
        experiencesTemplate: path.join(latexRoot, 'templates', 'experience-template.tex'),
        extracurriculars: path.join(latexRoot, 'compiled', 'extracurriculars.tex'),
        extracurricularsTemplate: path.join(latexRoot, 'templates', 'extracurriculars-template.tex'),
        honors: path.join(latexRoot, 'compiled', 'honors.tex'),
        honorsTemplate: path.join(latexRoot, 'templates', 'honors-template.tex'),
        projects: path.join(latexRoot, 'compiled', 'projects.tex'),
        projectsTemplate: path.join(latexRoot, 'templates', 'projects-template.tex'),
        skills: path.join(latexRoot, 'compiled', 'skills.tex'),
        skillsTemplate: path.join(latexRoot, 'templates', 'skills-template.tex'),
        summary: path.join(latexRoot, 'compiled', 'summary.tex'),
        summaryTemplate: path.join(latexRoot, 'compiled', 'summary-template.tex'),
        resume: path.join(latexRoot, 'resume.tex'),
        resumeTemplate: path.join(latexRoot, 'templates','resume-template.tex'),
    },
    coverLetter: {
        letter: path.join(latexRoot, 'coverletter.tex'),
        template: path.join(latexRoot, 'templates','coverletter-template.tex'),
    },
    cv: {
        cv: path.join(latexRoot, 'cv.tex'),
        cvTemplate: path.join(latexRoot, 'templates', 'cv-template.tex'),
    },
    originalTemplate: path.join(latexRoot),
    tempTemplate: (uid = '', jobId = 0) =>resolveRoot('output', 'temp', `${uid}`, 'templates'),
    tempCompiled: (uid = '', jobId = 0) =>resolveRoot('output', 'temp', `${uid}`, 'compiled'),
    template: (name: string) => path.join(latexRoot, 'templates', `${name}-template.tex`),
}

const openai = {
    instructions: (folder = '') => resolveRoot('src', 'shared', 'txt_prompts', `${folder}`, `instructions.txt`),
    prompt: (folder = '') => resolveRoot('src', 'shared', 'txt_prompts', `${folder}`, `prompt.txt`),
};

export default {
    root,
    resolveRoot,
    paths: {
        ...outputPaths,
        ...dataPaths,
        ...logPaths,
        ...googleAuthPaths,
    },
    latex: latexPaths,
    openaiPrompts: openai,
}

