# Looking for a job? Me too buddy

This is a personal tool I'm developing for myself to help me get through unemployment purgatory, but feel free to look around the repo.
**As of 6/12, this is only the backend. The front-end is being developed separately**

## For the curious

### Things this doodad does

- Enhances your existing resume without rewriting it from scratch by building on your own writing style and content.
- Preserves your voice by using examples of your past writing and resume to maintain tone, phrasing, and intent.
- Incorporates additional experience details like bullet points, projects, and context you provide, turning raw notes into polished entries.
- Includes personal “About Me” information that isn’t on your resume, so the AI can infer and personalize without inventing.
- Generates a tailored cover letter draft that serves as a guided template, not a generic output.
- Analyzes your resume and compares it to the job and company using a scoring system to highlight match quality and improvement opportunities.
- Provides actionable feedback to help improve alignment with a job posting.
- A very simple and skeletal UI built with electron.
- Tracks job applications by logging them directly into Google Sheets, helping you stay organized throughout your job search.

### Things this doodad doesn't do

- Does not fabricate experience. It only works with information you provide. It enhances, organizes, and clarifies, but never invents.
- Does not generate a resume from scratch. You must have an existing resume and input to work from.
- Does not impersonate you. The writing style and content stay true to your voice and background.
- Does not replace your judgment. The cover letter draft is meant to be a guide, not a final submission.

Long story short: Is not a shortcut to dishonest applications. It supports ethical job searching by helping you better represent your own qualifications.

## Some notes if you want to try this out

If you want to use this tool, keep in mind that I designed it for my own personal use.
It will require an OpenAI API key, which does cost some money. Money that only a job can give you :/  
I'm using OpenAI's GPT-4o model because I have credits. That's literally the only reason for it. Otherwise, feel free to fork and change up the LLM used.

### **Requirements**

- Docker
- Google Cloud credentials with Sheets API enabled
- OpenAI API Key

### **Setting it up**

1. In `/root/config/`:
    - Add a .env file (example provided of what info to put in there)
    - Add credentials.json from Google Cloud under `/google_config/`
2. In `/root/data/`
    - Add position, title, url, and description of a job you're applying for to `jobPosting.txt`
    - Add any corrections you need Open AI to be aware of if it made mistakes to `corrections.txt`
    - Add one or more examples of your OWN ORIGINAL writing to `/my_data/writing_examples/`
        - **NOTE:** I'm currently working on having PDFs and word docs be used, but for now only .txt files work.
    - Add your current resume in a json format to `resume.json`.
    - Add some additional information about yourself to `aboutMe.txt`.
        - This can be a novel, autobiography, or even another resume.
3. In your editor's terminal (or whatever terminal you're using) run the following in order:

    ```bash
    docker compose build
    docker compose up
    ```

4. Navigate to `/root/electron/` and run:  

    ```npx electron .\main.js```

5. Under `/root/output/`, you will see a couple things:
    - `/cover_letters/` : your cover letter drafts are here
    - `/guiding_answers/` : some help with info about the job your applying to.
    - `/match_summaries/` : this directory will contain information about how well you stack up to a company you're applying to
    - `/resumes/` : this directory has all your resumes for each company you've applied for
    - `/change-summary.md` : shows you what changes were made to the current resume.
    - Several LaTeX log files

## Additional Info

Credit for the resume template goes to Claud D. Park <posquit0.bj@gmail.com>  
You can view the template here: <https://github.com/posquit0/Awesome-CV>

## TODO

1. ~~Add functionality to showcase relevant skills on resume.~~
2. ~~Add functionality to showcase relevant projects on resume.~~
3. ~~Add functionality to showcase relevant courses taken on resume.~~
4. Add cool UI stuff.
5. Don't cry.
