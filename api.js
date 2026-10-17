
const API_BASE_URL = "http://127.0.0.1:8000";

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "Cannot connect to the backend. Start FastAPI at http://127.0.0.1:8000."
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail = data.detail;
    const message = Array.isArray(detail)
      ? detail.map((item) => item.msg).join(", ")
      : typeof detail === "string"
        ? detail
        : `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data;
}

function post(path, body) {
  return request(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export const api = {
  chat: (message) => post("/api/ai/chat", { message }),

  getRoadmap: () => request("/api/roadmap"),

  addRoadmapItem: (item) => post("/api/roadmap", item),

  updateRoadmapItem: (id, item) =>
    request(`/api/roadmap/${id}`, {
      method: "PUT",
      body: JSON.stringify(item),
    }),

  deleteRoadmapItem: (id) =>
    request(`/api/roadmap/${id}`, {
      method: "DELETE",
    }),

  getDashboard: () => request("/api/dashboard"),

  generateQuiz: (topic, number_of_questions = 5) =>
    post("/api/quiz/", { topic, number_of_questions }),

  analyzeSkillGap: (current_skills, target_skill) =>
    post("/api/skill-gap/", { current_skills, target_skill }),

  generateStudyPlan: (learning_goal, available_time) =>
    post("/api/study-planner/", { learning_goal, available_time }),
};
