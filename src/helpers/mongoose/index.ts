import mongoose from "mongoose"
import { MONGO_DB } from "#config"

import { spawn } from "child_process"
import path from "path"


Object.keys(MONGO_DB.options || {}).forEach((key: any) => {
	mongoose.set(key, MONGO_DB.options[key])
})

mongoose.set("useFindAndModify", false)


mongoose.connection.on("error", (err) => {
	console.error("MongoDB connection error: " + err)
	process.exit(-1)
})

/*
// ====== Change Stream setup Begin=========

const userDataCollectionPath = (env === "production") ? "userData" : (env === "staging") ? "userData_staging" : "userData_dev"

const compileData = (user: IUser) => {
	const {
		phone,
		_id,
	} = user

	return {
		phone: phone ?? "",
		id: _id.toString(),
	}

}

User.watch().on("change", async (data) => {
	const fireStoreDB = getFirestore()
	const { operationType } = data


	if (operationType === "insert") {
		await fireStoreDB.collection(userDataCollectionPath).doc(compileData(data?.fullDocument)?.phone).set(compileData(data?.fullDocument))
			.then(doNothing)
			.catch((err) => console.error("Change Stream Error 0x1: ", err))
	}

	if (operationType === "update") {
		const userID = data.documentKey?._id

		if (!userID || userID.toString().length == 0) {
			console.error("ChangeStream::: user ID is empty")
			return
		}

		const user = await User.findById(userID, ["-password"]).lean()

		await fireStoreDB.collection(userDataCollectionPath).doc(compileData(user)?.phone).set(compileData(user)).then(doNothing).catch((err) => {
			console.error("Change Stream Error", err)
		})

	}

	if (operationType === "delete") {
		console.log("Delete operation", data.documentKey._id)
		const id = data.documentKey._id

		await fireStoreDB.collection(userDataCollectionPath).where("id", "==", id.toString()).get()
			.then((snapshot) => {
				if (snapshot.empty) {
					console.error("Change Stream Error 0x3: Document not found")
					return
				}

				snapshot.forEach(doc => {
					doc.ref.delete()
				})
			})
			.catch((err) => {
				console.error("Change Stream Error 0x4: ", err)
			})
	}
})

// ====== Change Stream setup End=========
*/


export default mongoose

export const backupDB = async () => {
	const fileName = path.resolve(`${__dirname}/../../../db/backups/db-backup-${new Date().toISOString()}.gzip`)

	const backupProcess = spawn("mongodump", [
		`--db=AppName`,
		`--uri=${MONGO_DB.uri}`,
		`--archive=${fileName}`,
		"--gzip",
	])

	backupProcess.stdout.pipe(process.stdout)
	backupProcess.stderr.pipe(process.stderr)

	backupProcess.on("exit", async (code) => {
		if (code !== 0) {
			console.log(`Backup process exited with code ${code}`)
			return
		}

		console.log("Backup process exited with code 0")
	})
}
