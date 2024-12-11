# Looking for a job? Me too buddy

This is a personal tool I'm developing for myself to help me get through unemployment purgatory, but feel free to look around the repo.

## For the curious

- Things this doodad does:
    1. Takes information about my current experience, skills, and history and uses an LLM to compare it to a job description.
    2. Brings forward any skills and experience relevant to the position, while removing/ignoring irrelevant items.
    3. Optimizes my resume to be ATS compatible. Takes a droid to know a droid.
    4. Rephrases bullet points if it sounds stupid.

- Things this doodad doesn't do:
    1. Lie for you.
        - I designed this tool to specifically use information I provided. If you mentioned nothing about fight club, it shouldn't say anything about fight club. This is simply a tool to help, and not a replacement. Asking generative AI to fabricate a lie is still just you fabricating that lie, but with extra steps to automate it and make it faster. Use good judgement, measure twice, cut once, do your taxes, fold your laundry, and do better.

If you want to use this tool, keep in mind that I designed it for my own personal use. 
It will require an OpenAI API key, which does cost some money. Money that only a job can give you :/  
I'm using OpenAI's GPT-4o model because I have credits. Overkill it is, but lazy I am. I'll find a free LLM after I run out of credits.

## **Instructions**

    *Requirements: OpenAI API key, Docker, Node.JS*

1. Create "config" directory in project root.
2. Add a .env file in the newly created "config" directory.
    - In this .env file, add the following:
        ```OPENAI_API_KEY = # Your Openai API key.```
3. In ./data/ there are a couple files for you to edit:
    - job.json: Job description in json format (optional)
    - jobPosting.txt: Job details (Company name, about, etc).
    - resume.json: Your resume in a json format (gonna change this up to make it easier).
4. In /src/config/config.js, input your info.
5. In your editor's terminal (or whatever terminal you're using) run the following:  
        ```
        docker compose build
        docker compose up
        ```
6. A directory named "output" will be created in the root containing your resume and some latex log fies.  
Any changes made to your resume will be explained under /output/change-summary.pdf

## Additional Info

Credit for the resume template goes to Claud D. Park <posquit0.bj@gmail.com>  
You can view the template here: <https://github.com/posquit0/Awesome-CV>

## TODO

1. Add functionality to showcase relevant skills on resume.
2. Add functionality to showcase relevant projects on resume.
3. Add functionality to showcase relevant courses taken on resume.
4. Don't cry.
