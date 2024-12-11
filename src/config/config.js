import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const latexFilesPath = `/usr/src/app/src/latex`;

export default {
    // Basic User Information
    user_info: {
        first_name: " ", // I hope you know this
        last_name: " ", // I hope you know this too
        summary: " ", // A one-liner. I.E. "Software Engineer at XYZ"
        location: " ", // Your location
        mobile: " ", // Your mobile number
        email: " ", // Professional email
        github: " ", // Your GitHub username
        linkedin: " ", // Your LinkedIn username
    },

    // Files used for data, logging, and output
    paths: {
        output_dir: path.resolve(__dirname, `../../output`), // Output Directory
        current_resume_data: path.resolve(__dirname, `../../data/resume.json`), // Resume Data
        job_data: path.resolve(__dirname, `../../data/jobPosting.txt`), // Job Posting Data
        info_log_file: path.resolve(__dirname, `../logs/info.log`), // Log File
        error_log_file: path.resolve(__dirname, `../logs/error.log`), // Error Log File
        change_report: path.resolve(__dirname, `../../output/change-summary.md`), // Change report notating new changes on resume
        compiled_resume: (title = '') => path.resolve(__dirname, `../../output/${title}_resume.pdf`), // The actual resume as a pdf
    },

    // Files used for LaTeX templates
    latex_files: {
        education: `${latexFilesPath}/resume/education.tex`, // Education section of resume
        experience: `${latexFilesPath}/resume/experience.tex`, // Experience section of resume
        extracurriculars: `${latexFilesPath}/resume/extracurriculars.tex`, // Extracurriculars section of resume
        honors: `${latexFilesPath}/resume/honors.tex`, // Honors section of resume
        projects: `${latexFilesPath}/resume/projects.tex`, // Projects section of resume
        skills: `${latexFilesPath}/resume/skills.tex`,  // Skills section of resume
        summary: `${latexFilesPath}/resume/summary.tex`, // Summary section of resume
        cv: `${latexFilesPath}/cv.tex`, // CV produced by the CV template
        cv_template: `${latexFilesPath}/cv-template.tex`, // CV Template
        resume: `${latexFilesPath}/resume.tex`, // Resume produced by the resume template
        resume_template: `${latexFilesPath}/resume-template.tex`, // Resume Template
        cover_letter: `${latexFilesPath}/coverletter.tex`, // Cover Letter produced by the cover letter template
        cover_letter_template: `${latexFilesPath}/coverletter-template.tex`, // Cover Letter Template
    }
}