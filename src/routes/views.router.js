import { Router } from 'express';
import { productsModel } from '../dao/models/products.models.js'
import ProductManager from '../dao/Dao/ProductManager.js';
import mongoosePaginate from 'mongoose-paginate-v2';

const router = Router();
const productManager = new ProductManager();

// Show all products
router.get(`/`, async (req, res) => {
  const products = await productManager.getProducts();
  res.render('home', { products: products });
});

// Show all products in realTime
router.get(`/realtimeproducts/`, async (req, res) => {
  res.render('realTimeProducts');
});

// get the products
router.get("/products", async (req, res) => {
  try {
    let { category, limit, page, sort } = req.query;
    let resultProducts = {};

    let prod = await productsModel.paginate({}, { limit: (limit ? limit : 10), page: (page ? page : 2), sort: (sort ? sort : { price: 1 }) })

    resultProducts = {
      status: "succcess",
      payload: prod.docs,
      totalPages: prod.totalPages,
      prevPage: prod.prevPage,
      nextPage: prod.nextPage,
      page: prod.page,
      hasPrevPage: prod.hasPrevPage,
      hasNextPage: prod.hasNextPage,
      prevLink: prod.hasPrevPage != false ? `http://localhost:8080/api/views/products?limit=${(limit ? limit : 10)}&page=${parseInt((page ? page : 1)) - 1}&sort=${(sort ? sort : { price: 1 })}` : null,
      nextLink: prod.hasNextPage != false ? `http://localhost:8080/api/views/products?limit=${(limit ? limit : 10)}&page=${parseInt((page ? page : 1)) + 1}&sort=${(sort ? sort : { price: 1 })}` : null,
    }
    res.render('products', {resultProducts: resultProducts});
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: "Error al consultar los productos", message: error });
  }
});

export default router;