import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function POST(req) {
  const body = await req.json();

  const db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT,
      address TEXT,
      city TEXT,
      items TEXT,
      total INTEGER
    )
  `);

  await db.run(
    `
    INSERT INTO orders (name, phone, address, city, items, total)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    body.name,
    body.phone,
    body.address,
    body.city,
    JSON.stringify(body.items),
    body.total
  );

  return NextResponse.json({ success: true });
}
