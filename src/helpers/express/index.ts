import express, { Request, Response } from "express"
import cors from "cors"
import compression from "compression"
import morgan from "morgan"
import { env } from "#config"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import { detectCompression } from "#src/middlewares"


export default (routes: any) => {
	const app = express()


	if (env === "production") {
		app.use(
			cors({
				origin: [
					"*"
				],
				methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
				credentials: true, // enable set cookie
			}),
		)

	}

	app.use(morgan("dev"))
	app.use(detectCompression)
	app.use(compression({
		level: 9,
		filter: (req: Request, res: Response) => {
			if (!req.headers['x-no-compression']) {
				return compression.filter(req, res);
			}
			return false; // Don't apply compression if 'x-no-compression' header is present
		},
	}));


	app.use(helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: ["'self'"],
			scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
			styleSrc: ["'self'", "'unsafe-inline'"],
			// Add other directives as needed
		}
	}));

	const limiter = rateLimit({
		windowMs: 5 * 60 * 1000, // 15 minutes
		limit: 1000, // limit each IP to 100 requests per windowMs
		validate: {xForwardedForHeader: false}
	});
	if (env !== "development") {
		app.use(limiter)
	}
	app.use(cookieParser())


	app.use(function (req, res, next) {
		if (!req.headers['content-type']) {
			req.headers['content-type'] = 'application/json'; // Set default to JSON
		}
		next();
	});
	app.use(express.json({type: ['application/json', 'application/gzip']}))
	app.use(express.urlencoded({ extended: env === "development" || env === "staging" }))

	app.use("", routes)

	return app
}
