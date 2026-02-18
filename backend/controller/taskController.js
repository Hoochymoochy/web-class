let tasksData = [
    { id: 1, title: "Task 1", description: "Description 1", priority: 1, dueDate: "2022-01-01", completed: false },
    { id: 2, title: "Task 2", description: "Description 2", priority: 2, dueDate: "2022-02-01", completed: true },
    { id: 3, title: "Task 3", description: "Description 3", priority: 3, dueDate: "2022-03-01", completed: false }
];

const getAllTasks = (req, res) => {
    res.status(200).json(tasksData);
};

const getTaskById = (req, res) => {
    const task = tasksData.find(t => t.id === Number(req.params.id));
    if (!task) return res.sendStatus(404);
    res.status(200).json(task);
};

const createTask = (req, res) => {
    const task = {
        id: tasksData.length ? Math.max(...tasksData.map(t => t.id)) + 1 : 1,
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        dueDate: req.body.dueDate,
        completed: req.body.completed
    };
    tasksData.push(task);
    res.status(201).json(task);
};

const updateTask = (req, res) => {
    const task = tasksData.find(t => t.id === Number(req.params.id));
    if (!task) return res.sendStatus(404);

    const { title, description, priority, dueDate, completed } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (completed !== undefined) task.completed = completed;

    res.status(200).json(task);
};

const deleteTask = (req, res) => { 
    const exists = tasksData.some(t => t.id === Number(req.params.id));
    if (!exists) return res.sendStatus(404);
    tasksData = tasksData.filter(t => t.id !== Number(req.params.id));
    res.sendStatus(204);
};

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };