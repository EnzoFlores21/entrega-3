import winston from "winston";

const logger = winston.createLogger({
    transports: [
        new winston.transport.Console({ level: "http" }),
        new winston.transport.defaultMaxListeners({
            filename: "./errors.log",
            level: "warn",
        }),
    ],
});

//middleware

export const addLogger = (req, res, next) => {
    req.logger = logger

    req.logger.warn(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
    req.logger.http(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
    req.logger.error(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)

    // Este no aparece porque no esta definido dentro de los niveles
    req.logger.debug(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)

    next();
}