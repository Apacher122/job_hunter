import { GuidingQuestionsSchema } from "../guiding_questions.models.js";

export const GuidingQuestionsMock = GuidingQuestionsSchema.parse({
  guiding_questions: [
    {
      question: "What makes a company culture a good fit for me?",
      answer: "A culture that values learning, collaboration, and work-life balance.",
      suggestions_and_guiding_questions: [
        "Do I thrive in team-oriented environments?",
        "Do I prefer structured or flexible work settings?",
        "What values are non-negotiable for me in a company?"
      ]
    },
    {
      question: "How do I assess if a role matches my skill set?",
      answer: "Compare my core skills to the required and nice-to-have skills in the job description.",
      suggestions_and_guiding_questions: [
        "Am I missing any critical skills?",
        "Do I have experience in similar projects?",
        "Can I quickly learn missing technologies?"
      ]
    }
  ]
});