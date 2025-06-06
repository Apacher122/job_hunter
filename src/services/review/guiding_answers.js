import { guidingAnswersResponse } from "../../data/schemas/response_models/guiding_answers_model.js"; 
import { messageOpenAI } from "../../services/openai_services.js";
import { prompts } from "../../data/constants/prompts.js";
import { infoStore } from "../../data/stores/info_store.js";
import { getJobPostingContent } from '../helpers/info_helper.js';
import paths from "../../data/constants/paths.js";
import fs from "fs/promises";




export const getGuidingAnswers = async () => {
    await getJobPostingContent();
    const jobContent = infoStore.jobPosting;
    const resumeData = await compileJSONResume(paths.paths.moved_resume(jobContent.companyName));
    const aboutMe = await fs.readFile(paths.paths.about_me, 'utf-8');
    const example1 = await fs.readFile(paths.paths.writing_examples('example1'), 'utf-8');
    const example2 = await fs.readFile(paths.paths.writing_examples('example2'), 'utf-8');
    const example3 = await fs.readFile(paths.paths.writing_examples('example3'), 'utf-8');
    const example4 = await fs.readFile(paths.paths.writing_examples('example4'), 'utf-8');
    const example5 = await fs.readFile(paths.paths.writing_examples('example5'), 'utf-8');
    const example6 = await fs.readFile(paths.paths.writing_examples('example6'), 'utf-8');
    
    const prompt = prompts.possible_questions(
        resumeData,
        jobContent,
        aboutMe,
        jobContent.rawCompanyName,
        example1,
        example2,    
        example3,
        example4,
        example5,
        example6
    );
    const response = await messageOpenAI(prompt, guidingAnswersResponse);
    const parsedResponse = guidingAnswersResponse.safeParse(response);
    if (!parsedResponse || !parsedResponse.data || !parsedResponse.data.guiding_answers) {
        throw new Error("Invalid response format from OpenAI");
    }
    const answers = parsedResponse.data.guiding_answers;

    const markdown = answers
    .map((item, i) => {
        const suggestions = item.suggestions_and_guiding_questions
        .map(s => `- ${s}`)
        .join("\n");

        return `### ${i + 1}. ${item.question}\n\n${item.answer}\n\n**Suggestions & Guiding-Questions:**\n${suggestions}`
    })
    .join("\n\n");


    const filePath = paths.paths.guiding_answers(jobContent.companyName);

    try {
        await fs.writeFile(filePath, markdown, 'utf-8');
        console.log(`Guiding answers saved to ${filePath}`);
    } catch (error) {
        console.error(`Error saving guiding answers: ${error.message}`);
        throw error;
    }   
}

const compileJSONResume = async () => {
    try {
        const file1 = JSON.parse(
            await fs.readFile(paths.paths.section_json("experiences"), "utf-8")
        );
        const file2 = JSON.parse(
            await fs.readFile(paths.paths.section_json("skills"), "utf-8")
        );
        const file3 = JSON.parse(
            await fs.readFile(paths.paths.section_json("experiences"), "utf-8")
        );

        const combinedData = {
            ...file1,
            ...file2,    
            ...file3,
        };
        return combinedData;
    } catch (error) {
        logger.error(`Error extracting text from PDF: ${error.message}`);
        throw error;
    }
};