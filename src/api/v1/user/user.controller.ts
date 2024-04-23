import User from "#src/api/v1/user/user.model"
import { Request, Response } from "express"


export const GetUsers = async (req: Request, res: Response) => {
	const users = await User.find()
	res.send(users)
}
