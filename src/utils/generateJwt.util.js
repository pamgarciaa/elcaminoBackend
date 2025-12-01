//importacion de la libreria jsonwebtoken
import jwt from "jsonwebtoken";

//GENERATE JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
};
export default generateToken;
