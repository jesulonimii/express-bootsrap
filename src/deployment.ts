import { Request, Response } from "express"
import { spawn } from "child_process"
import { ErrorResponse, requireProcessEnv, ValidateSecretSignature } from "#utils"
import { UNAUTHORIZED } from "#utils/status-codes"


export const initiateDeployment = async (req: Request, res: Response) => {

	const { headers, body } = req

	const secret = requireProcessEnv("BITBUCKET_WEBHOOK_SECRET")

	const signature = headers["x-hub-signature"] as string
	if (!signature) return ErrorResponse(res, UNAUTHORIZED, "UNAUTHORIZED: Please provide a valid signature")

	const validate = ValidateSecretSignature({
		payload: body,
		secret,
		signature,
	})

	if (!validate) {
		console.error("Invalid webhook signature")
		return ErrorResponse(res, UNAUTHORIZED, "UNAUTHORIZED: Please provide a valid signature")
	}

	console.log("Webhook received and verified")

	triggerDeployment()

	res.status(200).send("Webhook received successfully")


}


function triggerDeployment() {
	const deploy = spawn('sh', [`${__dirname}/../.git/hooks/post-receive`]);

	deploy.stdout.on('data', (data) => {
		console.log(`stdout: ${data}`);
	});

	deploy.stderr.on('data', (data) => {
		console.error(`stderr: ${data}`);
	});

	deploy.on('close', (code) => {
		console.log(`child process exited with code ${code}`);
	});
}
