import { addUser  } from './prismaController.js';

const getAllUsers = async (req, res) => {
    const users = await addTask();
    res.status(200).json(users);
};

const getUserById = (req, res) => {
    const user = users.find(u => u.id === Number(req.params.id));
    if (!user) return res.sendStatus(404);
    res.status(200).json(user);
};

const createUser = async (req, res) => {
    const { email, password, name } = req.body;
    const user = await addUser(email, password, name);
    res.status(201).json(user);
};

const updateUser = (req, res) => {
    const user = users.find(u => u.id === Number(req.params.id));
    if (!user) return res.sendStatus(404);
    user.name = req.body.name;
    res.status(200).json(user);
};

const deleteUser = (req, res) => {
    const exists = users.some(u => u.id === Number(req.params.id));
    if (!exists) return res.sendStatus(404);
    users = users.filter(u => u.id !== Number(req.params.id));
    res.sendStatus(204);
};

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };