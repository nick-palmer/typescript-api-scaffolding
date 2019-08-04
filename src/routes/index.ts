import * as express from "express";
import { config } from "../conf/environment";
import logger from "../logger";
const router = express.Router();

router.get("/", (req, res, next) => {
  logger.info("Got the index request");
  res.send({
    appName: config.app.name,
    version: config.app.version,
    time: Date()
  });
});

router.get("/:value", (req, res, next) => {
  logger.info(`Got the ${req.params.value} request`);
  res.send({
    appName: config.app.name,
    version: config.app.version,
    time: Date(),
    value: req.params.value
  });
});

export = router;
