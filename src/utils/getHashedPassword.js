import bcrypt from "bcrypt";

const getHashedPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  return hashedPassword;
};

export default getHashedPassword;
