import express from 'express';
import Container from "../mongoContainer.js";
import product from "../models/product.js"
import logger from "../helpers/pino.js"

const { Router } = express;

const mongo = new Container(product)
const router = new Router();

router.get('/', async (req, res) => {
  logger.info("GET /api/productos")
  const data = await mongo.findAll();
  res.json(data);
});

router.post('/', async (req, res) => {
  logger.info("POST /api/productos")
  try {
    await mongo.create(req.body);
    res.status(200).json({success: 'ok'});
  } catch (error) {
    logger.error(error);
    res.status(500).json({error: 'cannot insert into db'});
  }
});

export default router;