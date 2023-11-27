import fs from "fs";

class ProductManager {
  #filePath;
  #lastId = 0;

  constructor(filePath = "./products.json") {
    this.#filePath = filePath;
    this.#setLastId();
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    //En funciones asincronas usar Try-Catch

    try {
      if (!title || !description) {
        throw new Error("Not the correct data");
      }

      const products = await this.getProducts();

      if (products.find((product) => product.title === title)) {
        throw new Error("Product already exists");
      }

      const newProduct = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        id: ++this.#lastId,
      };

      products.push(newProduct);

      await this.#saveProducts(products);
    } catch (error) {
      console.log(error);
    }
  }

  async getProducts() {
    try {
      if (fs.existsSync(this.#filePath)) {
        const products = JSON.parse(await fs.promises.readFile(this.#filePath, "utf-8"));
        return products;
      }
      return [];
    } catch (error) {
      console.log(error);
    }
  }

  async getProductsById(id) {
    try {
      const products = await this.getProducts();

      const product = products.find((product) => product.id === id);

      return product;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProductsById(id) {
    try {
      let products = await this.getProducts();
      products = products.filter((product) => product.id !== id);

      this.#saveProducts(products);
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(id, fieldToUpdate, newValue) {
    try {
      const products = await this.getProducts();

      const productIndex = products.findIndex((product) => product.id === id);

      if (productIndex < 0) {
        throw new Error(`Product with ID ${id} does not exist`);
      }
      products[productIndex][fieldToUpdate] = newValue;

      await this.#saveProducts(products);
    } catch (error) {
      console.log(error);
    }
  }

  async #setLastId() {
    try {
      const products = await this.getProducts();
      if (products.length < 1) {
        this.#lastId = 0;
        return;
      }
      this.#lastId = products[products.length - 1].id;
    } catch (error) {
      console.log(error);
    }
  }

  async #saveProducts(products) {
    try {
      await fs.promises.writeFile(this.#filePath, JSON.stringify(products));
    } catch (error) {
      console.log(error);
    }
  }
}

const productManager = new ProductManager("./products.json");

// console.log(await productManager.getProducts());

// await productManager.addProduct("zapatillas", "las zapatillas modelo SPRINT son excelentes para correr", 20000);

// console.log(productManager.getProducts());

// await productManager.addProduct("short", "short para jugar al futbol")

// console.log(productManager.getProductsById(2));

// await productManager.addProduct("short", "short para jugar al futbol", 12000);

// await productManager.deleteProductsById(2)

// console.log(await productManager.getProducts());
await productManager.updateProduct(1, "price", 35000);
console.log(await productManager.getProducts());
