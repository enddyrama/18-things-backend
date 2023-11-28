import { pool } from "../../../db";
import moment from "moment";
import { result } from "lodash";
import bycrypt from "bcryptjs";

interface CreateUserProps {
  email: string;
  username: string;
  password: string;
}

export const createUser = async ({
  email,
  username,
  password,
}: CreateUserProps) => {
  try {
    const connection = await pool.getConnection();
    const salt = await bycrypt.genSalt();
    const hashedPassword = await bycrypt.hash(password, salt);
    const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
    const query =
      "INSERT INTO users (email, username, password, created_at) VALUES (?, ?, ?, ?)";
    const [result] = await connection.query(query, [
      email,
      username,
      hashedPassword,
      createdAt,
    ]);
    connection.release(); // Release the database connection
    return true;
  } catch (error) {
    console.log(error);
    // Handle errors here
    return false;
  }
};

interface GetAllUsersProps {
  page: number;
  pageSize: number;
}

export const getAllUser = async ({ page, pageSize }: GetAllUsersProps) => {
  try {
    const connection = await pool.getConnection();
    const offset = (page - 1) * pageSize;
    const query = "SELECT * FROM users LIMIT ? OFFSET ?";
    const rows = await connection.query(query, [pageSize, offset]);
    connection.release();

    return rows;
  } catch (error) {
    // Handle errors here
    console.log(error);
    return null;
  }
};

interface FindEmailProps {
  email: string;
}

export const getUserByEmail = async ({ email }: FindEmailProps) => {
  try {
    const connection = await pool.getConnection();
    const query = "SELECT * FROM users WHERE email = ?";
    const [rows] = await connection.query(query, [email]);
    connection.release();
    if (rows) {
      return rows;
    } else {
      return null;
    }
  } catch (error) {
    // Handle errors here
    return null;
  }
};

interface FindUsernameProps {
  username: string;
}
export const getUserByUsername = async ({ username }: FindUsernameProps) => {
  try {
    const connection = await pool.getConnection();
    const query = "SELECT * FROM users WHERE email = ?";
    const [rows] = await connection.query(query, [username]);
    connection.release();
    if (rows) {
      return rows;
    } else {
      return null;
    }
  } catch (error) {
    // Handle errors here
    return null;
  }
};

interface FindIdProps {
  id: string;
}
export const getUserById = async ({ id }: FindIdProps) => {
  try {
    const connection = await pool.getConnection();
    const query = "SELECT * FROM users WHERE id = ?";
    const [rows] = await connection.query(query, [id]);
    connection.release();
    if (rows) {
      return rows;
    } else {
      return null;
    }
  } catch (error) {
    // Handle errors here
    return null;
  }
};

interface EditUserProps {
  id: string;
  email?: string;
  username?: string;
  password?: string;
}

export const editUserById = async ({ id, email, username, password }: EditUserProps) => {
  try {
    const connection = await pool.getConnection();
    console.log("Asd", username)
    // Build the SET clause for the UPDATE query based on provided parameters
    const updateFields = [];
    const updateValues = [];

    if (email) {
      updateFields.push("email = ?");
      updateValues.push(email);
    }

    if (username) {
      updateFields.push("username = ?");
      updateValues.push(username);
    }

    if (password) {
      const salt = await bycrypt.genSalt();
      const hashedPassword = await bycrypt.hash(password, salt);
      updateFields.push("password = ?");
      updateValues.push(hashedPassword);
    }

    if (updateFields.length === 0) {
      // No valid fields to update, return false indicating no changes were made
      connection.release();
      return false;
    }

    // Add the id to the values array for the WHERE clause
    updateValues.push(id);

    // Construct the UPDATE query
    const query = `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`;

    const [result] = await connection.query(query, updateValues);
    connection.release();

    // Check if a row was affected, indicating successful update
    if (result.affectedRows > 0) {
      return true;
    } else {
      // No rows were affected, meaning the user with the given ID wasn't found
      return false;
    }
  } catch (error) {
    // Handle errors here
    console.log(error);
    return false;
  }
};

interface DeleteUserProps {
  id: string;
}

export const deleteUserById = async ({ id }: DeleteUserProps) => {
  try {
    const connection = await pool.getConnection();
    const query = "DELETE FROM users WHERE id = ?";
    const [result] = await connection.query(query, [id]);
    connection.release();

    // Check if a row was affected, indicating successful deletion
    if (result.affectedRows > 0) {
      return true;
    } else {
      // No rows were affected, meaning the user with the given ID wasn't found
      return false;
    }
  } catch (error) {
    // Handle errors here
    console.log(error);
    return false;
  }
};
