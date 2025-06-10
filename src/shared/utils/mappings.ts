// helpers/mappings.ts (optional)
import { compile_resume } from "../../services/resume/resume_service";
import { compileCoverLetter } from "../../services/cover_letter/cover_letter_service";
import paths from "../constants/paths";


export const filePathsMap = (companyName: string) => ({
  resume: paths.paths.moved_resume(companyName),
  cover_letter: paths.paths.moved_cover_letter(companyName),
});

export const generatorsMap = {
  resume: compile_resume,
  cover_letter: compileCoverLetter,
};
