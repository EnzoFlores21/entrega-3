import dotenv from "dotenv";
import { Command } from "commander";

const program = new Command();

program
    .option("-d", "Variable para debug", false)
    .option("-p <port>", "Puerto del servidor", 8080)
    .option("--mode <mode>", "Modo de trabajo", "develop");
program.parse();

console.log("Mode Option: ", program.opts().mode);

const environment = program.opts().mode;

dotenv.config({
    path:
        environment === "production"
            ? "./src/config/.env.production"
            : "./src/config/.env.developer",
});

export default {
    mongoUrl: process.env.MONGODB_URI,
    port: process.env.PORT,
    privateKey: process.env.PRIVATE_KEY,
    gmailAccount: process.env.GMAIL_ACCOUNT,
    gmailAppPassword: process.env.GMAIL_APP_PASSWD,
};