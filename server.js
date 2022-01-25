import dotenv from "dotenv";
import express from 'express';
import handlebars from "express-handlebars";
import axios from 'axios';
import yargs from 'yargs';

import { Server as HttpServer } from 'http';
import { Server as IOServer } from 'socket.io';

dotenv.config()

import router from "./routes/index.js";
import testRouter from "./routes/testRoute.js";
import authRoute from "./routes/authRoute.js";
import randomRouter from "./routes/randomRoute.js";

import message from "./models/message.js"
import { normalizeChat, print } from './helpers/normalize.js';

import mongoConnect from './db/mongodb.js';
import mongoContainer from './mongoContainer.js';

import { useMiddlewares } from './middlewares/useMiddlewares.js';
import cluster from 'cluster';
import { cpus } from "os"

const numCPUs = cpus().length
const args = yargs(process.argv.slice(2)).argv;
const port = args.port || 8080;
// knex sqlite connection
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer)

const mongo = new mongoContainer(message);

// Set template engine
app.engine('hbs', handlebars({
  extname: '.hbs',
  defaultLayout: 'index.hbs',
  layoutsDir: "./views/layouts",
}))
app.set("view engine", "hbs")
app.set("views", "./views")


useMiddlewares(app)
// routes
app.use("/api/productos", router);
app.use("/api/productos-test", testRouter)
app.use("/api/randoms", randomRouter)
app.use("/", authRoute)

app.get("/", async (req, res) => {
  try {
    const products = await axios.get(`http://localhost:${port}/api/productos`);
    console.log(req.user)
    res.render("main", { products: products.data, user: req.user.username });
  } catch (error) {
    console.log(error);
  }
})

app.get("/info", (req, res) => {
  const data = {
    argv: process.argv,
    os: process.platform,
    node: process.version,
    rss: process.memoryUsage.rss(),
    path: process.execPath,
    pid: process.pid,
    folder: process.cwd(),
    cpus: numCPUs,
  }
  res.render("info", {data});
});

// sockets
io.on('connection', async socket => {
  io.sockets.emit('render_messages', await norm().catch(err => console.log(err)));
  socket.on('submit_product', data => {
    axios.post('http://localhost:3000/api/productos', data)
    .then(resp => console.log(resp.data))
    .catch(err => console.error(err.response.data))
  });
  
  socket.on('send_message', async data => {
    await mongo.create(data);
    io.sockets.emit('render_messages', await mongo.findAll());
  });
});

if (args.mode === "cluster" && cluster.isMaster) {
  console.log(`CLUSTER - Master ${process.pid} is running`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {  
  httpServer.listen(port, () => {
    console.log(`FORK - Server running on port ${port}`);
    console.log(`Worker ${process.pid} started`);
  })
}

// connect to mongodb atlas
mongoConnect()


const norm = async () => {
  const mongoData = await mongo.findAll();
  const formattedData = {id: "mensajes", mensajes: mongoData}
  const chat = normalizeChat(JSON.stringify(formattedData));
  return chat;
}
