import crypto from "crypto"
import bcrypt from "bcrypt"
import mongoose, { Schema } from "mongoose"
import { env } from "#config"
import { makeId } from "#utils"

const roles = ["user", "admin", "merchant"]


const userSchema = new Schema<IUser>(
	{
		email: {
			type: String,
			required: false,
			unique: false,
			default: undefined,
			match: /^\S+@\S+\.\S+$/,
			trim: true,
			lowercase: true,
		},
		phone: {
			type: String,
			unique: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 4,
		},
		name: {
			type: String,
			index: true,
			trim: true,
		},
		first_name: {
			type: String,
			index: true,
			trim: true,
		},
		middle_name: {
			type: String,
			index: true,
			trim: true,
		},
		last_name: {
			type: String,
			index: true,
			trim: true,
		},
		picture: {
			type: String,
			trim: true,
		},
		nin: {
			type: String,
			trim: true,
		},
		address: {
			type: String,
			trim: true,
		},
		date_of_birth: {
			type: String,
			trim: true,
		},
	},
	{
		timestamps: true,
	},
)

userSchema.path("email").set(function(email) {
	if (!this.picture || this.picture?.length < 1 || this.picture.indexOf("https://gravatar.com") === 0) {
		const hash = crypto.createHash("md5").update(email).digest("hex")
		this.picture = `https://gravatar.com/avatar/${hash}?d=https%3A%2F%2Fui-avatars.com%2Fapi%2F/${this.name ? this.name.replaceAll(" ", "+") : email.split("@")[0]}/128`
	}

	if (!this.name) {
		this.name = email.replace(/^(.+)@.+$/, "$1")
	}

	return email
})

userSchema.pre("save", function(next) {
	if (!this.isModified("password")) return next()

	/* istanbul ignore next */
	const rounds = env === "development" ? 1 : 9

	bcrypt
		.hash(this.password, rounds)
		.then((hash) => {
			// @ts-ignore
			this.password = hash
			next()
		})
		.catch(next)
})

userSchema.methods.view = async function(populate) {

	let data = this

	if (populate) {
		data = await this.populate({
			path: "referrals",
			select: {
				name: 1,
				phone: 1,
				picture: 1,
				createdAt: 1,
				email: 1,
			},
		}).execPopulate()
	}


	const { password, _id, __v, ...rest } = data.toObject()


	return { id: data?._id, ...rest }
}

userSchema.methods.authenticate = async function(password) {
	const valid = await bcrypt.compare(password, this.password)
	return (valid ? this : false)
}



const User = mongoose.model<IUser>("User", userSchema)
export default User
