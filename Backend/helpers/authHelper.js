import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const securedPassword = await bcrypt.hash(password, salt);

    return securedPassword;
  } catch (error) {
    return error;
  }
};

const jwtAuth = (user) => {
  const data = {
    userId: {
      id: user.id,
    },
  };

  const authToken = jwt.sign(data, process.env.JWT_SECRET);

  return authToken;
};

const comparePassword = async (password, hashPassword) => {
  return await bcrypt.compare(password, hashPassword);
};

export { hashPassword, jwtAuth, comparePassword };
