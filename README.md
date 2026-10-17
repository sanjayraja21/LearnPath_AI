# LearnPath_AI – Personalized Learning Platform

LearnPath_AI is a web-based learning platform designed to help students organize their learning activities, identify skill gaps, and create personalized study plans. It combines a React frontend, FastAPI backend, PostgreSQL database, and Ollama local AI model.

## 🚀 Features

- **Student Dashboard** – View learning activities and progress.
- **AI Learning Assistant** – Ask questions and receive AI-generated explanations using Ollama.
- **Personalized Learning Roadmap** – Organize learning goals into manageable tasks.
- **Smart Quiz Generator** – Support quiz-based learning and knowledge assessment.
- **Skill Gap Analysis** – Identify skills to improve based on user input.
- **Personal Study Planner** – Create structured study plans.
- **PostgreSQL Database** – Store supported application records and generated results.
- **Local AI Integration** – Use Ollama to run a language model locally.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| Vite | Frontend development server |
| Python | Backend programming |
| FastAPI | REST API development |
| SQLModel | Database models and operations |
| PostgreSQL | Relational database |
| pgAdmin | Database management |
| Ollama | Local AI model runtime |
| Llama 3.2 | AI language model |
| Git and GitHub | Version control and project hosting |

## 📁 Project Structure

```text
LearnPath_AI/
├── .env
├── requirements.txt
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── ai.py
│   └── routers/
│       ├── __init__.py
│       ├── assistant.py
│       ├── quiz.py
│       ├── skill_gap.py
│       └── study_planner.py
└── frontend/
    ├── package.json
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api.js
        └── styles.css
```

## 📋 Prerequisites

Install the following software before running the project:

- Python
- Node.js and npm
- PostgreSQL
- pgAdmin
- Ollama

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd LearnPath_AI
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Set up the Python backend

Create a virtual environment if one does not already exist:

```bash
python -m venv .venv
```

Activate it in Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install the required Python packages:

```bash
pip install -r requirements.txt
```

### 3. Configure PostgreSQL

Create a PostgreSQL database named:

```text
learnpath_ai
```

Create a `.env` file in the project root and configure the database connection:

```env
DATABASE_URL=postgresql+psycopg://postgres:YOUR_PASSWORD@localhost:5432/learnpath_ai
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

**Security:** Never upload your real `.env` file or database password to GitHub. Add `.env` to `.gitignore` and commit a `.env.example` file containing placeholder values instead.

### 4. Configure Ollama

Install Ollama and download the model:

```bash
ollama pull llama3.2
```

Ensure Ollama is running before testing AI-powered features. The backend should be configured to use the local Ollama API.

### 5. Start the backend

From the project root, activate the virtual environment and run:

```bash
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Backend URL:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

Keep the backend terminal open while using the application.

### 6. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

## 🗄️ Database Management

The application uses PostgreSQL to store records for supported features. Expected tables in the current project include:

- `assistantresult`
- `quizresult`
- `skillgapresult`
- `studyplanresult`
- `roadmapitem`

The actual tables and stored fields depend on the database models and backend implementation.

To view the stored records:

1. Open pgAdmin.
2. Connect to the PostgreSQL server.
3. Open `learnpath_ai`.
4. Navigate to **Schemas → public → Tables**.
5. Right-click a table and select **View/Edit Data → All Rows**.

Example SQL query:

```sql
SELECT * FROM assistantresult ORDER BY id DESC;
```

Data appears only when the relevant backend endpoint successfully saves it to PostgreSQL.

## 🔍 Troubleshooting

### Cannot connect to the backend

- Confirm FastAPI is running on port `8000`.
- Open `http://127.0.0.1:8000/docs`.
- Verify the frontend API base URL in `frontend/src/api.js`.
- Check the backend terminal for errors.

### PostgreSQL connection error

- Confirm PostgreSQL is running.
- Verify the database name, username, password, and port in `.env`.
- Confirm the required Python database packages are installed.

### AI Assistant is not responding

- Confirm Ollama is installed and running.
- Check that the `llama3.2` model is available.
- Verify the backend's Ollama API configuration.

### Data is not appearing in PostgreSQL

- Confirm the expected tables exist.
- Check that the feature's backend endpoint saves the result.
- Verify that the database transaction is committed.
- Inspect the backend terminal for errors.

## 🔐 Environment Variables

Keep private credentials out of source control.

Example `.gitignore` entries:

```gitignore
.env
.venv/
__pycache__/
*.py[cod]
node_modules/
dist/
```

Use `.env.example` to document the required configuration with placeholder values.

## 🎯 Project Objective

The objective of LearnPath_AI is to provide a centralized learning environment where students can ask questions, organize learning goals, assess skills, practice quizzes, and plan study activities.

## 🔮 Future Enhancements

- Student authentication and individual profiles
- Learning progress analytics
- Quiz history and performance tracking
- Roadmap completion tracking
- Personalized recommendations
- Study reminders and notifications
- Improved data validation and error handling

## 👨‍💻 Development

This project is developed as a learning and software development project using open-source tools and locally running AI software.

## 📄 License

Choose a license before distributing or reusing the project. If you intend to publish it as open source, consider adding an appropriate `LICENSE` file.

---

**LearnPath_AI – Learn smarter, plan better, and track your progress.**
