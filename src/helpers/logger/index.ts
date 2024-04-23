import { createLogger, format, transports } from 'winston'

const customFormat = format.combine(
	format.errors({ stack: true }), // Include the stack trace in the log
	format.simple(),
	format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
	format.printf(({ timestamp, message }) => {
		return `${timestamp} - ${message}`;
	})
);


const logger = createLogger({
	level: "debug",
	format: customFormat,
	transports: [
		new transports.Console(), // Log to the console
		new transports.File({ filename: 'error.log', level: 'error' }) // Log errors to a file
	]
});


console.log = (...args: any[]) => {
	logger.info(args.join(' ')); // Join arguments into a single string
};


console.error = (...args: any[]) => {
	logger.error(args.join(' ')); // Join arguments into a single string
};


export default logger
