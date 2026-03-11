import { createTeam as creTeam, addUserToTeam, getTeamById as getTemById, getAllUserTeams, updateRoleFromTeam, removeUserFromTeam  } from './prismaController.js';

const addTeamMember = async (req, res) => {
    const { user_email, team_id } = req.body;
    const team = await addUserToTeam(user_email, team_id);
    res.status(201).json(team);
}

const createTeam = async (req, res) => {
    const { userId, name} = req.body;
    const team = await creTeam(name, userId);
    res.status(201).json(team);
};


const getTeams = async (req, res) => {
    const id = req.params.id;
    const teams = await getTemById(id);
    if (!teams) return res.sendStatus(404);
    res.status(200).json(teams);
};

const promoteMember = async (req, res) => {
    const { userId, teamId } = req.params;
    const team = await updateRoleFromTeam(userId, teamId, "TEAMADMIN");
    res.status(201).json(team);
}

const getUserTeams = async (req, res) => {
    const id = req.params.id;
    const teams = await getAllUserTeams(id);
    res.status(200).json(teams);
}

const removeMember = async (req, res) => {
    const { userId, teamId } = req.params;
    const team = await removeUserFromTeam(userId, teamId);
    res.status(201).json(team);
}

export { createTeam, addTeamMember, getTeams, getUserTeams, promoteMember, removeMember };