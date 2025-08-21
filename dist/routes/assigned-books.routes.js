"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assigned_books_controller_1 = require("../controllers/assigned-books.controller");
const auth_1 = require("../middlewares/auth");
const requireRole_1 = require("../middlewares/requireRole");
const router = (0, express_1.Router)();
router.get("/", auth_1.auth, (0, requireRole_1.requireRole)("ADMIN"), assigned_books_controller_1.listAssignedBooks); // list all assigned books
router.post("/", auth_1.auth, (0, requireRole_1.requireRole)("ADMIN"), assigned_books_controller_1.assignBook); // assign book to student
router.delete("/:id", auth_1.auth, (0, requireRole_1.requireRole)("ADMIN"), assigned_books_controller_1.returnBook); // remove assignment (return book)
router.get("/students", auth_1.auth, (0, requireRole_1.requireRole)("ADMIN"), assigned_books_controller_1.getStudents); // get all students (for dropdown)
router.get("/list-books", auth_1.auth, (0, requireRole_1.requireRole)("STUDENT"), assigned_books_controller_1.getMyAssignedBooks); // student gets own books
exports.default = router;
