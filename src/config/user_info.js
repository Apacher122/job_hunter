export default {
    // Basic User Information
    user_info: {
        first_name: process.env.FIRST_NAME, // I hope you know this
        last_name: process.env.LAST_NAME, // I hope you know this too
        summary: process.env.SUMMARY, // A one-liner. I.E. "Software Engineer at XYZ"
        location: process.env.LOCATION, // Your location
        mobile: process.env.MOBILE, // Your mobile number
        email: process.env.EMAIL, // Professional email
        github: process.env.GITHUB, // Your GitHub username
        linkedin: process.env.LINKEDIN, // Your LinkedIn username
    },
    education_info: {
        school: process.env.SCHOOL, // Your school name
        degree: process.env.DEGREE, // Your degree
        start_end: process.env.START_END, // Your field of study
        location: process.env.LOCATION, // Your graduation year
        coursework: process.env.COURSEWORK, // Relevant coursework
    }
}