import express from 'express';
import { fork } from "child_process";

const { Router } = express;

const router = new Router();

router.get('/', async (req, res) => {
  let calc = fork("./helpers/randoms.js", [req.query?.cant]);
  calc.on("message", (msg) => { 
    if (msg === "READY") {
      calc.send("START");
    } else {
      res.json({ msg });
    }
  });
});

export default router;