import { Document } from "mongoose"

export {}

declare global {
	namespace Express {
		export interface Request {
			//user?: IUser
			pagination?: IPagination
		}

		interface User extends IUser {}
		//interface User extends Document<any, any, any> {}
	}
}
