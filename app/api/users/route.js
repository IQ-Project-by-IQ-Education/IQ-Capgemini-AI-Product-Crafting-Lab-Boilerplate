// Handles the whole list: GET (read all) and POST (add one).
import db from "@/lib/db";
import { NextResponse } from "next/server";

// Read all people, newest first
export async function GET() {
  const users = db.prepare("SELECT * FROM users ORDER BY id DESC").all();
  return NextResponse.json(users);
}

// Add a new person
export async function POST(request) {
  const { name, email } = await request.json();
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  try {
    const info = db
      .prepare("INSERT INTO users (name, email) VALUES (?, ?)")
      .run(name, email || null);
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(info.lastInsertRowid);
    return NextResponse.json(user, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
