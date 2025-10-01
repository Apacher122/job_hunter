import * as Handlebars from "handlebars";
import * as fs from "fs";
import * as path from "path";

export const createHeader = async (
  uid: string,
  payload: any,
  tempFolder: string
) => {
  const data = payload;
  const userInfoTemplate = path.join(
    tempFolder,
    "templates",
    "resume-template.tex"
  );
  const educationTemplate = path.join(
    tempFolder,
    "templates",
    "education-template.tex"
  );

  const resumeInfo = fs.readFileSync(userInfoTemplate, "utf-8");
  let resumeWithPaths = replaceVariables(resumeInfo, { uid: uid });
  resumeWithPaths = replaceVariables(resumeWithPaths, {location: "lll"});
  const resumeInfoWithVariables = replaceVariables(
    resumeWithPaths,
    data.userInfo
  );
  const educationInfo = fs.readFileSync(educationTemplate, "utf-8");
  const educationInfoWithVariables = replaceVariables(
    educationInfo,
    data.educationInfo
  );

  const classFile = fs.readFileSync(path.join(tempFolder, "awesome-cv.cls"));
  const newClassFile = replaceVariables(classFile.toString(), { uid: uid });

  await fs.promises.writeFile(
    path.join(tempFolder, "awesome-cv.cls"),
    newClassFile
  );
  await fs.promises.writeFile(
    path.join(tempFolder, "compiled", "resume.tex"),
    resumeInfoWithVariables
  );
  await fs.promises.writeFile(
    path.join(tempFolder, "compiled", "education.tex"),
    educationInfoWithVariables
  );
};

const replaceVariables = (
  template: string,
  data: Record<string, any>
): string => {
  let result = template;

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const regex = new RegExp(`{{${key}}}`, "g");
      result = result.replace(regex, data[key] as string);
    }
  }
  return result;
};

// Load the basic information of the user into resume.tex
// export const loadUserInfoToLatex = async () => {
//   const resumeTemplate = await fs.promises.readFile(
//     paths.latex.resume.resumeTemplate,
//     "utf8"
//   );
//   const resumeInfo = Handlebars.compile(resumeTemplate)(infoStore.user_info);
//   await fs.promises.writeFile(paths.latex.resume.resume, resumeInfo);

//   const educationTemplate = await fs.promises.readFile(
//     paths.latex.resume.educationTemplate,
//     "utf8"
//   );

//   const educationInfo = Handlebars.compile(educationTemplate)(
//     infoStore.education_info
//   );
//   await fs.promises.writeFile(paths.latex.resume.education, educationInfo);
// };
