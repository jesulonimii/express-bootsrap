import { initiateDeployment } from "#src/deployment"
import { Router } from "express"

const router = Router()

const Routes = (path: string) => require(`./${path}`).default

router.use("/users", Routes("user"))



router.get("/", (req, res) => res.send("Welcome to server"))
router.post("/_/deploy/webhook", initiateDeployment)


export default router
