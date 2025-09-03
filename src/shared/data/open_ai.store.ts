import { CompanyInfoSchema, CompanyInfoType } from "../../job_guide/models/company_info.models.js";
import { Experience, Project, ResumeItems, ResumeItemsType } from "../../resume/models/resume.models.js";

import { resetInfoStore } from './info.store';
import { z } from "zod";

export const initializeResumeItems = (): ResumeItemsType => ({
    experiences: [],
    projects: [],
    skills: []
});


export let resumeItemsStore: ResumeItemsType = initializeResumeItems();

export const resetResumeItemsStore = (): void => {
    resumeItemsStore = initializeResumeItems();
};

export const updateResumeItemsStore = (newItems: ResumeItemsType): void => {
    resumeItemsStore = newItems;
};

export const initializeCompanyInfo = (): CompanyInfoType => ({
    company_name: "",
    company_description: "",
    company_website: "",
    company_industry: "",
    company_size: "",
    company_location: "",
    company_culture: "",
    company_values: "",
    company_benefits: "",
    job_info: {
        position_title: "",
        position_review: "",
        typical_salary_ask: "",
        typical_salary_ask_reason: "",
        advised_salary_ask: "",
        advised_salary_ask_reason: "",
        application_process: "",
        expected_response_time: "",
        possible_interview_questions: [],
        additional_information: []
    }
});

export let companyInfoStore: CompanyInfoType = initializeCompanyInfo();

export const resetCompanyInfoStore = (): void => {
    companyInfoStore = initializeCompanyInfo();
};

export const updateCompanyInfoStore = (newInfo: CompanyInfoType): void => {
    companyInfoStore = newInfo;
};