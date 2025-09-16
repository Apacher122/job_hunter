export interface JobPosting {
  id: number;
  body: string;
  companyName: string;
  rawCompanyName: string;
  applicantCount: string;
  jobDetails: string;
  url: string;
  position: string;
  positionSummary: string;
  yearsOfExp: string;
  educationLvl: string;
  requirements: string;
  niceToHaves: string;
  toolsAndTech: string;
  progLanguages: string;
  frmwrksAndLibs: string;
  databases: string;
  cloudPlatforms: string;
  industryKeywords: string;
  softSkills: string;
  certifications: string;
  companyCulture: string;
  companyValues: string;
  salary: string;
  user_applied: boolean;
  applied_on: Date;
  status: string;
  code_assessment_completed: boolean;
  interview_count: number;
  initial_application_update_date: Date;
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
  undergraduate_coursework?: string;
  graduate_coursework?: string;
  education_summary?: string;
}

export interface InfoStore {
  jobPosting: JobPosting;
  user_info: UserInfo;
  education_info: EducationInfo;
}

const getEnvVar = (key: string): string | undefined => process.env[key];

export const initializeInfoStore = (): InfoStore => ({
  jobPosting: {
      id: 0,
      body: '',
      companyName: '',
      rawCompanyName: '',
      url: '',
      position: '',
      positionSummary: '',
      requirements: '',
      niceToHaves: '',
      salary: '',
      yearsOfExp: '',
      educationLvl: '',
      toolsAndTech: '',
      frmwrksAndLibs: '',
      progLanguages: '',
      databases: '',
      cloudPlatforms: '',
      industryKeywords: '',
      softSkills: '',
      certifications: '',
      companyCulture: '',
      companyValues: '',
      applicantCount: '',
      jobDetails: '',
      user_applied: false,
      applied_on: new Date(),
      status: "",
      code_assessment_completed: false,
      interview_count: 0,
      initial_application_update_date: new Date()
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
    coursework: getEnvVar('COURSEWORK'),
    undergraduate_coursework: getEnvVar('UNDERGRADUATE_COURSEWORK'),
    graduate_coursework: getEnvVar('GRADUATE_COURSEWORK'),
    education_summary: getEnvVar('EDUCATION_SUMMARY'),
  },
});

export let infoStore: InfoStore = initializeInfoStore();

export const resetInfoStore = (): void => {
  infoStore = initializeInfoStore();
};
