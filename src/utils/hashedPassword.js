import bcrypt from "bcrypt";
const saltRounds = 10;
const newPassword = "starz123";

try {
  const hash = await bcrypt.hash(newPassword, saltRounds);
  console.log("Your hashed password is:", hash);
} catch (err) {
  console.error("Error:", err);
}
