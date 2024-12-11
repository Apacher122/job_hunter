
// Format new LaTeX content from the zod object returned by openai

import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import config from '../config/config.js';

export const formatPDF = async(companyName) => {
    // Read the input PDF file into a buffer
    const existingPdfBytes = fs.readFileSync(config.paths.compiled_resume(companyName));
  
    // Load the existing PDF into pdf-lib
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
  
    // Remove specified pages (pagesToRemove is an array of page indexes)
    const pages = pdfDoc.getPages();

    // Remove pages starting from the second page (index 1 onwards)
    for (let i = pages.length - 1; i >= 1; i--) {
        pdfDoc.removePage(i);
    }

    // Serialize the PDF to bytes
    const pdfBytes = await pdfDoc.save();
  
    // Write the modified PDF back to the same file
    fs.writeFileSync(config.paths.compiled_resume(companyName), pdfBytes);
    console.log(`PDF updated and saved to ${config.paths.compiled_resume(companyName)}`);
};

export const formatLatexSection = (sectionType) => (sectionData) => {
    let cvItems;
    switch (sectionType) {
        case "experiences":
            cvItems = sectionData.description
                .map(
                    ({ text }) =>
                        `    \\item {${text.replace(/[%#&]/g, "\\$&")}}`
                )
                .join("\n");
            return `
        \\cventry
          {${sectionData.company}} % Organization
          {${sectionData.position}} % Job title
          {} % Location
          {${sectionData.start} - ${sectionData.end}} % Date(s)
          {
            \\begin{cvitems} % Description(s) of tasks/responsibilities
        ${cvItems}
            \\end{cvitems}
          }`;
        case "skills":
            const skillList = sectionData.skill
                .map(({ item }) =>
                    item.replace(
                        /[%#&]/g,
                        (match) =>
                            ({
                                "%": "\\%",
                                "#": "\\#",
                                "&": "\\&",
                            }[match])
                    )
                ) // Escape special characters for LaTeX
                .join(", ");

            return `
          \\cvskill
            {${titleFormat(sectionData.category)}} % Category
            {${skillList}} % Skills
          `;
        case "projects":
            cvItems = sectionData.description
                .map(
                    ({ text }) =>
                        `    \\item {${text
                            .replace(/%/g, "\\%")
                            .replace(/#/g, "\\#")}}` // Escape '%' for LaTeX
                )
                .join("\n");

            return `
          \\cventry
            {${sectionData.role}} % Role
            {${sectionData.name}} % Event
            {} % Location
            {${sectionData.status}} % Date(s)
            {
              \\begin{cvitems} % Description(s)
          ${cvItems}
              \\end{cvitems}
            }`;
        default:
            throw new Error(`Invalid section type: ${sectionType}`);
    }
};

const titleFormat = (str) => {
    return str
    .replace(/[%#&_]/g, match => ({
        '%': '\\%',
        '#': '\\#',
        '&': '\\&',
        '_': ' '
      }[match]))
      .toLowerCase()
      .replace(/\b\w/g, s => s.toUpperCase());
};

const formatText = (text) => {
    return text
    .replace(/%/g, '\\%')
    .replace(/#/g, '\\#')
    .replace(/&/g, '\\&')
};
