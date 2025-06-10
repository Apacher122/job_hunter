import { getJobPostingContent } from "../shared/utils/data/job_data_helpers.js";
import { loadUserInfoToLatex } from "./latex/latex_service.js";

export const initializeApp = async () => {
    try {
        // Load job posting content
        await getJobPostingContent();
        await loadUserInfoToLatex();

        // Additional initialization tasks can be added here
        console.log("Job application content and user info loaded successfully.");
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Error initializing app: ${error.message}`);
        } else {
            console.error("An unknown error occurred during app initialization.");
        }
        throw error;
    }
}