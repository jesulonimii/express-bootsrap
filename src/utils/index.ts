import { IStatusCode } from "#utils/status-codes"
import { Response } from "express"
import crypto from "crypto"

export {default as STATUS_CODE} from "./status-codes"

export const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
]

export const MONTHS_ORDER = {
	January: 1,
	February: 2,
	March: 3,
	April: 4,
	May: 5,
	June: 6,
	July: 7,
	August: 8,
	September: 9,
	October: 10,
	November: 11,
	December: 12,
}

export const getMonthName = (month: number) => {
	return MONTHS[month - 1]
}

export const ErrorResponse = (res: Response, status: number, message: string, data: object = {}) => {
	return res.status(status ?? 500).send({ error: message, status: status ?? 500, message: message, data })
}

export const SuccessResponse = (message: string, data?:any) => {
	return { success: message, status: "ok", data: data }
}

export function makeId(length: number, options?: {upperCase?:boolean, prefix?:string, numeric?:boolean}) {



	let result = options.prefix ?? ""
	const characters = options.numeric ? '0123456789' : options.upperCase ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' : 'abcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
}


export const trimName = (name: string) => {
	const name_split = name?.split(" ")

	if (name_split?.length > 2)
		return `${name_split[0]} ${name_split[name_split.length - 1]}`
	else return name

}


export const padUserId = (userId) => {

	if (!userId) return  null

	if (userId?.length === 10 && userId?.length < 11 && userId[0] !== "0") {
		return userId?.padStart(11, "0")
	}
	else return userId

}


export const trimUserPhone = (phone: string) => {
	if (phone?.length === 11 && phone?.charAt(0) === "0" ) return  phone?.substring(1)
	else return phone
}


export const doNothing = () => {}


export const ServiceError = (code: IStatusCode, message:string)=>{
	//throw {code, message} as IServiceError
	const error : IServiceError = new Error(message);
	error.name = 'ServiceError';
	error.message = message;
	error.code = code;
	return error;
}

export function destructureName(name: string) {
	if (!name) {
		return {
			first_name: null,
			middle_name: null,
			last_name: null
		};
	}

	const name_parts = name.split(" ");

	if (name_parts.length === 2) {
		return {
			first_name: name_parts[0].replace(",", "") || null, // Assign first part as first_name or null if undefined
			middle_name: null,
			last_name: name_parts[1].replace(",", "") || null // Assign second part as last_name or null if undefined
		};
	}
	else if (name_parts.length === 4) {
		return {
			first_name: name_parts[1].replace(",", "") || null, // Assign first part as first_name or null if undefined
			middle_name: name_parts[2].replace(",", "") || null,
			last_name: name_parts[3].replace(",", "") || null // Assign second part as last_name or null if undefined
		};
	}
	else {
		return {
			first_name: name_parts[0].replace(",", "") || null, // Assign first part as first_name or null if undefined
			middle_name: name_parts[1].replace(",", "") || null, // Assign second part as middle_name or null if undefined
			last_name: name_parts.slice(2).join(" ").replace(",", "") || null // Combine remaining parts as last_name or null if undefined
		};
	}
}

export const MOCK_ENDPOINT = "http://localhost:9000/test"

export const ValidateSecretSignature = ({ payload, secret, signature, }) => {

	const hmac = crypto.createHmac('sha256', secret);
	const computedSignature = `sha256=${hmac.update(JSON.stringify(payload)).digest('hex')}`;

	console.log(computedSignature)

	return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computedSignature));
}

export const requireProcessEnv = (name: string) => {
	if (!process.env[name]) {
		throw new Error(`You must set the ${name} environment variable`);
	}
	return process.env[name];
};
