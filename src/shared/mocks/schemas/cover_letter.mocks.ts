import { CoverLetterReviewSchema, CoverLetterSchema } from "../../../features/documents/models/domain/cover_letter.js";

export const CoverLetterMock = CoverLetterSchema.parse({
  type: "cover_letter",
  about: "I am a software engineer with 6 years of experience building scalable web applications and cloud solutions.",
  experience: "At my previous role at TechNova, I led a team of 5 engineers, improved system performance by 30%, and implemented CI/CD pipelines.",
  whatIBring: "I bring strong problem-solving skills, expertise in full-stack development, and a collaborative mindset that aligns with company culture."
});

export const CoverLetterReviewMock = CoverLetterReviewSchema.parse({
  coverLetterReview: {
    metrics: {
      contentScore: 88,
      grammarScore: 95,
      formatScare: 90,
    },
    contentAnalysis: {
      strengths_summary: "The cover letter clearly highlights the candidate's experience and skills.",
      strengths: [
        "Clear articulation of experience",
        "Relevant skills emphasized",
        "Alignment with company culture"
      ],
      weaknesses_summary: "Some sections could be more concise.",
      weaknesses: [
        "Long sentences in the experience section",
        "Minor repetition of achievements"
      ],
      suggestions: [
        "Break up long sentences",
        "Combine repetitive points",
        "Add quantifiable results where possible"
      ]
    },
    grammarAnalysis: {
      grammar_issues: [
        "Occasional missing commas",
        "Minor subject-verb agreement errors"
      ],
      suggestions: [
        "Proofread carefully or use a grammar tool",
        "Simplify complex sentence structures"
      ]
    },
    formatScore: {
      format_issues: [
        "Paragraph spacing inconsistent",
        "Bullet points formatting could be improved"
      ],
      suggestions: [
        "Ensure consistent paragraph spacing",
        "Use uniform bullet points style"
      ]
    }
  }
});
