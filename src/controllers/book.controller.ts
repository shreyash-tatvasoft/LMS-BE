import { Request, Response } from "express";
import { db } from "../config/db";

export async function listBooks(_req: Request, res: Response) {
  const [rows] = await db.query("SELECT * FROM books ORDER BY id DESC");
  res.json({ data: rows, success: true});
}

export async function createBook(req: Request, res: Response) {
  const { title, description, quantity, author } = req.body;
  await db.query("INSERT INTO books (title, description, quantity, author) VALUES (?, ?, ?, ?)", [
    title,
    description,
    quantity,
    author,
  ]);
  res.status(201).json({ success: true, message: "Book created" });
}

export async function updateBook(req: Request, res: Response) {
  const id = req.params.id;
  const { title, description, quantity, author } = req.body;
  await db.query("UPDATE books SET title=?, description=?, quantity=?, author=? WHERE id=?", [
    title,
    description,
    quantity,
    author,
    id,
  ]);
  res.json({ success: true, message: "Book updated" });
}

export async function deleteBook(req: Request, res: Response) {
  const id = req.params.id;
  await db.query("DELETE FROM books WHERE id=?", [id]);
  res.json({ success: true, message: "Book deleted" });
}
