import { verify } from "#helpers/jwt"
import { ErrorResponse, STATUS_CODE } from "#utils"
import logger from "#helpers/logger"
import User from "#src/api/user/user.model"
import { NOT_FOUND, UNAUTHORIZED } from "#utils/status-codes"
import crypto from "crypto"
import Admin from "#src/api/admin/admin.model"


const {FORBIDDEN} = STATUS_CODE

export const verifyRequestSource = async (req, res, next) => {



	const key = req?.headers["x-api-key"] || req?.headers["api-key"] || req?.headers["access-key"]

	if (key) {

		//console.log(key)
		//console.log(process.env.SOURCE_ACCESS_KEY ?? SOURCE_ACCESS_KEY)

		const valid = key === process.env.SOURCE_ACCESS_KEY


		if (!valid) {
			return ErrorResponse(res, FORBIDDEN, "We are unable to verify this request (0xe79)")
		}

		next()
	} else {
		return ErrorResponse(res, FORBIDDEN,"We are unable to verify this request (0xe78)")
	}
}

export const verifyAdminToken = async (req, res, next) => {
	console.log("cookies", req?.cookies)

	const token = req?.cookies?.access_token || req?.cookies?.token || req?.headers?.authorization?.split(" ")[1]

	if (token) {
		const decode: any = verify(token)

		if (!decode) {
			return res.status(UNAUTHORIZED).send({ message: "You are not authorized to use this endpoint (0x01)" })
		}

		const admin = await Admin.findById(decode?.id)
		if (!admin) return res.status(UNAUTHORIZED).send({ message: "You are not authorized to use this endpoint (0x02)" })

		//req.user = admin
		//req.admin = admin
		next()
	} else {
		req.user = undefined
		req.admin = undefined
		next() //todo: remove this
		//res.status(UNAUTHORIZED).send({ message: "You are not authorized to use this endpoint", })
	}
}

export const checkUserBlockedStatus = async (req, res, next) => {

	const { sessionOwnerID } = req.body

	try {
		const user = await User.findOne({ phone: sessionOwnerID})

		if (!user || (user?.role === "merchant" && user?.approval_status !== "approved")) {
			return ErrorResponse(res, NOT_FOUND,"User not found")
		}


		if (user.is_blocked) {
			return res.status(UNAUTHORIZED).json({
				error: "You cannot proceed with this transaction. Please contact Admin",
				status: "error",
				reason: user.block_reason,
			})
		}

		next()
	}
	catch (error) {
		console.error("error@verifyAdminToken", error)
		return ErrorResponse(res, UNAUTHORIZED, "A server error occurred, could not find user")
	}


}


export const verifyWebhookRequest = async (req, res, next) => {


	const signature = req?.headers?.['X-Anchor-Signature'];
	const data = JSON.stringify(req?.body);
	const hmac = crypto.createHmac('sha256', process.env.WEBHOOK_SECRET);

	hmac.update(data);

	const calculatedSignature = hmac.digest('hex');

	const valid = calculatedSignature === signature;

	console.log({signature, calculatedSignature, valid})

	if (valid) {
		return res.status(UNAUTHORIZED).send({ message: "You are not authorized to use this endpoint (0x01)" })
	}
}


// 0x01 - Invalid token
// 0x02 - No token provided
