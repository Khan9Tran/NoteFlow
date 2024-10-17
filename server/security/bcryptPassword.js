import bcrypt from "bcrypt";

// Hàm mã hóa mật khẩu
export const hashPassword = async (password) => {
  const saltRounds = 10; // Số lượng vòng lặp để tạo salt
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

// Hàm xác thực mật khẩu
export const verifyPassword = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};
