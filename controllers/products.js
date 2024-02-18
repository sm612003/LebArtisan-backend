import path from "path";
import Product from "../model/products"; // Assuming your model is named 'Product', not 'products'

export const productsController = {
    createProduct: async (req, res) => {
        const { title, artisanId } = req.body;
        const image = req.file.path;

        try {
            const product = await Product.create({ title, image, artisanId });
            return res.status(201).json(product); // 201 status for successful creation
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getProductById: async (req, res) => {
        const { id } = req.params;
        try {
            const product = await Product.findById(id).populate('artisanId');
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            return res.status(200).json(product);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getProducts: async (req, res) => {
        try {
            const foundProducts = await Product.find().populate('artisanId');
            return res.status(200).json(foundProducts);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    deleteProduct: async (req, res) => {
        const { id } = req.params;
        try {
            const deletedProduct = await Product.findByIdAndDelete(id);
            if (deletedProduct) {
                return res.status(200).json({ message: 'Product deleted successfully' });
            } else {
                return res.status(404).json({ error: 'Product not found' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    editProduct: async (req, res) => {
        const { title, artisanId } = req.body;
        const image = req.file ? req.file.path : null;
        const { id } = req.params;

        try {
            const existingProduct = await Product.findById(id);
            if (!existingProduct) {
                return res.status(404).json({ error: 'Product not found' });
            }
            existingProduct.title = title;
            existingProduct.artisanId = artisanId;
            if (image) {
                existingProduct.image = image;
            }
            const updatedProduct = await existingProduct.save();
            return res.status(200).json(updatedProduct);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getByArtisanId: async (req, res) => {
        try {
            const artisanId = req.params.artisanId;
            const foundProducts = await Product.find({ artisanId }).populate('artisanId');
            if (!foundProducts || foundProducts.length === 0) {
                return res.status(404).json({ message: 'No products found for the specified artisan ID' });
            }
            return res.status(200).json(foundProducts);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};
