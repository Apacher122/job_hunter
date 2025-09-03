import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../../..');

const resolveRoot = (...segments: string[]) => {
    return path.join(root, ...segments);
};
const latexRoot = resolveRoot('src', 'shared', 'templates', 'latex', 'original-template');

const outputPaths = {
    dir: resolveRoot('output'),
    resumes: resolveRoot('output', 'resumes'),
    coverLetters: resolveRoot('output', 'cover_letters'),
    changeReport: resolveRoot('output', 'change-summary.md'),
    matchSummary: (title = '') => resolveRoot('output', 'match_summaries', `${title}_match_summary.md`),
    compiledResume: (title = '') => resolveRoot('output', `${title}_resume.pdf`),
    movedResume: (title = '') => resolveRoot('output', 'resumes', `${title}_resume.pdf`),
    compiledCoverLetter: (title = '') => resolveRoot('output', `${title}_cover_letter.pdf`),
    movedCoverLetter: (title = '') => resolveRoot('output', 'cover_letters', `${title}_cover_letter.pdf`),
    sectionJson: (title = '') => resolveRoot('output', 'json_resume', `${title}.json`),
    guidingAnswers: (title = '') => resolveRoot('output', 'guiding_answers', `${title}_guiding_answers.md`),
    plaintextResume: (title = '') => resolveRoot('output', `resumes`, `plain_text`, `${title}_resume.txt`),
    companyInfo: (title = '') => resolveRoot('output', 'company_info', `${title}_company_info.md`),
}

const dataPaths = {
    currentResumeData: resolveRoot('data', 'user_info', 'resume.json'),
    resumeCorrections: resolveRoot('data', 'corrections', 'resumeCorrections.txt'),
    currentCoverLetterData: resolveRoot('data', 'user_info', 'coverLetter.txt'),
    coverLetterCorrections: resolveRoot('data', 'corrections', 'coverLetterCorrections.txt'),
    jobData: resolveRoot('data','jobPosting.txt'),
    aboutMe: resolveRoot('data', 'user_info', 'aboutMe.txt'),
    possibleQuestions: resolveRoot('data', 'possible_questions.txt'),
    writingExamples: (fileName = '') => resolveRoot('data', 'my_writing', `${fileName}.txt`),
    writingExamplesDir: resolveRoot('data', 'user_info', 'my_writing'),
    jobList: resolveRoot('data', 'job_list.json'),
    considerations: resolveRoot('data', 'user_info', 'considerations.txt'),
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