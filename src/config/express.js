import express, { urlencoded } from "express";
/* Routes */
import productRouter from "../routes/productsRouter.js";
import cartRouter from "../routes/cartRouter.js";
/* Routes */

/* env */
import "../utils/dotenvConfig.js"
/* env */
/* mongo */
import "../database/mongoConfig.js"
/* mongo */
/* handlebars */
import handlebarsRouter from "../utils/handlebarsConfig.js";
import { engine } from 'express-handlebars';
import Handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
/* handlebars */
/* path */
import path from 'path';
import { fileURLToPath } from 'url';
/* path */

/* socketIo */
import { createServer } from 'http';
import { startIo, getIo } from './socketIo.js';
/* socketIo */

/* path */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/* path */

const app = express();
const server = createServer(app);
/* io */
startIo(server);
/* io */
/* handlebars */
app.engine('handlebars', engine({
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'handlebars');
app.set("views", path.resolve(__dirname, "../views"));
/* handlebars */
app.use(express.json());
app.use(urlencoded({ extended: true }));
productRouter.use(express.json());

/* env */
const port = process.env.PORT
/* env */

/* products */
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", handlebarsRouter);
/* products */

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});