import { Router } from "express"
import { GetUsers } from "#src/api/v1/user/user.controller"

const router = Router()

router.get("/", GetUsers)

export default router
