import { MatchSummarySchema } from '../../../features/job_guide/models/domain/match_summary.js';

export const MatchSummaryMock = MatchSummarySchema.parse({
  company_name: 'Acme Corp',
  match_summary: {
    should_apply: 'Maybe',
    should_apply_reasoning:
      'You have solid software engineering experience (including C# and embedded/systems work) that overlaps parts of the role, but you currently lack clearly-documented hands-on cleanroom / equipment integration experience and there is no explicit Mechanical/Electrical/Systems degree listed. Because the posting has many applicants (860) and expectations include hardware/mechatronics and daily hands-on equipment testing, your probability of landing an interview is moderate-to-low unless you tailor your application and surface relevant hardware/embedded work, coursework, or test-equipment projects. Consider applying if you can quickly add concrete hardware/mechatronics evidence (projects or coursework) and a targeted cover note; otherwise prioritize networking or internal referrals first.',
    metrics: [
      {
        score_title: 'Keyword & Phrases',
        raw_score: 85,
        weighted_score: 34, // 85 * 0.4
        score_weight: 0.4,
        score_reason: 'Most required keywords are present in the resume.',
        isCompatible: true,
        strength:
          'Strong coverage of technical keywords like Python, SQL, and AWS.',
        weaknesses: 'A few optional tools missing.',
      },
      {
        score_title: 'Experience Alignment',
        raw_score: 70,
        weighted_score: 21, // 70 * 0.3
        score_weight: 0.3,
        score_reason: '3 of 5 years of relevant experience.',
        isCompatible: true,
        strength: 'Relevant project experience.',
        weaknesses: 'Slightly less senior than ideal.',
      },
      {
        score_title: 'Education & Credentials',
        raw_score: 100,
        weighted_score: 15, // 100 * 0.15
        score_weight: 0.15,
        score_reason: 'Degree requirements fully met.',
        isCompatible: true,
        strength: 'Bachelor’s in CS.',
        weaknesses: 'None.',
      },
      {
        score_title: 'Skills & Competencies',
        raw_score: 90,
        weighted_score: 36, // 90 * 0.4
        score_weight: 0.4,
        score_reason: 'All core competencies present.',
        isCompatible: true,
        strength: 'Strong technical and problem-solving skills.',
        weaknesses: 'Minor gaps in advanced ML experience.',
      },
      {
        score_title: 'Achievements & Quantifiable Results',
        raw_score: 80,
        weighted_score: 4, // 80 * 0.05
        score_weight: 0.05,
        score_reason: 'Some measurable achievements present.',
        isCompatible: true,
        strength: 'Delivered measurable impact.',
        weaknesses: 'Could include more recent results.',
      },
      {
        score_title: 'Job-Specific Filters',
        raw_score: 95,
        weighted_score: 4.75, // 95 * 0.05
        score_weight: 0.05,
        score_reason: 'Location and work eligibility match.',
        isCompatible: true,
        strength: 'Fully eligible and available immediately.',
        weaknesses: 'None.',
      },
      {
        score_title: 'Cultural & Organizational Fit (Emerging Factor)',
        raw_score: 60,
        weighted_score: 3, // 60 * 0.05
        score_weight: 0.05,
        score_reason: 'Some alignment with company values.',
        isCompatible: false,
        strength: 'Shows collaborative behavior.',
        weaknesses: 'Less exposure to high-pressure cross-functional teams.',
      },
    ],
    overall_match_summary: {
      // Weighted average to keep between 0–100
      overall_match_score: 69.75,
      summary: [
        {
          summary_text:
            'You are a strong software engineer with good experience in C#, scripting languages, testing and automation; that covers many software aspects of the role.',
          summary_temperature: 'Good',
        },
        {
          summary_text:
            "However, Magic Leap's Associate Software Systems Engineer role emphasizes hands‑on equipment/mechatronics, cleanroom testing, and an engineering degree in Mechanical/Electrical/Systems — these are not clearly present in your resume.",
          summary_temperature: 'Bad',
        },
        {
          summary_text:
            'Given the high number of applicants, the lack of clear hardware/test-equipment experience and the missing degree make getting an interview less likely without targeted changes.',
          summary_temperature: 'Neutral',
        },
      ],
      suggestions: [
        'If you decide to apply, tailor your resume and cover note to surface any hardware/mechatronics or equipment-integration work: list specific projects, hardware interfacing code (C/C++), embedded controller work, instrumentation, or cleanroom-related experience.',
        'Add or emphasize a short Projects section with 1–3 concrete hardware/equipment-control examples (code repo links, screenshots, brief architecture: e.g., C/C++ or C# equipment control, LabVIEW, microcontroller interfacing, test rigs, integration with sensors/actuators).',
        'If you have coursework, certificates, or lab experience in Mechanical/Electrical/Systems, explicitly state it. If you lack the degree, highlight transferable coursework or hands-on lab experience.',
        'Learn or show LabVIEW and add any relevant exposure to computer vision (even small demos) — both are pluses for this role.',
        'Quantify hands-on testing: mention hours per week on hardware rigs, cleanroom exposure, or equipment debugging incidents and outcomes.',
        'Network: try to find an internal referral at Magic Leap or reach out to the hiring manager/recruiter with a concise message emphasizing your hardware-adjacent projects and willingness to learn and relocate.',
        'Prepare examples for interviews (equipment control flow, a debugging story integrating software+hardware, unit test in simulation, C#/C++ examples).',
      ],
    },
  },
});
