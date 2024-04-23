import { NextFunction, Request, Response } from "express"


export const detectCompression = (req: Request, res: Response, next: NextFunction) => {

	const trigger = req.headers['x-content-encoding']


	if (trigger){
		console.log(trigger)
		req.headers['content-encoding'] = 'gzip'

		next()
	} else {
		next()
	}

}
