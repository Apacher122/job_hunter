import { spawn } from 'child_process';
import { logger } from '../utils/logger.js';
import { formatPDF } from '../helpers/formatter.js';
import { validatePath } from '../helpers/validations.js';
import config from '../config/config.js';
import path from 'path';
import { fileURLToPath } from 'url';

export const exportResume = async(companyName) => {
  validatePath(config.latex_files.resume);
  validatePath(config.paths.output_dir);

  return new Promise((resolve, reject) => {
    logger.info(`Starting compilation`);

    const latex = spawn('xelatex', [
      `--interaction=nonstopmode`,
      `-output-directory=${config.paths.output_dir}`,
      `--jobname=${companyName}_resume`,
      config.latex_files.resume
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
        console.log("Resume compilation successful.\nTo view information about changes, check /output/change-summary.md");
        logger.info('Compilation successful');
        resolve();
      } else {
        reject(new Error(`LaTeX process exited with code ${code}`));
      }
    });
  });
};