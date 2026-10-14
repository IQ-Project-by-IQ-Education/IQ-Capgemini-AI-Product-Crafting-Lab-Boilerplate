import db from "@/lib/db";

const levelScores = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
  Expert: 4,
};

function listExperts() {
  const experts = db.prepare("SELECT id, name, email, created_at FROM experts ORDER BY name").all();
  const skills = db
    .prepare(
      `SELECT expert_id, name, level, level_score AS levelScore
       FROM expert_skills
       ORDER BY level_score DESC, name`
    )
    .all();
  const projects = db
    .prepare(
      `SELECT expert_id, name, description
       FROM expert_projects
       ORDER BY id`
    )
    .all();

  return experts.map((expert) => ({
    ...expert,
    skills: skills.filter((skill) => skill.expert_id === expert.id),
    projects: projects.filter((project) => project.expert_id === expert.id),
  }));
}

function getExpert(id) {
  return listExperts().find((expert) => expert.id === Number(id));
}

export async function GET() {
  return Response.json(listExperts());
}

export async function POST(request) {
  const { name, email, skills = [], projects = [] } = await request.json();

  const save = db.transaction(() => {
    const info = db.prepare("INSERT INTO experts (name, email) VALUES (?, ?)").run(name, email);

    const addSkill = db.prepare(
      "INSERT INTO expert_skills (expert_id, name, level, level_score) VALUES (?, ?, ?, ?)"
    );
    skills.forEach((skill) => {
      addSkill.run(info.lastInsertRowid, skill.name, skill.level, levelScores[skill.level] || 1);
    });

    const addProject = db.prepare(
      "INSERT INTO expert_projects (expert_id, name, description) VALUES (?, ?, ?)"
    );
    projects.forEach((project) => {
      addProject.run(info.lastInsertRowid, project.name || "Project", project.description || "");
    });

    return info.lastInsertRowid;
  });

  const id = save();
  return Response.json(getExpert(id));
}
