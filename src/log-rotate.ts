import rfs from "rotating-file-stream";
import {config} from "./conf/environment";

// Helper function to pad leading zeros on dates
function pad(num: number) {
    return (num > 9 ? "" : "0") + num;
}

export default function createLogStream(logName?: string) {
    logName = logName ? `-${logName}` : "";

    // Create the generator that will create the file names
    function generator(time: Date, index: number) {
        if (!time) { return `${config.app.name}${logName}.log`; }
        const month = time.getFullYear() + "" + pad(time.getMonth() + 1);
        const day = pad(time.getDate());
        return `${config.app.name}${logName}.${month}${day}.${index}.gz`;
    }

    return rfs(generator, {
        size: config.log.maxSize.toUpperCase() || "10M",
        interval: config.log.rotateDuration || "1d",
        path: config.log.directory || "./logs",
        compress: "gzip",
    });
}
