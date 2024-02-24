import path from "path";
import Products from "../model/products.js"; // Assuming your model is named 'Product', not 'products'

export const productsController = {
    createProduct: async (req, res) => {
        const { title, artisanId } = req.body;
        const image = req.file.path;

        try {
            const product = await Products.create({ title, image, artisanId });
            return res.status(201).json(product); // 201 status for successful creation
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getProductsByArtistId : async (artistId) => {
        try {
          // Find all products with the given artistId
          const products = await Products.find({ artisanId: artistId }).select("title image");
      
          return products;
        } catch (error) {
          console.error("Error fetching products by artist ID:", error);
          throw error;
        }
      },
    getProductById: async (req, res) => {
        const { id } = req.params;
        try {
            const product = await products.findById(id).populate('artisanId');
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
            const foundProducts = await Products.find().populate('artisanId');
            return res.status(200).json(foundProducts);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    deleteProduct: async (req, res) => {
        const { id } = req.params;
        try {
            const deletedProduct = await Products.findByIdAndDelete(id);
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

    getProductsByArtisanId: async (req, res) => {
        const { artisanId } = req.params; // Assuming artisanId is passed as a parameter in the request URL

        try {
            // Find all products with the given artisanId
            const products = await Products.find({ artisanId }).select("title image");

            // Check if any products were found
            if (products.length === 0) {
                return res.status(404).json({ message: "No products found for the specified artisan ID" });
            }

            // Return the products with titles and images
            return res.status(200).json(products);
        } catch (error) {
            console.error("Error fetching products by artisan ID:", error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    
};
