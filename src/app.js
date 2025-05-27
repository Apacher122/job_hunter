import { compile_resume } from './utils/resume_compiler.js';

// Entrance
const main = async () => {
  try {
    console.log("Attempting to compile resume");
    await compile_resume();
  } catch (error) {
    console.error(`Error during resume compilation: ${error.message}`);
    return;
  }
}

main();