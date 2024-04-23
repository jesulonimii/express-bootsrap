import { NextFunction, Request, Response } from "express"
import passport from "passport"
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt"
import { JWT_SECRET } from "#config"
import User from "#src/api/user/user.model"
import { ErrorResponse } from "#utils"
import { UNAUTHORIZED } from "#utils/status-codes"
import { sign } from "#helpers/jwt"


interface IJwtAuthPayload {
	id: string
}

export const password = () => (req: Request, res: Response, next: NextFunction) => {
	//console.log(req.body)

	passport.authenticate("password", { session: false }, (err, user, info) => {
		if (err && err.param) {
			return res.status(400).json(err)
		} else if (err || !user) {
			//console.log("err", err, user)
			return res.status(401).end("An error occurred")
		}

		// @ts-ignore
		req.logIn(user, { session: false }, (err) => {
			//console.log("reach", err)

			if (err)
				return res.status(401).end({
					message: "Unauthorized",
					error: err ? err.message : "No user found",
				})
			next()
		})
	})(req, res, next)
}


const jwtOptions = {
	secretOrKey: JWT_SECRET,
	jwtFromRequest: ExtractJwt.fromExtractors([
		ExtractJwt.fromUrlQueryParameter("access_token"),
		ExtractJwt.fromBodyField("access_token"),
		ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
		(req: Request) => {
			if (req && req.cookies) {
				return req.cookies['access_token'];
			}
			return null;
		},
	]),
}

const jwtStrategy = new JwtStrategy(jwtOptions, async (payload: IJwtAuthPayload, done) => {


	const user = await User.findById(payload.id)


	if (user) {
		return done(null, user)
	} else {
		return done(null, false)
	}
})

export const generateToken = (user: IUser) => {

	const payload = { id: user._id  }
	return sign(payload, { expiresIn: "30d" })
}

export const token = ({ required = false } = {}) => {
	return (req: Request, res: Response, next: NextFunction) => {

		passport.authenticate("token", { session: false }, (err: boolean, user: IUser, info: any) => {
			const isUnauthorized = err || !user //(required && !user)

			if (isUnauthorized) {
				console.log("Unauthorized")
				return ErrorResponse(res, UNAUTHORIZED, "Authorization Failed: You are not authorized to access this resource.")
			}
			req.user = user
			next()
		})(req, res, next)
	}
}

passport.use("token",jwtStrategy)



