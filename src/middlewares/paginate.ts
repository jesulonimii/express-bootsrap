import { ErrorResponse } from "#utils"
import { BAD_REQUEST } from "#utils/status-codes"
import { NextFunction, Request, Response } from "express"



export const paginate = async (req: Request, res: Response, next: NextFunction) => {

	const page = parseInt(req.query.page as string) || 1
	const limit = parseInt(req.query.limit as string) || 10
	const skip = (page - 1) * limit

	if (isNaN(page) || isNaN(limit)) return ErrorResponse(res, BAD_REQUEST, "Invalid page or limit")

	if (limit > 100) return ErrorResponse(res, BAD_REQUEST, "Limit cannot exceed 100")

	req.pagination  = {
		page,
		limit,
		skip,
	}

	next()

}


export const generatePaginationMeta = (total: number, page: number, limit: number) => {
	return {
		total,
		page,
		pages: Math.ceil(total / limit),
		limit,
	}
}
