# Use an official Node.js runtime as a parent image
FROM node:latest

# Install LaTeX
RUN apt-get update && apt-get install -y \
    texlive-xetex \
    texlive-fonts-recommended \
    texlive-fonts-extra \
    texlive-latex-extra \
    texlive-lang-english \
    fontconfig \
    fonts-freefont-ttf \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /usr/src/

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install ts-node and typescript
RUN npm install -g ts-node typescript tsx

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["npx", "tsx", "server.ts"]