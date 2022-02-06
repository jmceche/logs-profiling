import express from 'express';
// import { fork } from "child_process";
import logger from "../helpers/pino.js";

const { Router } = express;

const router = new Router();

router.get('/', async (req, res) => {
  logger.info("GET /api/randoms")
  // let calc = fork("./helpers/randoms.js", [req.query?.cant]);
  // calc.on("message", (msg) => { 
    if (msg === "READY") {
      calc.send("START");
    } else {
      res.json({ msg });
    }
  // });
});

export default router;