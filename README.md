# Looking for a job? Me too buddy

This is a personal tool I'm developing for myself to help me get through unemployment purgatory, but feel free to look around the repo.

**As of 6/12, this is only the backend. Frontend interfaces are being developed separately so I can access this tool from my iPhone or macbook when I'm away from home.**

## For the curious

Long story short, it's an overglorified resume/coverletter proofreader that's also an application tracker and job match analyzer. The purpose of the job match analyzer is moreso to provide some extra insight on my alignment to a particular role.

### Key Features

#### Job Post Compilation

- Automatically processes online job postings to extract and organize requirements, nice-to-haves, company values, salary ranges, and other relevant details.

#### Personalized Resume Optimization

- Uses NLP to analyze past resumes, cover letters, autobiographies, and any personal documents a user provides.
- Optimizes resumes to better showcase role alignment. It doesn't seek to create a perfect candidate. It just makes sure that only the relevant skills and experiences the user *actually* has are displayed.
- To the best of its ability, it will also display any skills or experiences that are not a 1:1 match but translate well into the role.
- Preserves the user's voice: Any edits or improvements maintains tone, phrasing, and intent, ensuring consistency with user's personal style.
  - This is done through studying any examples of writing, like previous essays, provided by the user. It prevents giving OpenAI too much "freedom" to just smash keywords together in a pretty way. The main goal is not to just         create cookie-cutter resumes and coverletters, but just different versions and recompilations of existing details. In other words, it just saves time of having to repeatedly pick and choose what you             want to display on your resume for a particular role.

#### Cover Letter Assistance

- Drafts cover letters based on user-provided resumes, writing samples, and biographies to help guide the user in writing a strong and professional cover letter.
  - Follows a strict guideline of preventing "keyword smashing" and dishonesty. It seeks to only guide the user while maintaining their authenticity.

#### Job Match Analysis

- Takes a look at your entire profile to compare how well you fit to the role you're applying for.
- Provides and explains match scores for the following categories, also weighed by employer preferences:
    1. Resume Keyword & Phrases
    2. Experience Alignment
    3. Education & Credentials
    4. Skills & Competencies
    5. Achievements & Quantifiable Results
    6. Job-Specific Filters (i.e. Clearances/citizenship required)
    7. Cultural & Organizational Fit
- Shows a radar chart to display your overall fit.
- Provides an overall match score.
- Gives advice on whether or not you should apply.
  - Takes into account job post age, applicant count, industry, company size, and other external factors when giving feedback,

#### Job Application Tracking

- Logs your job applications directly into Google Sheets.
- Helps you stay organized by tracking application status, interview count, and key dates.
- Also displays job applications and their status in the react ui.

## Some notes if you want to try this out

If you want to use this tool, keep in mind that I designed it for my own personal use.  
It will require an OpenAI API key, which does cost some money. Money that only a job can give you :/  
I'm using OpenAI's GPT-4o model because I have credits. That's literally the only reason for it. Otherwise, feel free to fork and change up the LLM used.

### **Requirements**

- Docker
- Google Cloud credentials with Sheets API enabled
- OpenAI API Key

### **Setting it up**

1. In `/root/`:
    - .env file (example provided of what info to put in there)
    - Add OpenAI, Google Sheets, and postgresql environment variables to docker-compose.yml
    - Add credentials.json from Google Cloud under `/google_config/`
2. In `/root/data/`
    - Add  
    - Add position, title, url, and description of a job you're applying for to `jobPosting.txt`
    - Add any cover letter corrections you need Open AI to be aware of if it made mistakes to `/corrections/coverLetterCorrections.txt`
    - Add any resume mistakes you need Open AI to be aware of if it made mistakes to `/corrections/mistakesMade.txt`
    - Add one or more examples of your OWN ORIGINAL writing to `user_info/my_writing/`
        - **NOTE:** It should be able to read in text, .docx,. or pdfs.
    - Add your current resume in a json format to `user_info/resume.json`.
    - Add some additional information about yourself to `user_info/aboutMe.txt`.
        - This can be a novel, autobiography, or even another resume.
3. In your editor's terminal (or whatever terminal you're using) run the following in order:

    ```bash
    docker compose build
    docker compose up
    ```

4. When the server receives an API call, it creates the following files/folders under `/root/output/`:
    - `/cover_letters/` : Contains all generated cover letter drafts, each tailored to a specific job application.
    - `/guiding_answers/` : Stores extracted or generated guiding insights to help you craft personalized applications (e.g., relevant keywords, company context, etc.).
    - `/match_summaries/` : Contains summaries analyzing how well your current resume matches a job posting, often used to guide resume revisions.
    - `/resumes/` : Holds all revised resumes, typically one per company or job application.
    - `/change-summary.md` : A human-readable markdown report summarizing all modifications made to your resume for a given job.
    - `*.log, *.aux, etc. (LaTeX build artifacts)`: Used internally by the LaTeX compiler for formatting your final documents—usually safe to ignore or delete after generation.

## Additional Info

Credit for the resume template goes to Claud D. Park <posquit0.bj@gmail.com>  
You can view the template here: <https://github.com/posquit0/Awesome-CV>

## TODO

1. ~~Add functionality to showcase relevant skills on resume.~~
2. ~~Add functionality to showcase relevant projects on resume.~~
3. ~~Add functionality to showcase relevant courses taken on resume.~~
4. Add cool UI stuff.
5. Don't cry.
