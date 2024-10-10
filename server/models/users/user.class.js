import e from "express";

async function createUser(user) {
  try {
    await user.save();
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export { createUser };
