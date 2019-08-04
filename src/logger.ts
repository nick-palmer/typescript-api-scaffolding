import fse from "fs-extra";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { config } from "./conf/environment";
import logStream from "./log-rotate";

const logDir = (config != null) && (config.log != null) && (config.log.directory != null) ?
    config.log.directory : "logs/";
const logLevel = (config != null) && (config.log != null) && (config.log.level != null) ? config.log.level : "debug";
const appName = (config != null) && (config.app != null) && (config.app.name != null) ? config.app.name : "app";

// Create the directory if it does not already exist
fse.ensureDir(logDir, (err) => {
    if (err) { throw err; }
    logger.info(`Logging to ${logDir}`);
});

// Define the log levels and other logger configs
const logConfig = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        verbose: 3,
        debug: 4,
        silly: 5
    }
};

// Define the log line format
const lineFormat = winston.format.printf( ({timestamp, level, message, meta }) => {
    return `${timestamp}\t[${level.toUpperCase()}]\t${(message ? message : ``)}` +
        `${(meta && Object.keys(meta).length ? `\n\t` + JSON.stringify(meta) : ``)}`;
});

// Define the log timestamp format
const timestampFormat = winston.format.timestamp({format: "YYYY/MM/DD-HH:mm:ss.SSS"});

// Define the format of the log messages
const logFormat = winston.format.combine(
    timestampFormat,
    lineFormat
);

// Define the logger with the transports
const logger = winston.createLogger({
    level: logLevel,
    levels: logConfig.levels,
    transports: [

        new winston.transports.Console({
            handleExceptions: true,
            format: logFormat
        }),
        new DailyRotateFile({
            handleExceptions: true,
            format: logFormat,
            dirname: logDir,
            stream: logStream(),
        }),
        new DailyRotateFile({
            level: "error",
            handleExceptions: true,
            format: logFormat,
            dirname: logDir,
            stream: logStream("error"),
        }),
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: logDir + appName + "-exceptions.log",
            format: logFormat
        })
    ]
});

export = logger;
