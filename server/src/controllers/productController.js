const Product = require('../models/Product');
const Category = require('../models/Category');

/**
 * @desc    Fetch all products with optional category filter and keyword search
 * @route   GET /api/products?category=electronics&search=phone
 * @access  Public
 */
const getProducts = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = {};

    // 1. Search by keyword across name or description
    if (search && search.trim() !== '') {
      const keyword = search.trim();
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    // 2. Filter by category (by category ObjectId or category name)
    if (category && category !== 'All' && category !== 'all') {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        // Is ObjectId
        query.category = category;
      } else {
        // Find category by name
        const foundCategory = await Category.findOne({
          name: { $regex: new RegExp(`^${category}$`, 'i') }
        });
        if (foundCategory) {
          query.category = foundCategory._id;
        } else {
          // No products match non-existent category
          return res.status(200).json({
            success: true,
            count: 0,
            data: []
          });
        }
      }
    }

    const products = await Product.find(query)
      .populate('category', 'name description')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Fetch single product details by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'category',
      'name description'
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, image, category, stock } = req.body;

    if (!name || !description || price === undefined || !image || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required product fields'
      });
    }

    if (Number(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Product price must be a positive number'
      });
    }

    if (Number(stock) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Product stock cannot be negative'
      });
    }

    // Verify category exists
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(400).json({
        success: false,
        message: 'Specified category does not exist'
      });
    }

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      image: image.trim(),
      category,
      stock: Number(stock) || 0
    });

    const populatedProduct = await product.populate('category', 'name');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: populatedProduct
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, image, category, stock } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (name) product.name = name.trim();
    if (description) product.description = description.trim();
    if (price !== undefined) {
      if (Number(price) <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Price must be greater than zero'
        });
      }
      product.price = Number(price);
    }
    if (image) product.image = image.trim();
    if (category) {
      const categoryDoc = await Category.findById(category);
      if (!categoryDoc) {
        return res.status(400).json({
          success: false,
          message: 'Specified category does not exist'
        });
      }
      product.category = category;
    }
    if (stock !== undefined) {
      if (Number(stock) < 0) {
        return res.status(400).json({
          success: false,
          message: 'Stock cannot be negative'
        });
      }
      product.stock = Number(stock);
    }

    const updatedProduct = await product.save();
    const populated = await updatedProduct.populate('category', 'name');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
