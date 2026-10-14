import db from "@/lib/db";

const levelScores = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
  Expert: 4,
};

function getExpert(id) {
  const expert = db.prepare("SELECT id, name, email, created_at FROM experts WHERE id = ?").get(id);

  if (!expert) {
    return null;
  }

  const skills = db
    .prepare(
      `SELECT expert_id, name, level, level_score AS levelScore
       FROM expert_skills
       WHERE expert_id = ?
       ORDER BY level_score DESC, name`
    )
    .all(id);
  const projects = db
    .prepare(
      `SELECT expert_id, name, description
       FROM expert_projects
       WHERE expert_id = ?
       ORDER BY id`
    )
    .all(id);

  return { ...expert, skills, projects };
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const { name, email, skills = [], projects = [] } = await request.json();

  const save = db.transaction(() => {
    db.prepare("UPDATE experts SET name = ?, email = ? WHERE id = ?").run(name, email, id);
    db.prepare("DELETE FROM expert_skills WHERE expert_id = ?").run(id);
    db.prepare("DELETE FROM expert_projects WHERE expert_id = ?").run(id);

    const addSkill = db.prepare(
      "INSERT INTO expert_skills (expert_id, name, level, level_score) VALUES (?, ?, ?, ?)"
    );
    skills.forEach((skill) => {
      addSkill.run(id, skill.name, skill.level, levelScores[skill.level] || 1);
    });

    const addProject = db.prepare(
      "INSERT INTO expert_projects (expert_id, name, description) VALUES (?, ?, ?)"
    );
    projects.forEach((project) => {
      addProject.run(id, project.name || "Project", project.description || "");
    });
  });

  save();
  return Response.json(getExpert(id));
}
