import { create } from "../../services/users.service";

async function registerUser(req, res, next) {
  try {
    const userData = req.body;
    const result = await create(userData);

    return res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
}

export { registerUser };
