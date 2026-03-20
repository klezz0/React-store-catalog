import express from "express";
import fileUpload from "express-fileupload";
import routesRouter from "./database/router.js";
import {join} from "node:path";
import fs from "fs";

process.env.IMAGES_DIR = "images";
process.env.IMAGES_PATH = join(process.cwd(), process.env.IMAGES_DIR);
process.env.PRODUCTS_PATH = join(process.cwd(), "database/products.json");


fs.mkdir(process.env.IMAGES_PATH, { recursive: true }, (err) => {
  if (err) {
    return console.error(`Error creating directory: ${err}`);
  }
  console.log('Directory created successfully!');
});

const PORT = 3030
const api = express()

api.use("/api/images", express.static(process.env.IMAGES_PATH))
api.use(fileUpload({
  createParentPath: true
}));

api.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  next();
});

api.use(express.json())
api.use("/api", routesRouter)

api.listen(PORT, ()=> console.log(`server started on port ${PORT}`))