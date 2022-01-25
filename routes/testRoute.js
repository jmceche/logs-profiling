import express from 'express';
import { Contenedor } from "../contenedor.js";
import mysqlOpt from "../options/mysql.js"
import logger from "../helpers/pino.js";

import productFaker from "../helpers/faker.js"

const { Router } = express;

const mysql = new Contenedor(mysqlOpt, 'products')
const router = new Router();

router.get('/', async (req, res) => {
  logger.info("GET /api/productos")
  res.json(productFaker());
});


export default router;