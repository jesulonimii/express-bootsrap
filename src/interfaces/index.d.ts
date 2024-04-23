import { Types } from "mongoose"

export {}


declare global {

	interface IConfig {
		env: "development" | "production" | "staging";
		root: string;
		port: number;
		ip: string;
		apiRoot: string;
		defaultEmail: string;
		masterKey: string;
		JWT_SECRET: string;
		MONGO_DB: {
			uri: string;
			options: {
				debug: boolean;
			}
		}
		ANCHOR_API_KEY: string;
		ANCHOR_BASE_URL: string;
		ANCHOR_BASE_SERVER: string;
		ANCHOR_KEY_CUSTOMER_ID: string;
		YOUVERIFY_API_KEY: string;
		YOUVERIFY_API_URL: string;
	}

	interface IUser {
		_id: Types.ObjectId | string
		id?: Types.ObjectId | string
		phone: string
		password: string
		name: string
		first_name: string
		middle_name?: string
		last_name: string
		date_of_birth: string
		email?: string
		picture?: string
		address?: string
		nin?: string

		authenticate?: (password?: string) => Promise<boolean | IUser>
		view?: (populate?: boolean) => Promise<IUser>
	}

	interface IYouVerifyLog {
		phone: string
		nin: string
		dataLog: string
		view: (full?: boolean) => {}
	}

	interface IServiceError extends Error {
		code?: number
		message: string
	}

	interface IPagination {
		page: number
		limit: number
		skip: number
	}


}


