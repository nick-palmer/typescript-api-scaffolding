import cluster from "cluster";
import cookieParser from "cookie-parser";
import express from "express";
import fs from "fs";
import createError from "http-errors";
import https from "https";
import access from "morgan";
import { cpus } from "os";
import path from "path";
import { config } from "./conf/environment";
import logStream from "./log-rotate";
import logger from "./logger";
import indexRouter from "./routes/index";

const app = express();

// Allow for clustering
const numCPUs = cpus().length;

app.use(access(config.log.format || "common",  { stream: logStream("access") }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((parameters: { err: any, req: any, res: any, next: any }) => {
  const {err, req, res, next} = parameters;
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// Setup master and workers for the cluster
if (cluster.isMaster) {
  // ASCII art generated here: http://patorjk.com/software/taag/
  logger.info("Stating up...\n\n" +
  "$$$$$$$$\\  $$$$$$\\          $$$$$$\\  $$$$$$$\\ $$$$$$\\\n" +
  "\\__$$  __|$$  __$$\\        $$  __$$\\ $$  __$$\\\\_$$  _|\n" +
  "   $$ |   $$ /  \\__|       $$ /  $$ |$$ |  $$ | $$ |  \n" +
  "   $$ |   \\$$$$$$\\ $$$$$$\\ $$$$$$$$ |$$$$$$$  | $$ |  \n" +
  "   $$ |    \\____$$\\\\______|$$  __$$ |$$  ____/  $$ |  \n" +
  "   $$ |   $$\\   $$ |       $$ |  $$ |$$ |       $$ |  \n" +
  "   $$ |   \\$$$$$$  |       $$ |  $$ |$$ |     $$$$$$\\ \n" +
  "   \\__|    \\______/        \\__|  \\__|\\__|     \\______|\n");
  logger.info(`CPU count: ${numCPUs}, starting workers...`);
  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // If a worker dies, log it to the console and start another worker.
  cluster.on("exit", (worker, code, signal) => {
    logger.warn(`Worker ${worker.process.pid} died. Code: ${code}, Signal: ${signal}`);
    cluster.fork();
  });

  // Log when a worker starts listening
  cluster.on("listening", (worker, address) => {
    logger.info("Worker started with PID " + worker.process.pid + ". Address: " + JSON.stringify(address));
  });

} else {
  // Setup the cert if HTTPS is specified
  if (config.useHttps) {

    const sslOptions = {
      cert: fs.readFileSync(config.httpsCertPath || "server.crt"),
      key: fs.readFileSync(config.httpsKeyPath || "server.key")
    };

    // Server with SSL enabled
    const httpsServer = https.createServer(sslOptions, app);
    httpsServer.listen(config.httpPort || 8443);
    logger.info(`Server setup for SSL, listening on ${httpsServer.address}` );

  } else {

    // Server without SSL enabled
    const server = app.listen(config.httpPort || 8080, () => {
      logger.info(`Server listening on ${JSON.stringify(server.address())}`);
    });

  }
}

module.exports = app;
