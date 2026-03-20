import fs from "fs";
import {join} from "node:path";
import {v4 as uuidv4} from "uuid";

function deleteFile(name) {
  if (!name)
    return;
  if (!fs.existsSync(join(process.env.IMAGES_PATH, name)))
    return;
  fs.unlink(join(process.env.IMAGES_PATH, name), (err) => {
    if (err) {
      console.log(err)
    }
  });
}

//id - string, file { data: blob }
function createFile(id, file) {
  fs.writeFile(join(process.env.IMAGES_PATH, id), file.data, (err) => {
    if (err) {
      console.log(err)
    }
  })
}

function changeProducts(products) {
  fs.writeFileSync(process.env.PRODUCTS_PATH, JSON.stringify({ products }))
}

function getJsonProducts() {
  return JSON.parse(fs.readFileSync(process.env.PRODUCTS_PATH, { encoding: "utf-8" })).products
}

class Controller {
  async createProduct(req, res) {
    const { title, price, description } = req.body
    const products = getJsonProducts()
    const newProduct = {
      id: Date.now(),
      title,
      price: Number(price) || 0,
      description
    }
    if (req.files && req.files.image) {
      const id = uuidv4().toString();
      createFile(id, req.files.image)
      newProduct.image = id;
    } else {
      newProduct.image = null
    }
    products.push(newProduct)
    changeProducts(products)
    res.json(newProduct)
  }

  async getProducts(req, res) {
    // парсим json чтобы не было двойной сериализации
    const products = getJsonProducts()
    res.json({ products })
  }

  async updateProduct(req, res) {
    const { id, title, price, description } = req.body
    let products = getJsonProducts()
    let currentProduct
    products = products.map(product => {
      if (product.id === +id) {
        if (req.files && req.files.image) {
          if (product.image) {
            deleteFile(product.image)
          }
          const id = uuidv4().toString();
          createFile(id, req.files.image)
          product.image = id;
        }
        product.title = title
        product.price = Number(price) || 0
        product.description = description
        currentProduct = JSON.parse(JSON.stringify(product))
      }
      return product
    })
    changeProducts(products)
    res.json(currentProduct)
  }

  async deleteProduct(req, res) {
    const id = req.params.id
    let products = getJsonProducts()
    const currentProduct = products.find(product => product.id === +id)
    if (currentProduct) {
      deleteFile(currentProduct.image)
      products = products.filter(product => product.id !== +id)
      changeProducts(products)
    }
    res.json(true)
  }
}

export default Controller;