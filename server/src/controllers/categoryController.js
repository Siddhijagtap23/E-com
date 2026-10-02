import Category from '../models/Category.js';

export const getCategories = async (req, res) => {
  const categories = await Category.find({}).sort({ createdAt: -1 });
  res.json({ success: true, count: categories.length, data: categories });
};

export const createCategory = async (req, res) => {
  const { name, description } = req.body;
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ success: false, message: 'Category name must be at least 2 characters' });
  }
  const exists = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
  if (exists) {
    return res.status(400).json({ success: false, message: 'Category with this name already exists' });
  }

  const category = await Category.create({ name: name.trim(), description: description || '' });
  res.status(201).json({ success: true, message: 'Category created successfully', data: category });
};

export const updateCategory = async (req, res) => {
  const { name, description } = req.body;
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  if (name) category.name = name.trim();
  if (description !== undefined) category.description = description;

  const updated = await category.save();
  res.json({ success: true, message: 'Category updated successfully', data: updated });
};

export const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }
  await category.deleteOne();
  res.json({ success: true, message: 'Category deleted successfully' });
};
