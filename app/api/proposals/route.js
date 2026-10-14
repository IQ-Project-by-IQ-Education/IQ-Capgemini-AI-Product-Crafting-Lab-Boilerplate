import db from "@/lib/db";

export async function GET() {
  const rows = db
    .prepare(
      `SELECT
        id,
        siret,
        office,
        timeline,
        price,
        references_text AS referenceNotes,
        content,
        created_at
      FROM proposals
      ORDER BY id DESC`
    )
    .all();

  return Response.json(rows);
}

export async function POST(request) {
  const { siret, office, timeline, price, references, content } = await request.json();

  const info = db
    .prepare(
      `INSERT INTO proposals
        (siret, office, timeline, price, references_text, content)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(siret, office, timeline, price, references, content);

  const saved = db
    .prepare(
      `SELECT
        id,
        siret,
        office,
        timeline,
        price,
        references_text AS referenceNotes,
        content,
        created_at
      FROM proposals
      WHERE id = ?`
    )
    .get(info.lastInsertRowid);

  return Response.json(saved);
}
