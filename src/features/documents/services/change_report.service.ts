import { existsSync } from 'fs';
import { forceSinglePagePDF } from '../../../shared/utils/documents/pdf/pdf.helpers'; // Import the formatPDF function from the pdf.helpers module'../utils/validations';
import fs from 'fs';
import { JobPosting } from '../../../shared/data/info.store';
import { logger } from '../../../shared/utils/logger';
import paths from '../../../shared/constants/paths';
import { spawn } from 'child_process';
import { validatePath } from '../../../shared/utils/documents/file.helpers'

export const exportLatex = async({
  jobNameSuffix,
  latexFilePath,
  targetDirectory,
  compiledPdfPath,
  movedPdfPath,
  jobPost,
}: {
  jobNameSuffix: string;
  latexFilePath: string;
  targetDirectory: string;
  compiledPdfPath: string;
  movedPdfPath: string;
  jobPost: JobPosting;
}) => {
  const content = jobPost
  if (!content || !content.companyName) {
    throw new Error('Job posting content or company name is not available in infoStore.');
  }
  validatePath(paths.latex.resume.resume);
  validatePath(paths.paths.dir);

  await executeLatex(
    content.companyName,
    jobNameSuffix,
    latexFilePath,
    content.id,
  );

  if (jobNameSuffix === 'resume') {
    const path = paths.paths.compiledResume(content.companyName, content.id);
    await forceSinglePagePDF(path);
  }

  await moveCompiledPDF(
    targetDirectory,
    compiledPdfPath,
    movedPdfPath
  );
};

const executeLatex = (
  companyName: string,
  jobNameSuffix: string,
  latexFilePath: string,
  id: number,
): Promise<void> => {
  return new Promise(( resolve, reject) => {
    const latex = spawn('xelatex', [
      `--interaction=nonstopmode`,
      `-output-directory=${paths.paths.dir}`,
      `--jobname=${companyName}_${jobNameSuffix}_${id}`,
      latexFilePath
    ]);

    latex.stdout.on('data', (data) => {
      logger.info(data.toString());
    });

    latex.stderr.on('data', (data) => {
      logger.error(`LaTeX Error: ${data.toString()}`);
    });

    latex.on('close', async(code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`LaTeX process exited with code ${code}`));
      }
    });
  });
}

const moveCompiledPDF = async (
  targetDirectory: string,
  compiledPdfPath: string,
  movedPdfPath: string
) => {
  try {
    if(!existsSync(targetDirectory)) {
      await fs.promises.mkdir(targetDirectory, { recursive: true });
    }

    await fs.promises.rename(compiledPdfPath, movedPdfPath);
  } catch (error) {
    console.error(`Error moving compiled PDF: ${error}`);
    throw error;
  }
}