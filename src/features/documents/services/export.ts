import { existsSync } from 'fs';
import { forceSinglePagePDF } from '../../../shared/utils/documents/pdf/pdf.helpers';
import fs from 'fs';
import { logger } from '../../../shared/utils/logger.utils';
import paths from '../../../shared/constants/paths';
import { spawn } from 'child_process';
import { validatePath } from '../../../shared/utils/documents/file.helpers';
import { JobDescriptionSchema } from '../../application_tracking/models/job_description';

export const exportLatex = async ({
  jobNameSuffix,
  tempLatexFolder,
  targetDirectory,
  compiledPdfPath,
  movedPdfPath,
  companyName,
  jobId,
}: {
  jobNameSuffix: string;
  tempLatexFolder: string;
  targetDirectory: string;
  compiledPdfPath: string;
  movedPdfPath: string;
  companyName: string;
  jobId: number;
}) => {
  validatePath(tempLatexFolder);

  const latexFilePath = `${tempLatexFolder}/resume.tex`

  await executeLatex(companyName, jobNameSuffix, latexFilePath, jobId, tempLatexFolder);

  if (jobNameSuffix === 'resume') {
    await forceSinglePagePDF(compiledPdfPath);
  }

  await moveCompiledPDF(targetDirectory, compiledPdfPath, movedPdfPath);
};

const executeLatex = (
  companyName: string,
  jobNameSuffix: string,
  latexFilePath: string,
  id: number,
  outputDir: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const latex = spawn('xelatex', [
      `--interaction=nonstopmode`,
      `-output-directory=${outputDir}`,
      `--jobname=${companyName}_${jobNameSuffix}_${id}`,
      latexFilePath,
    ]);

    latex.stdout.on('data', (data) => {
      logger.info(data.toString());
    });

    latex.stderr.on('data', (data) => {
      logger.error(`LaTeX Error: ${data.toString()}`);
    });

    latex.on('close', async (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`LaTeX process exited with code ${code}`));
      }
    });
  });
};

const moveCompiledPDF = async (
  targetDirectory: string,
  compiledPdfPath: string,
  movedPdfPath: string
) => {
  try {
    if (!existsSync(targetDirectory)) {
      await fs.promises.mkdir(targetDirectory, { recursive: true });
    }

    await fs.promises.rename(compiledPdfPath, movedPdfPath);
  } catch (error) {
    console.error(`Error moving compiled PDF: ${error}`);
    throw error;
  }
};
