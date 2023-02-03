import jwt from "jsonwebtoken";
import { User } from "../models";

const requireAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  // check whether jwt token exits and is verified
  if (token) {
    jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
      if (err) {
        res.status(403).json({
          status: "error",
          message: "token could not be verified",
          error: err,
        });
      } else {
        let user = await User.findOne({ where: { id: decodedToken.id } });
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.status(401).json({
      status: "Error",
      message: "token was not found",
    });
  }
};

export default requireAuth;
