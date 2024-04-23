//import admin from "firebase-admin"


export const USER_TOPICS = {
	ALL_USERS: "all_users",
	ALL_ADMINS: "all_admins",
	ALL_MERCHANTS: "all_merchants",
	ALL_CUSTOMERS: "all_customers",
} as const


type Notification = {
	title: string
	body: string
	image?: string
}

const admin = {
	messaging: ()=> {
		return {
			send: async (data: any)=>{
				return console.log("Firebase needs to be installed and configured")
			},
			subscribeToTopic: async (data: any, token: any)=>{
				return console.log("Firebase needs to be installed and configured")
			}
		}
	}
}

type Exclusive<T, U> = (T extends U ? never : T) | (U extends T ? never : U);

type PushNotificationMessage = {
	notification: Notification;
} & Exclusive<{ topic: string }, { token: string }>;


const pushNotification = (message: PushNotificationMessage) => {
	try {
		admin.messaging().send(message)
			.then((response) => {

				console.log(`Successfully sent push notification to ${message["topic"] ?? message["token"]}`)
			})
			.catch((error) => {
				console.log(`Error sending push notification: ${message["topic"] ?? message["token"]}`, error)
			})
	} catch (error) {
		console.error(`Caught error while sending push notification: ${message["topic"] ?? message["token"]}`, error)
	}
}


const sendPushNotificationsToTopic = (notification: Notification, topic: typeof USER_TOPICS[keyof typeof USER_TOPICS]) => {

	const message = {
		notification: notification,
		topic: topic,
	}

	pushNotification(message)
}

export const sendPushNotificationsToDevice = (notification: Notification, token: string) => {

	const message = {
		notification: notification,
		token: token,
	}

	pushNotification(message)

}

export const sendPushNotificationsToAllUsers = (notification: Notification) => {
	sendPushNotificationsToTopic(notification, USER_TOPICS.ALL_USERS)
}

export const sendPushNotificationsToAllMerchants = (notification: Notification) => {
	sendPushNotificationsToTopic(notification, USER_TOPICS.ALL_MERCHANTS)
}

export const sendPushNotificationsToAllCustomers = (notification: Notification) => {
	sendPushNotificationsToTopic(notification, USER_TOPICS.ALL_CUSTOMERS)
}


export const fcmSubscribeToTopic = (topic: typeof USER_TOPICS[keyof typeof USER_TOPICS], registrationToken: string | string[]) => {

	admin.messaging().subscribeToTopic(registrationToken, topic)
		.then((response) => {
			console.log("Successfully subscribed to topic: ", topic, response)
		})
		.catch((error) => {
			console.log("Error subscribing to topic: ", topic, error)
		})
}

