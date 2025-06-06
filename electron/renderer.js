const output = document.getElementById('output');

const buttons = {
  reload: document.getElementById('reloadBtn'),
  resume: document.getElementById('generateResumeBtn'),
  coverLetter: document.getElementById('generateCoverLetterBtn'),
  sheets: document.getElementById('sendToSheetBtn'),
};

document.addEventListener('DOMContentLoaded', () => {

  buttons.reload.addEventListener('click', () => {
      console.log('Compile button clicked');
      reloadInfo();
  });

  buttons.resume.addEventListener('click', generateResume);
  buttons.coverLetter.addEventListener('click', generateCoverLetter);
  buttons.sheets.addEventListener('click', sendToSheets);
});

function logResult(label, result) {
  output.textContent += `${label}: ${result}\n`;
}

function clearOutput() {
  output.textContent = '';
}

function enableOtherButtons() {
  buttons.resume.disabled = false;
  buttons.coverLetter.disabled = false;
}

function disableButtonsWhileLoading() {
  buttons.compile.disabled = true;
  buttons.resume.disabled = true;
  buttons.coverLetter.disabled = true;
}

async function postRequest(endpoint) {
  Object.values(buttons).forEach(button => button.disabled = true);

  try {
    const response = await fetch(`http://localhost:3000/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Unknown error occurred');
    }
    return data;
  } finally {
    Object.values(buttons).forEach(button => button.disabled = false);
  }
}

async function reloadInfo() {
  console.log("Attempting to compile resume");
  try {
    const result = await postRequest('reload');

    logResult('✅ Reload Resume', result);
    if (result.success) {
      logResult('📄 Resume Compiled Successfully', 'You can now generate the resume or cover letter.');
      enableOtherButtons();
    }
  } catch (err) {
    logResult('❌ Reload Resume Error', err.message);
  }
}

async function generateResume() {
  try {
    const result = await postRequest('generate-resume');
    if (result.success) {
      logResult('✅ Generate Resume', 'Resume generated successfully.');
    } else {
      logResult('❌ Generate Resume Error', result.message || 'Unknown error occurred');
    }
    logResult('📄 Generate Resume', result);
  } catch (err) {
    logResult('❌ Generate Resume Error', err.message);
  }
}

async function generateCoverLetter() {
  try {
    const result = await postRequest('generate-cover-letter');
    if (result.success) {
      logResult('✅ Generate Cover Letter', 'Cover letter generated successfully.');
    } else {
      logResult('❌ Generate Cover Letter Error', result.message || 'Unknown error occurred');
    }
    logResult('💌 Generate Cover Letter', result);
  } catch (err) {
    logResult('❌ Generate Cover Letter Error', err.message);
  }
}

async function sendToSheets() {
  try {
    const result = await postRequest('add-to-sheet');
    if (result.success) {
      logResult('✅ Send to Sheets', 'Data sent to Google Sheets successfully.');
    } else {
      logResult('❌ Send to Sheets Error', result.message || 'Unknown error occurred');
    }
    logResult('📊 Send to Sheets', result);
  } catch (err) {
    logResult('❌ Send to Sheets Error', err.message);
  }
}

async function generateAll() {
  clearOutput();
  logResult('🚀 Generating All', 'Starting...');
  await generateResume();
  await generateCoverLetter();
  logResult('✅ All Done', 'All tasks completed.');
}
