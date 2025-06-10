import { GuidingQuestionsSchema } from "../../models/response_models/reviews/guiding_questions_model.js"; 
import { messageOpenAI } from "../../shared/apis/open_ai/openai_services.js";
import { prompts } from "../../shared/constants/prompts.js";
import { infoStore } from "../../shared/data/info_store.js";
import { combineJSONData } from "../../shared/utils/data/json_helpers.js";
import { getWritingExamples } from "../../shared/utils/formatters/text_formatter.js";
import paths from "../../shared/constants/paths.js";
import fs from "fs";




export const getGuidingAnswers = async () => {
    const jobContent = infoStore.jobPosting;
    if (!jobContent || !jobContent.body) {
        throw new Error('Job posting content is not available in infoStore.');
    }

    const resumeData = await combineJSONData(['experiences', 'skills', 'projects']);
    const aboutMe = await fs.promises.readFile(paths.paths.about_me, 'utf-8');
    let extra_questions = await fs.promises.readFile(paths.paths.possible_questions, 'utf-8');
    if (!extra_questions) {
        extra_questions = '';
    }
    const examples = await getWritingExamples();
    if (!examples) {
        throw new Error('Writing examples not found.');
    }
    
    const prompt = prompts.possible_questions(
        resumeData,
        jobContent,
        aboutMe,
        jobContent.rawCompanyName,
        examples,
        extra_questions
    );
    const response = await messageOpenAI(prompt, GuidingQuestionsSchema);
    const parsedResponse = GuidingQuestionsSchema.safeParse(response);

    if (!parsedResponse.success) {
        throw new Error("Invalid response format from OpenAI");
    }

    const answers = parsedResponse.data.guiding_questions;

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
   return answers.map((item, i) => {
        const suggestions = item.suggestions_and_guiding_questions
        .map((s: any) => `- ${s}`)
        .join("\n");
        return `### ${i + 1}. ${item.question}\n\nAnswer Draft: ${item.answer}\n\n**Suggestions & Guiding-Questions:**\n${suggestions}`
    })
    .join("\n\n");
}