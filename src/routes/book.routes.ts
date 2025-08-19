import { Router } from "express";
import { listBooks, createBook, updateBook, deleteBook } from "../controllers/book.controller";
import { auth } from "../middlewares/auth";
import { requireRole } from "../middlewares/requireRole";

const router = Router();

router.get("/", auth, listBooks);
router.post("/", auth, requireRole("ADMIN"), createBook);
router.put("/:id", auth, requireRole("ADMIN"), updateBook);
router.delete("/:id", auth, requireRole("ADMIN"), deleteBook);

export default router;
