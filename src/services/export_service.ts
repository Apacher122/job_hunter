import { spawn } from 'child_process';
import { exists, existsSync } from 'fs';
import fs from 'fs';
import { logger } from '../shared/utils/logger';
import { formatPDF } from '../shared/utils/formatters/file_formatter';
import { validatePath } from '../shared/utils/validations';
import paths from '../shared/constants/paths';
import { infoStore } from '../shared/data/info_store';

export const exportLatex = async({
  jobNameSuffix,
  latexFilePath,
  targetDirectory,
  compiledPdfPath,
  movedPdfPath
}: {
  jobNameSuffix: string;
  latexFilePath: string;
  targetDirectory: string;
  compiledPdfPath: string;
  movedPdfPath: string;
}) => {
  const content = infoStore.jobPosting;
  if (!content || !content.companyName) {
    throw new Error('Job posting content or company name is not available in infoStore.');
  }
  validatePath(paths.latex_files.resume);
  validatePath(paths.paths.output_dir);

  await executeLatex(
    content.companyName,
    jobNameSuffix,
    latexFilePath
  );

  if (jobNameSuffix === 'resume') {
    // Ensure the compiled PDF exists
    const path = paths.paths.compiled_resume(content.companyName);
    await formatPDF(path);
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
): Promise<void> => {
  return new Promise(( resolve, reject) => {
    const latex = spawn('xelatex', [
      `--interaction=nonstopmode`,
      `-output-directory=${paths.paths.output_dir}`,
      `--jobname=${companyName}_${jobNameSuffix}`,
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