import { Request, Response } from "express";
import { db } from "../config/db";

export async function listBooks(_req: Request, res: Response) {
  try {
    const pool = await db;
    const [rows] = await pool.query("SELECT * FROM books ORDER BY id DESC");
    res.json({ data: rows, success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function createBook(req: Request, res: Response) {
  try {
    const { title, description, quantity, author } = req.body;
    const pool = await db;
    await pool.query(
      "INSERT INTO books (title, description, quantity, author) VALUES (?, ?, ?, ?)",
      [title, description, quantity, author]
    );
    res.status(201).json({ success: true, message: "Book created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function updateBook(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const { title, description, quantity, author } = req.body;
    const pool = await db;

    const [result]: any = await pool.query(
      "UPDATE books SET title=?, description=?, quantity=?, author=? WHERE id=?",
      [title, description, quantity, author, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    res.json({ success: true, message: "Book updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function deleteBook(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const pool = await db;

    // Check if the book exists
    const [bookRows]: any = await pool.query("SELECT * FROM books WHERE id=?", [id]);
    if (bookRows.length === 0) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    // Check if the book is currently issued
    const [issuedRows]: any = await pool.query(
      "SELECT * FROM assignedbooks WHERE bookId=? AND status='ISSUED'",
      [id]
    );
    if (issuedRows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete book. It is currently issued to a student."
      });
    }

    // Delete assignment history first
    await pool.query("DELETE FROM assignedbooks WHERE bookId=?", [id]);

    // Now delete the book
    await pool.query("DELETE FROM books WHERE id=?", [id]);

    res.json({ success: true, message: "Book deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

