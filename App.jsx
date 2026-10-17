import React from "react";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Bot,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  LayoutDashboard,
  ListTodo,
  Send,
  Sparkles,
  Target,
  Trash2,
} from "lucide-react";
import { api } from "./api";

const features = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "chat", label: "AI Assistant", icon: Bot },
  { id: "roadmap", label: "Learning Roadmap", icon: ListTodo },
  { id: "quiz", label: "Quiz Generator", icon: BookOpen },
  { id: "skills", label: "Skill Gap", icon: Target },
  { id: "planner", label: "Study Planner", icon: CalendarDays },
];

export default function App() {
  const [active, setActive] = useState("dashboard");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const [dashboard, setDashboard] = useState({
    total_roadmap_items: 0,
    completed_items: 0,
    average_progress: 0,
  });

  const [roadmap, setRoadmap] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);

  const [topic, setTopic] = useState("");
  const [currentSkills, setCurrentSkills] = useState("");
  const [targetSkill, setTargetSkill] = useState("");
  const [goal, setGoal] = useState("");
  const [availableTime, setAvailableTime] = useState("1 hour per day");

  async function loadData() {
    try {
      const [items, stats] = await Promise.all([
        api.getRoadmap(),
        api.getDashboard(),
      ]);
      setRoadmap(items);
      setDashboard(stats);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function runTask(task) {
    setLoading(true);
    setError("");
    setResult("");

    try {
      const data = await task();
      setResult(
        data.answer ||
        data.response ||
        data.quiz ||
        data.analysis ||
        data.study_plan ||
        JSON.stringify(data, null, 2)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(event) {
    event.preventDefault();
    if (!message.trim()) return;

    const question = message.trim();
    setHistory((items) => [...items, { role: "user", text: question }]);
    setMessage("");
    setLoading(true);
    setError("");

    try {
      const data = await api.chat(question);
      setHistory((items) => [
        ...items,
        { role: "assistant", text: data.response || data.answer },
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function addRoadmap(event) {
    event.preventDefault();
    if (!title.trim()) return;

    try {
      await api.addRoadmapItem({
        title: title.trim(),
        description: description.trim(),
        category: "Learning",
        status: "Not Started",
        progress: 0,
      });
      setTitle("");
      setDescription("");
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteRoadmap(id) {
    try {
      await api.deleteRoadmapItem(id);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateProgress(item) {
    const nextProgress = item.progress >= 100 ? 0 : item.progress + 25;
    const nextStatus =
      nextProgress === 100 ? "Completed" : "In Progress";

    try {
      await api.updateRoadmapItem(item.id, {
        progress: nextProgress,
        status: nextStatus,
      });
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  const activeFeature = features.find((feature) => feature.id === active);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><GraduationCap size={25} /></div>
          <div>
            <strong>LearnPath AI</strong>
            <span>Your learning companion</span>
          </div>
        </div>

        <p className="menu-label">WORKSPACE</p>
        <nav>
          {features.map(({ id, label, icon: Icon }) => (
            <button
              className={`nav-link ${active === id ? "active" : ""}`}
              key={id}
              onClick={() => {
                setActive(id);
                setError("");
                setResult("");
              }}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Sparkles size={17} />
          <span>Learn something new every day.</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="eyebrow">PERSONAL LEARNING SPACE</span>
            <h1>{activeFeature?.label || "Dashboard"}</h1>
          </div>
          <div className="status-pill"><span /> Local AI workspace</div>
        </header>

        {error && (
          <div className="error-banner">
            <strong>Error:</strong> {error}
          </div>
        )}

        {active === "dashboard" && (
          <>
            <section className="welcome-card">
              <div>
                <span className="eyebrow light">YOUR NEXT CHAPTER STARTS HERE</span>
                <h2>Learn smarter, one step at a time.</h2>
                <p>Plan your goals, practice new skills, and track your progress.</p>
                <button className="primary-button" onClick={() => setActive("roadmap")}>
                  View my roadmap
                </button>
              </div>
              <div className="welcome-art"><GraduationCap size={90} /></div>
            </section>

            <section className="stats-grid">
              <StatCard label="Learning goals" value={dashboard.total_roadmap_items} icon={<Target />} />
              <StatCard label="Completed" value={dashboard.completed_items} icon={<CheckCircle2 />} />
              <StatCard label="Average progress" value={`${dashboard.average_progress}%`} icon={<Sparkles />} />
            </section>

            <section className="panel">
              <h2>Explore your tools</h2>
              <div className="feature-grid">
                {features.filter((feature) => feature.id !== "dashboard").map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <button
                      className="feature-card"
                      key={feature.id}
                      onClick={() => setActive(feature.id)}
                    >
                      <Icon size={23} />
                      <strong>{feature.label}</strong>
                      <span>Open tool →</span>
                    </button>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {active === "chat" && (
          <section className="panel">
            <h2>Ask LearnPath AI</h2>
            <p className="muted">Ask questions about programming, studies, or your learning goals.</p>

            <div className="chat-history">
              {history.length === 0 && (
                <div className="empty-state">
                  <Bot size={35} />
                  <strong>What would you like to learn today?</strong>
                  <span>For example: Explain JavaScript functions with an example.</span>
                </div>
              )}
              {history.map((item, index) => (
                <div className={`chat-message ${item.role}`} key={index}>
                  <strong>{item.role === "user" ? "You" : "LearnPath AI"}</strong>
                  <p>{item.text}</p>
                </div>
              ))}
              {loading && <p className="muted">AI is preparing your answer...</p>}
            </div>

            <form className="chat-form" onSubmit={sendMessage}>
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Ask a learning question..."
              />
              <button className="primary-button" disabled={loading}>
                <Send size={17} /> Send
              </button>
            </form>
          </section>
        )}

        {active === "roadmap" && (
          <>
            <section className="panel">
              <h2>Add a learning goal</h2>
              <form className="stack-form" onSubmit={addRoadmap}>
                <label>
                  Goal title
                  <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Learn React" />
                </label>
                <label>
                  Description
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What do you want to achieve?" />
                </label>
                <button className="primary-button">Add goal</button>
              </form>
            </section>

            <section className="panel">
              <h2>My learning goals</h2>
              {roadmap.length === 0 && <p className="muted">No goals yet. Add your first learning goal above.</p>}
              <div className="roadmap-list">
                {roadmap.map((item) => (
                  <article className="roadmap-item" key={item.id}>
                    <div className="roadmap-item-main">
                      <strong>{item.title}</strong>
                      <p>{item.description || "No description provided."}</p>
                      <div className="progress-track">
                        <div style={{ width: `${item.progress}%` }} />
                      </div>
                      <small>{item.progress}% complete · {item.status}</small>
                    </div>
                    <div className="item-actions">
                      <button className="small-button" onClick={() => updateProgress(item)}>
                        Update progress
                      </button>
                      <button className="icon-button" onClick={() => deleteRoadmap(item.id)} aria-label="Delete goal">
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}

        {active === "quiz" && (
          <section className="panel">
            <h2>Create a practice quiz</h2>
            <p className="muted">Generate multiple-choice questions for your chosen topic.</p>
            <form className="stack-form" onSubmit={(e) => {
              e.preventDefault();
              runTask(() => api.generateQuiz(topic));
            }}>
              <label>
                Topic
                <input value={topic} onChange={(e) => setTopic(e.target.value)} required placeholder="e.g. Python loops" />
              </label>
              <button className="primary-button" disabled={loading}>Generate quiz</button>
            </form>
            <ResultBox loading={loading} result={result} />
          </section>
        )}

        {active === "skills" && (
          <section className="panel">
            <h2>Find your skill gaps</h2>
            <p className="muted">Tell us what you know and what you want to learn.</p>
            <form className="stack-form" onSubmit={(e) => {
              e.preventDefault();
              runTask(() => api.analyzeSkillGap(currentSkills, targetSkill));
            }}>
              <label>
                Current skills
                <textarea value={currentSkills} onChange={(e) => setCurrentSkills(e.target.value)} required placeholder="e.g. HTML, CSS, basic JavaScript" />
              </label>
              <label>
                Target skill
                <input value={targetSkill} onChange={(e) => setTargetSkill(e.target.value)} required placeholder="e.g. React development" />
              </label>
              <button className="primary-button" disabled={loading}>Analyze skill gap</button>
            </form>
            <ResultBox loading={loading} result={result} />
          </section>
        )}

        {active === "planner" && (
          <section className="panel">
            <h2>Build your study plan</h2>
            <p className="muted">Create a practical learning schedule based on your available time.</p>
            <form className="stack-form" onSubmit={(e) => {
              e.preventDefault();
              runTask(() => api.generateStudyPlan(goal, availableTime));
            }}>
              <label>
                Learning goal
                <textarea value={goal} onChange={(e) => setGoal(e.target.value)} required placeholder="e.g. Prepare for a Python developer interview" />
              </label>
              <label>
                Available time
                <select value={availableTime} onChange={(e) => setAvailableTime(e.target.value)}>
                  <option>30 minutes per day</option>
                  <option>1 hour per day</option>
                  <option>2 hours per day</option>
                  <option>3 hours per day</option>
                  <option>Weekends only</option>
                </select>
              </label>
              <button className="primary-button" disabled={loading}>Generate study plan</button>
            </form>
            <ResultBox loading={loading} result={result} />
          </section>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <article className="stat-card">
      <div className="stat-icon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function ResultBox({ loading, result }) {
  if (loading) return <div className="result-box">Generating your result. Please wait...</div>;
  if (!result) return null;

  return (
    <section className="result-box">
      <h3><Sparkles size={18} /> Generated result</h3>
      <pre>{result}</pre>
    </section>
  );
}
