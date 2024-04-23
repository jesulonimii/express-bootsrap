import path from "path"
import { merge } from "lodash"
import { requireProcessEnv } from "#utils"
import dotenv from "dotenv"


dotenv.config({
    path: path.join(__dirname, '../../.env'),
});

const config = {
    all: {
        env: process.env.NODE_ENV || 'development',
        root: path.join(__dirname, '..'),
        port: process.env.PORT || 3800,
        ip: process.env.IP || '0.0.0.0',
        defaultEmail: 'no-reply@example.com',
        masterKey: requireProcessEnv('MASTER_KEY'),
        JWT_SECRET: requireProcessEnv('JWT_SECRET'),
        MONGO_DB: {
            options: {
                debug: true,
                useUnifiedTopology: true,
                useNewUrlParser: true,
                useCreateIndex: true,
            },
        },
    },
    development: {
        YOUVERIFY_API_KEY: requireProcessEnv("DEV_YOUVERIFY_API_KEY"),
        YOUVERIFY_API_URL: requireProcessEnv("DEV_YOUVERIFY_API_URL"),
        MONGO_DB: {
            uri: requireProcessEnv('DEV_MONGODB_URI'),
            options: {
                debug: true,
                useUnifiedTopology: true,
                useNewUrlParser: true,
                useCreateIndex: true,
            },
        },
    },
    staging: {
        YOUVERIFY_API_KEY: requireProcessEnv("YOUVERIFY_API_KEY"),
        YOUVERIFY_API_URL: requireProcessEnv("YOUVERIFY_API_URL"),
        MONGO_DB: {
            uri: requireProcessEnv('STAGING_MONGODB_URI'),
            options: {
                debug: true,
                useUnifiedTopology: true,
                useNewUrlParser: true,
                useCreateIndex: true,
            },
        },
    },
    production: {
        YOUVERIFY_API_KEY: requireProcessEnv("YOUVERIFY_API_KEY"),
        YOUVERIFY_API_URL: requireProcessEnv("YOUVERIFY_API_URL"),
        MONGO_DB: {
            uri: requireProcessEnv('MONGODB_URI'),
            options: {
                debug: true,
                useUnifiedTopology: true,
                useNewUrlParser: true,
                useCreateIndex: true,
            },
        },
    },
};

const config_merge = merge(config.all, config[config.all.env])


module.exports  = config_merge ;

const {
    env,
    port,
    ip,
    JWT_SECRET,
    MONGO_DB,
    YOUVERIFY_API_KEY,
    YOUVERIFY_API_URL,
} : IConfig = config_merge;

export {
    env,
    port,
    ip,
    JWT_SECRET,
    MONGO_DB,
    YOUVERIFY_API_KEY,
    YOUVERIFY_API_URL,
}





export default config_merge ;






