export const formatJSONResume = (jsonResume: any) => {
  let resume = "";
  if (jsonResume.skills) {
    resume += "### Skills\n";
    resume += `${jsonResume.skills}\n\n`;
  }

  if (jsonResume.experiences && jsonResume.experiences.length > 0) {
    resume += "### Experience\n";
    jsonResume.experiences.forEach((exp: any) => {
      resume += `**Company**: ${exp.company}\n`;
      resume += `**Position**: ${exp.jobTitle}\n`;
      resume += `**Years**: ${exp.years}\n\n`;
      if (exp.bulletPoints && exp.bulletPoints.length > 0) {
        exp.bulletPoints.forEach((bulletPoint: any) => {
          resume += `- ${bulletPoint}\n`;
        });
      }
      resume += "\n";
    });

    if (jsonResume.projects && jsonResume.projects.length > 0) {
      resume += "### Projects\n";
      jsonResume.projects.forEach((project: any) => {
        resume += `**Name**: ${project.name}\n`;
        resume += `**Role**: ${project.description}\n`;
        resume += `**Status**: ${project.years}\n\n`;
        if (project.bulletPoints && project.bulletPoints.length > 0) {
          project.bulletPoints.forEach((bulletPoint: any) => {
            if (bulletPoint) {
              resume += `- ${bulletPoint}\n`;
            }
          });
        }
        resume += "\n";
      });
    }
  }

  return resume.trim();
};
