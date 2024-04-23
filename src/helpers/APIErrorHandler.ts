import { INTERNAL_SERVER_ERROR, SERVICE_UNAVAILABLE } from "#utils/status-codes"
import logger from "#helpers/logger"
import { AxiosError } from "axios"
import { sendMailToAdmin } from "#src/helpers/mailer"
import { ServiceError } from "#utils"
import { env } from "#config"

export const AnchorApiErrorHandler = (error: AxiosError)=>{
	if (error?.response?.status === 500 || error?.response?.status === 503) {
		console.error(error?.response?.data)
		throw ServiceError(SERVICE_UNAVAILABLE, "Service is temporarily unavailable. Please try again later. 0x3PD")
	} else {
		console.error(`${error?.response?.status} => ${error?.response?.data}`)
		throw ServiceError(INTERNAL_SERVER_ERROR, "An error occurred while processing your request. Please try again later. 0x3PE")
	}
}


export const YouverifyApiErrorHandler = (error: AxiosError, id, type: "nin" | "phone")=>{
	console.error(error?.response?.data ?? error)

	if (error?.response?.status === 500 || error?.response?.status === 503) {

		if (env === "production") {

			sendMailToAdmin({
				subject: "Youverify API Error - Service Unavailable",
				message: `An error occurred while trying to fetch ${type} (${id}). Below is the error data: ${JSON.stringify(error?.response?.data)}`,
			})
		}

		throw ServiceError(SERVICE_UNAVAILABLE, "Service is temporarily unavailable. Please try again later. 0x3PD")

	}

	else if (error?.response?.status === 402) {

		if (env === "production") {

			sendMailToAdmin({
				subject: "Youverify API Error - Insufficient Balance",
				message: `Below is the error data: ${JSON.stringify(error?.response?.data)}`,
			})
		}

		throw ServiceError(INTERNAL_SERVER_ERROR, "An error occurred while processing your request. Please try again later. 0x3PE")
	}

	else if (error?.response?.status === 403) {

		if (env === "production") {

			sendMailToAdmin({
				subject: "Youverify API Error - Forbidden",
				message: `Below is the error data: ${JSON.stringify(error?.response?.data)}`,
			})
		}

		throw ServiceError(INTERNAL_SERVER_ERROR, "An error occurred while processing your request. Please try again later. 0x3PE")

	}

	else {
		throw ServiceError(INTERNAL_SERVER_ERROR, "An error occurred while processing your request. Please try again later. 0x3PE")
	}

}






// INFO: 0x3PD - 3rd Party Down
// INFO: 0x3PE - 3rd Party Error


