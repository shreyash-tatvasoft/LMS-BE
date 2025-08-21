"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listBooks = listBooks;
exports.createBook = createBook;
exports.updateBook = updateBook;
exports.deleteBook = deleteBook;
const db_1 = require("../config/db");
async function listBooks(_req, res) {
    const [rows] = await db_1.db.query("SELECT * FROM books ORDER BY id DESC");
    res.json({ data: rows, success: true });
}
async function createBook(req, res) {
    const { title, description, quantity, author } = req.body;
    await db_1.db.query("INSERT INTO books (title, description, quantity, author) VALUES (?, ?, ?, ?)", [
        title,
        description,
        quantity,
        author,
    ]);
    res.status(201).json({ success: true, message: "Book created" });
}
async function updateBook(req, res) {
    const id = req.params.id;
    const { title, description, quantity, author } = req.body;
    await db_1.db.query("UPDATE books SET title=?, description=?, quantity=?, author=? WHERE id=?", [
        title,
        description,
        quantity,
        author,
        id,
    ]);
    res.json({ success: true, message: "Book updated" });
}
async function deleteBook(req, res) {
    const id = req.params.id;
    await db_1.db.query("DELETE FROM books WHERE id=?", [id]);
    res.json({ success: true, message: "Book deleted" });
}
