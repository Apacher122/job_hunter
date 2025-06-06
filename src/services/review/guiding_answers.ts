import { guidingAnswersResponse } from "../../models/response_models/reviews/guiding_answers_model.js"; 
import { messageOpenAI } from "../../apis/open_ai/openai_services.js";
import { prompts } from "../../constants/prompts.js";
import { infoStore } from "../../data/info_store.js";
import { combineJSONData } from "../../utils/data/json_helpers.js";
import paths from "../../constants/paths.js";
import fs from "fs";




export const getGuidingAnswers = async () => {
    const jobContent = infoStore.jobPosting;
    if (!jobContent || !jobContent.body) {
        throw new Error('Job posting content is not available in infoStore.');
    }

    const resumeData = await combineJSONData(['experiences', 'skills', 'projects']);
    const aboutMe = await fs.promises.readFile(paths.paths.about_me, 'utf-8');
    const examples = await Promise.all(
        [1, 2, 3, 4, 5, 6].map(i => fs.promises.readFile(paths.paths.writing_examples(`example${i}`), 'utf-8'))
    ) as [string, string, string, string, string, string];
    
    const prompt = prompts.possible_questions(
        resumeData,
        jobContent,
        aboutMe,
        jobContent.rawCompanyName,
        ...examples
    );
    const response = await messageOpenAI(prompt, guidingAnswersResponse);
    const parsedResponse = guidingAnswersResponse.safeParse(response);

    if (!parsedResponse.success) {
        throw new Error("Invalid response format from OpenAI");
    }

    const answers = parsedResponse.data.guiding_answers;

    const markdown = generateMarkDownContent(answers);

    const filePath = paths.paths.guiding_answers(jobContent.companyName);

    try {
        await fs.promises.writeFile(filePath, markdown, 'utf-8');
        console.log(`Guiding answers saved to ${filePath}`);
    } catch (error) {
        const e = error as Error;
        console.error(`Error saving guiding answers: ${e.message}`);
        throw error;
    }   
}


const generateMarkDownContent = (answers: any[]) => {
    answers.map((item, i) => {
        const suggestions = item.suggestions_and_guiding_questions
        .map((s: any) => `- ${s}`)
        .join("\n");
        return `### ${i + 1}. ${item.question}\n\n${item.answer}\n\n**Suggestions & Guiding-Questions:**\n${suggestions}`
    })
    .join("\n\n");
}