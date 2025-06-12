import { fileURLToPath } from 'url';
import path from 'path';
import { resolve } from 'dns';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../../..');
// const latexFilesPath = `/usr/src/app/src/latex`;

const resolveRoot = (...segments: string[]) => {
    return path.join(root, ...segments);
};
const latexRoot = resolveRoot('src', 'latex');

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
}

const dataPaths = {
    currentResumeData: resolveRoot('data', 'resume.json'),
    jobData: resolveRoot('data', 'jobPosting.txt'),
    aboutMe: resolveRoot('data', 'aboutMe.txt'),
    mistakes: resolveRoot('data', 'mistakesMade.txt'),
    possibleQuestions: resolveRoot('data', 'possible_questions.txt'),
    writingExamples: (fileName = '') => resolveRoot('data', 'my_writing', `${fileName}.txt`),
    writingExamplesDir: resolveRoot('data', 'my_writing'),
    jobList: resolveRoot('data', 'job_list.json'),
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
        education: path.join(latexRoot, 'resume', 'education.tex'),
        educationTemplate: path.join(latexRoot, 'template', 'education-template.tex'),
        experiences: path.join(latexRoot, 'resume', 'experience.tex'),
        experiencesTemplate: path.join(latexRoot, 'template', 'experience-template.tex'),
        extracurriculars: path.join(latexRoot, 'resume', 'extracurriculars.tex'),
        extracurricularsTemplate: path.join(latexRoot, 'template', 'extracurriculars-template.tex'),
        honors: path.join(latexRoot, 'resume', 'honors.tex'),
        honorsTemplate: path.join(latexRoot, 'template', 'honors-template.tex'),
        projects: path.join(latexRoot, 'resume', 'projects.tex'),
        projectsTemplate: path.join(latexRoot, 'template', 'projects-template.tex'),
        skills: path.join(latexRoot, 'resume', 'skills.tex'),
        skillsTemplate: path.join(latexRoot, 'template', 'skills-template.tex'),
        summary: path.join(latexRoot, 'resume', 'summary.tex'),
        summaryTemplate: path.join(latexRoot, 'resume', 'summary-template.tex'),
        resume: path.join(latexRoot, 'resume.tex'),
        resumeTemplate: path.join(latexRoot, 'template','resume-template.tex'),
    },
    coverLetter: {
        letter: path.join(latexRoot, 'coverletter.tex'),
        template: path.join(latexRoot, 'template','coverletter-template.tex'),
    },
    cv: {
        cv: path.join(latexRoot, 'cv.tex'),
        cvTemplate: path.join(latexRoot, 'template', 'cv-template.tex'),
    },
    template: (name: string) => path.join(latexRoot, 'template', `${name}-template.tex`),
}

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
}

// export default {
//     // Files used for data, logging, and output
//     paths: {
//         // Output directories
//         output_dir: path.join(root, `output`), // Output Directory
//         pdf_output_dir: path.join(root, `output`, `resumes`), // PDF Output Directory
//         change_report: path.join(root, `output`, `change-summary.md`), // Change report notating new changes on resume
//         cover_letter_pdf_output_dir:path.join(root, `output`, `cover_letters`), // Cover Letter PDF
//         match_summary_path: (title = '') => path.join(root, `output`, `match_summaries`, `${title}_match_summary.md`), // Summary of the match between resume and job posting
//         compiled_resume: (title = '') => path.join(root, `output`, `${title}_resume.pdf`), // The actual resume as a pdf
//         moved_resume: (title = '') => path.join(root, `output`, `resumes`, `${title}_resume.pdf`), // The actual resume as a pdf
//         compiled_cover_letter: (title = '') => path.join(root, `output`, `${title}_cover_letter.pdf`), // The actual cover letter as a pdf
//         moved_cover_letter: (title = '') => path.join(root, `output`, `cover_letters`, `${title}_cover_letter.pdf`), // The actual cover letter as a pdf
//         section_json: (title = '') => path.join(root, `output`, `json_resume`, `${title}.json`), // JSON resume output
//         guiding_answers: (title = '') => path.join(root, `output`, `guiding_answers`, `${title}_guiding_answers.md`), // Guiding answers output

//         // Information files
//         current_resume_data: path.join(root, `data`, `resume.json`), // Resume Data
//         job_data: path.join(root, `data`, `jobPosting.txt`), // Job Posting Data
//         writing_examples: (file_name = '') =>path.join(root, `data`, `my_writing`, `${file_name}.txt`), // Writing examples for prompts
//         writing_examples_dir: path.join(root, `data`, `my_writing`), // Directory for writing examples
//         about_me: path.join(root, `data`, `aboutMe.txt`), // About me text file
//         mistakes: path.join(root, `data`, `mistakesMade.txt`), // Mistakes data file
//         possible_questions: path.join(root, `data`, `possible_questions.txt`), // Possible questions data file
        
//         // log and errors
//         info_log_file: path.join(root, `logs`, `info.log`), // Log File
//         error_log_file: path.join(root, `logs`, `error.log`), // Error Log File
//         google_credentials: path.join(root, `config`, `gmail_api`, `credentials.json`), // Google credentials for Gmail API
//         google_token: path.join(root, `config`, `gmail_api`, `token.json`), // Google credentials for Gmail API        
//     },

//     // Files used for LaTeX templates
//     latex_files: {
//         education: `${latexFilesPath}/resume/education.tex`, // Education section of resume
//         education_template: `${latexFilesPath}/resume/education-template.tex`, // Education Template
//         experiences: `${latexFilesPath}/resume/experience.tex`, // Experience section of resume
//         extracurriculars: `${latexFilesPath}/resume/extracurriculars.tex`, // Extracurriculars section of resume
//         honors: `${latexFilesPath}/resume/honors.tex`, // Honors section of resume
//         projects: `${latexFilesPath}/resume/projects.tex`, // Projects section of resume
//         skills: `${latexFilesPath}/resume/skills.tex`,  // Skills section of resume
//         summary: `${latexFilesPath}/resume/summary.tex`, // Summary section of resume
//         cv: `${latexFilesPath}/cv.tex`, // CV produced by the CV template
//         cv_template: `${latexFilesPath}/cv-template.tex`, // CV Template
//         resume: `${latexFilesPath}/resume.tex`, // Resume produced by the resume template
//         resume_template: `${latexFilesPath}/resume-template.tex`, // Resume Template
//         cover_letter: `${latexFilesPath}/coverletter.tex`, // Cover Letter produced by the cover letter template
//         cover_letter_template: `${latexFilesPath}/coverletter-template.tex`, // Cover Letter Template
//     }
// }