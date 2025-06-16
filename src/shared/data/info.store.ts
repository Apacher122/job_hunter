import { number } from "zod";

interface JobPosting {
    id: number;
    body: string;
    companyName: string;
    url: string;
    position: string;
    rawCompanyName: string;
}

interface UserInfo {
    first_name?: string;
    last_name?: string;
    summary?: string;
    location?: string;
    mobile?: string;
    email?: string;
    github?: string;
    linkedin?: string;
}

interface EducationInfo {
    school?: string;
    degree?: string;
    start_end?: string;
    location?: string;
    coursework?: string;        
}

export interface InfoStore {
    jobPosting: JobPosting;
    user_info: UserInfo;
    education_info: EducationInfo;
}

const getEnvVar = (key: string): string | undefined => process.env[key];

export const initializeInfoStore = () : InfoStore => ({
    jobPosting: {
        id: 0,
        body: '',
        companyName: '',
        url: '',
        position: '',
        rawCompanyName: '',
    },
    user_info: {
        first_name: getEnvVar('FIRST_NAME'), // I hope you know this
        last_name: getEnvVar('LAST_NAME'), // I hope you know this too
        summary: getEnvVar('SUMMARY'), // A one-liner. I.E. "Software Engineer at XYZ"
        location: getEnvVar('LOCATION'), // Your location
        mobile: getEnvVar('MOBILE'), // Your mobile number
        email: getEnvVar('EMAIL'), // Professional email
        github: getEnvVar('GITHUB'), // Your GitHub username
        linkedin: getEnvVar('LINKEDIN'), // Your LinkedIn username
    },
    education_info: {
        school: getEnvVar('SCHOOL'), // Your school name
        degree: getEnvVar('DEGREE'), // Your degree
        start_end: getEnvVar('START_END'), // Your field of study
        location: getEnvVar('SCHOOL_LOCATION'), // Your graduation year
        coursework: getEnvVar('COURSEWORK'), // Relevant courseworkK, // Relevant coursework
    },
});

export let infoStore: InfoStore = initializeInfoStore();

export const resetInfoStore = (): void => {
    infoStore = initializeInfoStore();
};