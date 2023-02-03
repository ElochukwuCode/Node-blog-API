import { User } from "../models";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const createToken = (id) => {
  const SECRET = process.env.SECRET;
  return jwt.sign({ id }, SECRET, { expiresIn: 9900 });
};

class AuthController {
  static signup(req, res) {
    const model = req.body;
    User.create({
      firstName: model.firstName,
      lastName: model.lastName,
      email: model.email,
      password: model.password,
    })
      .then((user) => {
        const token = createToken(user.id);
        const userJSON = user.toJSON();
        delete userJSON.password;
        res.status(201).json({
          status: "success",
          message: "User created",
          data: { ...userJSON, token },
        });
      })
      .catch((err) =>
        res.status(500).json({
          status: "error",
          message: "Server error",
          error: err,
        })
      );
  }
  static async login(req, res) {
    const {
      body: { email, password },
    } = req;
    const user = await User.findOne({
      where: { email },
    });
    try {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = createToken(user.id);
        const userJSON = user.toJSON();
        delete userJSON.password;
        return res.status(200).json({
          status: "success",
          message: "log in approved",
          data: { ...userJSON, token },
        });
      } else {
        return res.status(401).json({
          status: "error",
          message: "Username or password incorrect",
        });
      }
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
}

export default AuthController;
