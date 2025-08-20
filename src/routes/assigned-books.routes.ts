import { Router } from "express";
import { listAssignedBooks, assignBook, returnBook, getStudents, getMyAssignedBooks } from "../controllers/assigned-books.controller";
import { auth } from "../middlewares/auth";
import { requireRole } from "../middlewares/requireRole";

const router = Router();

router.get("/", auth, requireRole("ADMIN"), listAssignedBooks); // list all assigned books
router.post("/", auth, requireRole("ADMIN"), assignBook); // assign book to student
router.delete("/:id", auth, requireRole("ADMIN"), returnBook); // remove assignment (return book)
router.get("/students", auth, requireRole("ADMIN"), getStudents);     // get all students (for dropdown)
router.get("/list-books", auth, requireRole("STUDENT"), getMyAssignedBooks);    // student gets own books

export default router;
