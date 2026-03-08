import { getUser, addUser } from './prismaController.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const register = async (req, res) => {
  const { email, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const id = await addUser(email, hashedPassword, name);
  const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(201).json({ token, id, email, name });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  // const user = await getUser(email);
  // if (!user) {
  //   return res.status(401).json({ error: 'Invalid credentials' });
  // }
  // const isPasswordValid = await bcrypt.compare(password, user.password);
  // if (!isPasswordValid) {
  //   return res.status(401).json({ error: 'Invalid credentials' });
  // }
  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ token, id: user.id, email: user.email, name: user.name });
};

export { register, login };