import express from "express";
import { getAllTasks, getTaskById, createTask, updateTask, deleteTask, getUserTasks, assignTask, unassignTask, createComment, getComments, removeComment, getFilteredTasks } from "../controller/taskController.js";

const router = express.Router();

// ============= TASK ROUTES =============

router.get("/team/:teamId", getAllTasks);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.get("/team/:teamId/filter", getFilteredTasks);

// ============= TASK ASSIGNMENT ROUTES =============

router.get("/user/:userId/assigned", getUserTasks);
router.post("/assign", assignTask);
router.post("/unassign", unassignTask);

// ============= COMMENT ROUTES =============

router.get("/:taskId/comments", getComments);
router.post("/comments", createComment);
router.delete("/comments/:id", removeComment);

export default router;