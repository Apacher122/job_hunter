import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { rename, mkdir } from 'fs/promises';
import { logger } from '../logger.js';
import { formatPDF } from '../helpers/formatter.js';
import { validatePath } from '../helpers/validations.js';
import paths from '../../config/paths.js';

export const exportResume = async(companyName) => {
  validatePath(paths.latex_files.resume);
  validatePath(paths.paths.output_dir);

  return new Promise((resolve, reject) => {
    logger.info(`Starting compilation`);

    const latex = spawn('xelatex', [
      `--interaction=nonstopmode`,
      `-output-directory=${paths.paths.output_dir}`,
      `--jobname=${companyName}_resume`,
      paths.latex_files.resume
    ]);

    latex.stdout.on('data', (data) => {
      logger.info(data.toString());
    });

    latex.stderr.on('data', (data) => {
      logger.error(`LaTeX Error: ${data.toString()}`);
      throw new Error(`:LaTeX Error: ${data.toString()}`);
    });

    latex.on('close', async(code) => {
      if (code === 0) {
        await formatPDF(companyName);
        try {
          // Ensure final directory exists
          if (!existsSync(paths.paths.pdf_output_dir)) {
            await mkdir(paths.paths.pdf_output_dir, { recursive: true });
          }

          // Move the PDF
          await rename(paths.paths.compiled_resume(companyName), paths.paths.moved_resume(companyName));
          console.log(`PDF moved to: ${paths.paths.pdf_output_dir}`);
        } catch (err) {
          console.error('Error moving PDF:', err);
        }
        console.log("Resume compilation successful.\nTo view information about changes, check /output/change-summary.md");
        logger.info('Compilation successful');
        resolve();
      } else {
        logger.error(`LaTeX process exited with code ${code}`);
        reject(new Error(`LaTeX process exited with code ${code}`));
      }
    });
  });
};