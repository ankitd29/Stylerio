import express from 'express';
import Product from '../models/productModel.js';

const productRouter = express.Router();

productRouter.get('/', async(req,res) => {
    const products = await Product.find();
    res.send(products);
});

productRouter.get("/slug/:slug", async(req, res) => {
	const product = await Product.findOne({slug : req.params.slug});
	if (product) {
		res.send(product);
	} else {
		res
			.status(404)
			.send({ message: "Oops! we dont have what you are looking for" });
	}
});

productRouter.get("/:id", async (req, res) => {
	const product =await Product.findById(req.params.id);
	if (product) {
		res.send(product);
	} else {
		res
			.status(404)
			.send({ message: "Oops! we dont have what you are looking for" });
	}
});

productRouter.delete("/:id", async (req, res) => {
	try {
	  const deletedProduct = await Product.findByIdAndRemove(req.params.id);
	  if (deletedProduct) {
		res.send({ message: "Product deleted successfully" });
	  } else {
		res.status(404).send({ message: "Product not found" });
	  }
	} catch (error) {
	  res.status(500).send({ message: "Internal server error" });
	}
  });

productRouter.put("/:id", async (req, res) => {
	try {
	  const productId = req.params.id;
	  const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, { new: true });
  
	  if (updatedProduct) {
		res.send(updatedProduct);
	  } else {
		res.status(404).send({ message: "Product not found" });
	  }
	} catch (error) {
	  res.status(500).send({ message: "Internal server error" });
	}
  });

export default productRouter;