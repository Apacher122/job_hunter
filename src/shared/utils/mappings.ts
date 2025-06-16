// helpers/mappings.ts (optional)

import { compileCoverLetter } from "../../services/cover_letter/cover_letter_service";
import { compile_resume } from "../../services/resume/resume_service";
import paths from "../constants/paths";

export const filePathsMap = (companyName: string) => ({
  resume: paths.paths.movedResume(companyName),
  cover_letter: paths.paths.movedCoverLetter(companyName),
});

export const generatorsMap = {
  resume: compile_resume,
  cover_letter: compileCoverLetter,
};
