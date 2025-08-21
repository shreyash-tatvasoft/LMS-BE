import { Request, Response } from "express";
import { db } from "../config/db";

interface AuthRequest extends Request {
  user?: { id: number; role: string };
}

// Admin: Get all assigned books
export async function listAssignedBooks(req: AuthRequest, res: Response) {
  if (req.user?.role !== "ADMIN") {
    return res.status(404).json({success: false, message: "Access denied" });
  }

  const [rows] = await db.query(`
    SELECT ab.id, ab.studentId, u.fullName AS studentName, ab.bookId, b.title AS bookTitle, 
           ab.issueDate, ab.returnDate, ab.status
    FROM assignedbooks ab
    JOIN users u ON ab.studentId = u.id
    JOIN books b ON ab.bookId = b.id
    ORDER BY ab.id DESC
  `);

  res.json({ data : rows, success: true });
}

// Admin: Assign book
export async function assignBook(req: AuthRequest, res: Response) {

  const { studentId, bookId, issueDate, returnDate } = req.body;

  // Check book exists
  const [bookRows] = await db.query("SELECT * FROM books WHERE id = ?", [bookId]);
  const book = (bookRows as any[])[0];
  if (!book) return res.status(404).json({success: false, message: "Book not found" });
  if (book.quantity <= 0) return res.status(400).json({success: false,  message: "Book is out of stock" });

  // Check student exists
  const [studentRows] = await db.query("SELECT * FROM users WHERE id = ? AND role = 'STUDENT'", [studentId]);
  if ((studentRows as any[]).length === 0) return res.status(404).json({success: false, message: "Student not found" });

  // Prevent duplicate active assignment
  const [existingRows] = await db.query(
    "SELECT * FROM assignedbooks WHERE studentId = ? AND bookId = ? AND status = 'ISSUED'",
    [studentId, bookId]
  );
  if ((existingRows as any[]).length > 0) {
    return res.status(400).json({ success: false, message: "This book is already assigned to the student" });
  }

  // Assign book
  await db.query(
    "INSERT INTO assignedbooks (studentId, bookId, issueDate, returnDate, status) VALUES (?, ?, ?, ?, 'ISSUED')",
    [studentId, bookId, issueDate, returnDate]
  );
  await db.query("UPDATE books SET quantity = quantity - 1 WHERE id = ?", [bookId]);

  res.status(201).json({ success: true, message: "Book assigned to student" });
}

// Admin: Mark book as returned
export async function returnBook(req: AuthRequest, res: Response) {
  const id = req.params.id;

  const [rows] = await db.query("SELECT * FROM assignedbooks WHERE id = ?", [id]);
  const assignment = (rows as any[])[0];
  if (!assignment) return res.status(404).json({ success: false, message: "Assigned book not found" });

  if (assignment.status === "RETURNED") {
    return res.status(400).json({ success: false, message: "Book already returned" });
  }

  // Update status to RETURNED
  await db.query("UPDATE assignedbooks SET status = 'RETURNED', returnedAt = CURDATE() WHERE id = ?", [id]);
  await db.query("UPDATE books SET quantity = quantity + 1 WHERE id = ?", [assignment.bookId]);

  res.status(200).json({ success: true, message: "Book marked as returned" });
}

// Student: Get own assigned books
export async function getMyAssignedBooks(req: AuthRequest, res: Response) {
  if (!req.user || req.user.role !== "STUDENT") {
    return res.status(403).json({ success: false, message: "Access denied" });
  }

  const studentId = req.user.id;

  const [rows] = await db.query(`
    SELECT ab.id, ab.bookId, b.title AS bookTitle, ab.issueDate, ab.returnDate, ab.status, ab.returnedAt
    FROM assignedbooks ab
    JOIN books b ON ab.bookId = b.id
    WHERE ab.studentId = ?
    ORDER BY ab.id DESC
  `, [studentId]);

  res.status(200).json({ success: true, data : rows});
}

// Admin: Get all students (for dropdown)
export async function getStudents(_req: AuthRequest, res: Response) {
  const [rows] = await db.query("SELECT id, fullName, email FROM users WHERE role = 'STUDENT' ORDER BY fullName ASC");
  res.status(200).json({success: true, data: rows});
}
