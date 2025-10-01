import { CompanyInfoSchema } from "../company_info.models.js";

export const CompanyInfoMock = CompanyInfoSchema.parse({
  company_name: "TechNova Solutions",
  company_description: "A leading software company specializing in cloud solutions and enterprise SaaS platforms.",
  company_website: "https://www.technova.com",
  company_industry: "Software & Technology",
  company_size: "500-1000 employees",
  company_location: "San Francisco, CA",
  company_culture: "Collaborative, Innovative, Inclusive",
  company_values: "Integrity, Customer First, Continuous Learning",
  company_benefits: "Health insurance, 401(k), Paid time off, Remote work options",
  job_info: {
    position_title: "Senior Software Engineer",
    position_review: "Highly collaborative environment with opportunities for growth.",
    typical_salary_ask: "$120,000 - $140,000",
    typical_salary_ask_reason: "Based on market averages for similar positions in the region",
    advised_salary_ask: "$130,000",
    advised_salary_ask_reason: "Reflects candidate experience and skills",
    application_process: "Online application, technical interview, behavioral interview, final HR interview",
    expected_response_time: "1-2 weeks",
    behavioral_questions: [
      {
        question: "Describe a time you faced a conflict in a team.",
        question_source: "Glassdoor",
        answer: "Provided an example of a disagreement and how it was resolved collaboratively.",
        what_they_look_for: "Conflict resolution and teamwork skills",
        what_to_study: "STAR method for behavioral interviews"
      }
    ],
    technical_questions: [
      {
        question: "Explain the difference between synchronous and asynchronous programming.",
        question_source: "Company technical guide",
        answer: "Provided examples in JavaScript and Node.js.",
        what_they_look_for: "Core technical understanding",
        what_to_study: "JavaScript async/await, Promises, Event loop"
      }
    ],
    coding_questions: [
      {
        question: "Write a function to reverse a linked list.",
        question_source: "LeetCode",
        answer: "Implemented iterative and recursive solutions.",
        what_they_look_for: "Algorithmic thinking, clean code",
        what_to_study: "Data structures, linked list algorithms"
      }
    ],
    additional_information: [
      {
        information_title: "Remote Work Policy",
        text: "Employees may work remotely up to 3 days per week."
      }
    ]
  }
});
