import { createTeam, getTeams, addTeamMember, getUserTeams, promoteMember, removeMember } from "../controller/teamController.js";
import express from "express";

const router = express.Router();

router.post("/", createTeam);
router.get("/:id", getTeams);
router.post("/add-member", addTeamMember);
router.get("/member/:id", getUserTeams);
router.put("/promote/:userId/:teamId", promoteMember);
router.delete("/remove-member/:userId/:teamId", removeMember);

export default router;