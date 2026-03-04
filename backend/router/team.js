import { createTeam, getTeams, addTeamMember, getUserTeams, promoteMember, removeMember } from "../controller/teamController.js";
import express from "express";

const router = express.Router();

router.post("/", createTeam);
router.get("/:id", getTeams);
router.post("/add-member", addTeamMember);
router.get("/member/:id", getUserTeams);
router.get("/promote/:id", promoteMember);
router.delete("/remove-member/:id", removeMember);

export default router;