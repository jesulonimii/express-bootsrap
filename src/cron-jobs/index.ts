import cron from "node-cron"


cron.schedule("0 20 * * *", async () => {
	console.log("Running cron job to do task [TASK_NAME] at:", new Date().toLocaleString())
	return
})

