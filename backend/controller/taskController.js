import { getTeamTasks, getTaskById as getTakById, createTeamTask, updateTask as upTask, deleteTask as deTask, assignTaskToUser, unassignTaskFromUser, getUserAssignedTasks, addComment, getTaskComments, deleteComment } from '../controller/prismaController.js';

const getAllTasks = async (req, res) => {
    try {
        const { teamId } = req.params;
        const tasks = await getTeamTasks(teamId);
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await getTakById(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getFilteredTasks = async (req, res) => {
    try {
        const { teamId } = req.params;
        const {
            status,
            priority,
            assignedUserId,
            dueDateFrom,
            dueDateTo,
            sortBy,
            sortOrder
        } = req.query;

        const filters = {};
        if (status) filters.status = status;
        if (priority) filters.priority = priority;
        if (assignedUserId) filters.assignedUserId = assignedUserId;
        if (dueDateFrom) filters.dueDateFrom = dueDateFrom;
        if (dueDateTo) filters.dueDateTo = dueDateTo;
        if (sortBy) filters.sortBy = sortBy;
        if (sortOrder) filters.sortOrder = sortOrder;

        const tasks = await getFilteredTeamTasks(teamId, filters);
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createTask = async (req, res) => {
    try {
        const { 
            title, 
            description, 
            priority, 
            dueDate, 
            teamId, 
            createdByUserId,
            assignedToUserIds 
        } = req.body;

        if (!title || !teamId || !createdByUserId) {
            return res.status(400).json({ 
                error: 'Missing required fields: title, teamId, createdByUserId' 
            });
        }

        const task = await createTeamTask(
            title,
            description,
            priority || 'MEDIUM',
            dueDate,
            teamId,
            createdByUserId,
            assignedToUserIds || []
        );

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, priority, dueDate, status } = req.body;

        const task = await upTask(id, {
            title,
            description,
            priority,
            dueDate,
            status
        });

        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await deTask(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserTasks = async (req, res) => {
    try {
        const { userId } = req.params;
        const tasks = await getUserAssignedTasks(userId);
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const assignTask = async (req, res) => {
    try {
        const { taskId, userId } = req.body;

        if (!taskId || !userId) {
            return res.status(400).json({ 
                error: 'Missing required fields: taskId, userId' 
            });
        }

        const assignment = await assignTaskToUser(taskId, userId);
        res.status(201).json(assignment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const unassignTask = async (req, res) => {
    try {
        const { taskId, userId } = req.body;

        if (!taskId || !userId) {
            return res.status(400).json({ 
                error: 'Missing required fields: taskId, userId' 
            });
        }

        const assignment = await unassignTaskFromUser(taskId, userId);
        res.status(200).json(assignment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createComment = async (req, res) => {
    try {
        const { taskId, note } = req.body;

        if (!taskId || !note) {
            return res.status(400).json({ 
                error: 'Missing required fields: taskId, note' 
            });
        }

        const comment = await addComment(taskId, note);
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getComments = async (req, res) => {
    try {
        const { taskId } = req.params;
        const comments = await getTaskComments(taskId);
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const removeComment = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await deleteComment(id);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { getAllTasks, getTaskById, createTask, updateTask, deleteTask, getUserTasks, assignTask, unassignTask, createComment, getComments, removeComment, getFilteredTasks };