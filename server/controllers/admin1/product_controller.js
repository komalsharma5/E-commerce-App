const { imageUploadUtil } = require("../../helpers/clodinary");
const Product = require("../../models/Product");


const handleImageUpload = async (req, res) => {
    try {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const url = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await imageUploadUtil(url);

        res.status(200).json({
            success: 'true',
            message: 'Image uploaded successfully',
            result
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'error occurred'
        })
        
    }
}

//add a new Product
const addProduct = async (req, res) => {
    try {
        const { image,
            title ,
            description ,
            category ,
            brand , 
            price ,
            salePrice ,
            totalStock} = req.body

            const newlyCreatedProduct = await Product({
                image,
                title,
                description,
                category,
                brand,
                price,
                salePrice,
                totalStock
            })
            await newlyCreatedProduct.save();
            res.status(201).json({
                success: true,
                message: 'Product added successfully',
                data: newlyCreatedProduct
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'error occurred'
        })
        
    }

}

//fetch all Product
const fetchAllProducts = async (req, res) => {
    try {
        const listOfProducts = await Product.find({});
        res.status(200).json({
            success: true,
            message: 'Product fetched successfully',
            data: listOfProducts
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'error occurred'
        })
        
    }
}

//edit a Product
const editProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const { image,
            title ,
            description ,
            category ,
            brand , 
            price ,
            salePrice ,
            totalStock} = req.body

            let findProduct = await Product.findById(id);

            if(!findProduct) return res.status(404).json({
                success: false,
                message: 'Product not found'
                })
           
            findProduct.title = title || findProduct.title; 
            findProduct.description = description || findProduct.description;
            findProduct. category =  category || findProduct. category;
            findProduct.brand = brand || findProduct.brand;
            findProduct.price = price === "" ? 0 : price || findProduct.price;
             findProduct.salePrice = salePrice === "" ? 0 : salePrice || findProduct.salePrice;
            findProduct.totalStock = totalStock || findProduct.totalStock;
            findProduct.image = image || findProduct.image;

            await findProduct.save();
            res.status(200).json({
                success: true,
                data: findProduct
            })
        }
     catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'error occurred'
        })
        
    }
}


//delete a Product
const deleteProduct = async (req, res) => {
    try {
       const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);

        if(!product){
            return res.status(404).json({
                success: false,
                message: 'Product not found'
                })
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
            data: product
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'error occurred'
        })
        
    }
}


module.exports = { handleImageUpload , addProduct, fetchAllProducts, editProduct, deleteProduct }



