import jwt from "jsonwebtoken";
import { JWT_SECRET } from "#config";

const sign = (data, options = {}) => jwt.sign({...data}, JWT_SECRET, options);
const verify = (token) => jwt.verify(token, JWT_SECRET);

export {
	sign,
	verify
};

export default jwt
