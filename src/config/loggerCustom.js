import winston from "winston";
import config from "./db/env.config.js";

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: "red",
        error: "orange",
        warn: "yellow",
        info: "blue",
        http: "red",
        debug: "white",
    },
};

const prodLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
        new winston.transports.File({
            filename: "./errors.log",
            level: "error",
            format: winston.format.simple(),
        }),
    ],
});

const devLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({ level: "debug" }),
        new winston.transports.File({ filename: "./errors.log", level: "error" }),
    ],
});

export const addLogger = (req, res, next) => {
    if (config.environment === "production") {
        req.logger = prodLogger;
    } else {
        req.logger = devLogger;
    }

    // Usar métodos de registro correctos
    req.logger.warn(
        `${req.method} en ${req.url
        } - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`
    );
    req.logger.http(
        `${req.method} en ${req.url
        } - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`
    );
    req.logger.error(
        `${req.method} en ${req.url
        } - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`
    );

    next();
};