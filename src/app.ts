import http from "http"
import mongoose from "#helpers/mongoose"
import express from "#helpers/express"
import { env, ip, MONGO_DB, port } from "#config"
import routes from "#src/api/v1/routes"
import "#src/cron-jobs"

const server = http.createServer({}, express(routes))

if (MONGO_DB.uri) {
    mongoose.connect(MONGO_DB.uri).then(()=>console.log("Database connected"))
}

server.listen(port, ip, () => console.log(`Server listening on http://${ip}:${port} in ${env} mode`))
