// Resume buildin' error checkin'

class ResumeBuilderError extends Error {
    constructor(message, details = {}) {
        super(message);
        this.name = this.constructor.name;
        this.timestamp = new Date().toISOString();
        this.details = details; // Optional, for extra context

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }

        if (details.captureStackTrace) {
            const stack = new Error().stack.split('\n')[2];
            const match = stack.match(/\((.*?):(\d+):\d+\)/);
            if (match) {
                this.file = match[1];
                this.line = parseInt(match[2], 10);
            }
        }
    }
}

export class LaTeXFileAccessError extends ResumeBuilderError {
    constructor(message = "Error accessing LaTeX file", details = {}) {
        super(message);
    }
}

export class ResumeSectionNotFoundError extends ResumeBuilderError {
    constructor(message = "Resume section not found", details = {}) {
        super(message);
    }
}