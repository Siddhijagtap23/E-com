import Product from '../models/Product.js';
import Category from '../models/Category.js';

export const getProducts = async (req, res) => {
  const { category, search } = req.query;
  const filter = {};

  if (category) {
    if (category.match(/^[0-9a-fA-F]{24}$/)) {
      filter.category = category;
    } else {
      const catDoc = await Category.findOne({ name: { $regex: new RegExp(`^${category}$`, 'i') } });
      if (catDoc) filter.category = catDoc._id;
      else filter.category = null; // No match
    }
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const products = await Product.find(filter).populate('category', 'name').sort({ createdAt: -1 });
  res.json({ success: true, count: products.length, data: products });
};

export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name');
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, data: product });
};

export const createProduct = async (req, res) => {
  const { name, description, price, image, category, stock } = req.body;
  if (!name || !description || price === undefined || !image || !category || stock === undefined) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const product = await Product.create({
    name,
    description,
    price: Number(price),
    image,
    category,
    stock: Number(stock)
  });

  res.status(201).json({ success: true, message: 'Product created successfully', data: product });
};

export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const { name, description, price, image, category, stock } = req.body;
  if (name !== undefined) product.name = name;
  if (description !== undefined) product.description = description;
  if (price !== undefined) product.price = Number(price);
  if (image !== undefined) product.image = image;
  if (category !== undefined) product.category = category;
  if (stock !== undefined) product.stock = Number(stock);

  const updated = await product.save();
  res.json({ success: true, message: 'Product updated successfully', data: updated });
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted successfully' });
};
