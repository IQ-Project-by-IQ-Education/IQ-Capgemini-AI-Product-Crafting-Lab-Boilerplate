// Handles one person by id: PUT (edit) and DELETE (remove).
import db from "@/lib/db";
import { NextResponse } from "next/server";

// Edit a person
export async function PUT(request, { params }) {
  const { id } = await params;
  const { name, email } = await request.json();
  try {
    db.prepare("UPDATE users SET name = ?, email = ? WHERE id = ?").run(
      name,
      email || null,
      id
    );
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

// Delete a person
export async function DELETE(request, { params }) {
  const { id } = await params;
  db.prepare("DELETE FROM users WHERE id = ?").run(id);
  return NextResponse.json({ ok: true });
}
