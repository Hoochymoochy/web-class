let users = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Doe" },
];

const getAllUsers = (req, res) => {
    res.status(200).json(users);
};

const getUserById = (req, res) => {
    const user = users.find(u => u.id === Number(req.params.id));
    if (!user) return res.sendStatus(404);
    res.status(200).json(user);
};

const createUser = (req, res) => {
    const user = { id: users.length + 1, name: req.body.name };
    users.push(user);
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

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };