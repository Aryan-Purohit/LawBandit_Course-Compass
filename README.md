# LawBandit_Course-Compass
# AI Syllabus to Calendar

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

This project is a submission for the LawBandit Software Internship selection. Course Compass is a web application that transforms a student's unstructured course syllabus into a beautifully organized and interactive calendar. By leveraging AI, it automates the tedious process of manually tracking deadlines, readings, and exams.

**Live Demo:** [**your-project-name.vercel.app**](https://your-project-name.vercel.app)

---

![Course Compass Screenshot](https://i.imgur.com/GkmD7sJ.png)
*(You should replace this with a screenshot of your own running application!)*

## Key Features

* **PDF Syllabus Upload:** Simple and intuitive drag-and-drop interface for `.pdf` files.
* **AI-Powered Event Extraction:** Uses the OpenAI API (GPT-4o) with a carefully crafted prompt to intelligently parse unstructured syllabus text into structured calendar events, correctly identifying Assignments, Readings, and Exams.
* **Dual View Mode:** Seamlessly toggle between an interactive monthly **Calendar View** and a chronological **Agenda View** to see deadlines at a glance.
* **Custom Dark Mode UI:** A sleek, professional, and fully custom-styled dark theme for optimal readability and aesthetics, built with Tailwind CSS.
* **Interactive Calendar:** The calendar is fully navigable and displays different event types in unique colors for clarity.

## Tech Stack & Explanation of Approach

My approach was to build a robust, user-friendly, and modern full-stack application using the best tools for the job.

* **Framework:** **Next.js** (App Router) was chosen for its powerful full-stack capabilities, file-based routing, and seamless deployment experience on Vercel.
* **Language:** **TypeScript** was used throughout the project to ensure type safety, improve developer experience, and reduce bugs.
* **Backend:** **Node.js** running in Vercel's Serverless Functions (via Next.js API Routes) provides a scalable and efficient backend to handle file processing and AI integration.
* **UI & Styling:** The UI is built with **React**. **Tailwind CSS** was used for styling to rapidly create a modern, responsive, and custom dark-themed design.
* **PDF Parsing:** I selected **`pdfnano`** for its lightweight, dependency-free, and robust server-side text extraction capabilities.
* **Calendar:** I implemented **`react-big-calendar`** for its powerful features and then heavily customized its CSS to match the application's dark theme.
* **Deployment:** The application is deployed on **Vercel**, providing automatic deployments on every `git push` to the main branch.

## Local Setup

To run this project on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd lawbandit-syllabus-app
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Set up environment variables:**
    Create a new file named `.env.local` in the root of the project and add your OpenAI API key:
    ```
    OPENAI_API_KEY="sk-..."
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:3000`.
