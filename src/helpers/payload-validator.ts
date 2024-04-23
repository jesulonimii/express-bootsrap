import Joi from "joi"

interface ISchema {
	[key: string]: Joi.Schema
}

const ValidatePayload = (payload: object, schema: ISchema, allowUnknown: boolean = false) => {

	const ValidSchema = Joi.object(schema).unknown(allowUnknown)

	const { error } = ValidSchema.validate(payload)
	if (error) {
		return {
			error: true,
			message: error.message,
		}
	}
	else {
		return {
			error: false,
			message: "Payload is valid",
		}
	}


}

export default ValidatePayload
