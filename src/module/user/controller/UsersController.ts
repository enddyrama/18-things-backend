import { UserDto } from "../dto/UserDto";
import {
  getUserById,
  getAllUser,
  deleteUserById,
  editUserById,
} from "../repository/UserRepository";
import express from "express";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 0;
    const users = await getAllUser({ page: page, pageSize: pageSize });
    const usersDto: UserDto[] = users.map((user: UserDto) => ({
      id: user.id,
      username: user.username,
      created_at: user.created_at,
      updated_at: user.updated_at,
      email: user.email,
    }));
    return res.status(200).json({
      status: 200,
      result: usersDto,
      status_code: 1,
    });
  } catch (error) {
    console.log("err", error);
    return res.status(400).json({
      status: 400,
      message: error.message,
      status_code: 0,
    });
  }
};
export const getUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const users = await getUserById({ id });
    if (!users) {
      return res.status(400).json({
        status: 400,
        message: "No user by this Id",
        status_code: 0,
      });
    }

    const userDto = (users: any) => {
      const temp: any = {
        id: 0,
        username: "",
        created_at: "",
        updated_at: "",
        email: "",
      };

      for (const key in temp) {
        if (key !== "password" && users.hasOwnProperty(key)) {
          temp[key] = users[key];
        }
      }

      return temp;
    };
    const usersDto = userDto(users);

    return res.status(200).json({
      status: 200,
      data: usersDto,
      status_code: 1,
    });
  } catch (error) {
    console.log("err", error);
    return res.status(400).json({
      status: 400,
      message: error.message,
      status_code: 0,
    });
  }
};

export const putUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { email, username, password } = req.body;
    const user = await getUserById({ id });
    if (!user) {
      return res.status(400).json({
        status: 400,
        message: "No user by this Id",
        status_code: 0,
      });
    }
    await editUserById({ id, email, username, password });
    return res.status(200).json({
      status: 200,
      message: "Successfully Updated",
      status_code: 1,
    });
  } catch (error) {
    console.log("err", error);
    return res.status(400).json({
      status: 400,
      message: error.message,
      status_code: 0,
    });
  }
};

export const deleteUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const user = await getUserById({ id });

    await deleteUserById({ id });
    if (!user) {
      return res.status(400).json({
        status: 400,
        message: "No user by this Id",
        status_code: 0,
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Successfully deleted",
      status_code: 1,
    });
  } catch (error) {
    console.log("err", error);
    return res.status(400).json({
      status: 400,
      message: error.message,
      status_code: 0,
    });
  }
};
