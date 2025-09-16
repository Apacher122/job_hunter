import { ResumeItems } from './resume.models';

// Manual mock with actual values
export const MockResume = ResumeItems.parse({
  experiences: [
    {
      position: 'Software Engineer',
      company: 'TechCorp',
      start: '2022-01',
      end: '2024-06',
      description: [
        {
          text: 'Developed internal tooling that improved deployment speed by 30%',
          justification_for_change:
            'Demonstrates measurable impact and technical skills',
          is_new_suggestion: false,
        },
        {
          text: 'Led a team of 3 engineers on a microservices project',
          justification_for_change: 'Shows leadership experience',
          is_new_suggestion: true,
        },
      ],
    },
  ],
  skills: [
    {
      category: 'Programming Languages',
      skill: [{ item: 'TypeScript' }, { item: 'Python' }, { item: 'C#' }],
      justification_for_changes: 'Core technical skills relevant to job roles',
    },
  ],
  projects: [
    {
      name: 'Resume Builder v3',
      role: 'Lead Developer',
      status: 'Completed',
      description: [
        {
          text: 'Built an Electron + React app for resume optimization',
          justification_for_change: 'Shows full-stack development experience',
          is_new_suggestion: false,
        },
      ],
    },
  ],
});
