require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ecom_db';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for database seeding...');

    // Clear existing collections
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    console.log('Cleared existing database records.');

    // 1. Create Users
    const adminUser = await User.create({
      name: 'Store Administrator',
      email: 'admin@ecom.com',
      password: 'Admin@123',
      role: 'admin'
    });

    const customerUser = await User.create({
      name: 'Demo Customer',
      email: 'customer@ecom.com',
      password: 'Customer@123',
      role: 'customer'
    });

    console.log('Created Admin (admin@ecom.com) and Customer (customer@ecom.com).');

    // 2. Create Categories
    const electronics = await Category.create({
      name: 'Electronics',
      description: 'Laptops, smartphones, audio devices, and consumer electronics'
    });

    const fashion = await Category.create({
      name: 'Fashion',
      description: 'Contemporary apparel, jackets, and wardrobe essentials'
    });

    const shoes = await Category.create({
      name: 'Shoes',
      description: 'Athletic sneakers, formal leather footwear, and everyday shoes'
    });

    console.log('Created Categories: Electronics, Fashion, Shoes.');

    // 3. Create Sample Products
    const products = [
      {
        name: 'Wireless Noise Cancelling Headphones',
        description: 'Premium over-ear headphones with active noise cancellation, 40-hour battery life, and crystal-clear microphone audio.',
        price: 149.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        category: electronics._id,
        stock: 15
      },
      {
        name: 'Smart Fitness Watch Pro',
        description: 'Water-resistant smartwatch featuring 24/7 heart-rate monitoring, GPS workout tracking, and high-resolution AMOLED display.',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
        category: electronics._id,
        stock: 20
      },
      {
        name: 'Vintage Blue Denim Jacket',
        description: 'Classic unisex heavyweight cotton denim trucker jacket with button-front closure and deep interior pockets.',
        price: 69.99,
        image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
        category: fashion._id,
        stock: 12
      },
      {
        name: 'Organic Cotton Casual Hoodie',
        description: 'Ultra-soft fleece-lined pullover hoodie crafted from 100% certified organic cotton with kangaroo pouch.',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
        category: fashion._id,
        stock: 25
      },
      {
        name: 'Urban Street Running Sneakers',
        description: 'Lightweight breathable mesh athletic trainers with cushioned responsive midsole for maximum running comfort.',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
        category: shoes._id,
        stock: 8
      },
      {
        name: 'Handcrafted Leather Oxford Shoes',
        description: 'Timeless formal brogue oxfords made from genuine full-grain leather with durable non-slip rubber soles.',
        price: 119.99,
        image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop&q=80',
        category: shoes._id,
        stock: 10
      }
    ];

    await Product.insertMany(products);
    console.log(`Created ${products.length} sample demo products with stock.`);

    console.log('\n=============================================');
    console.log('Database Seeding Completed Successfully!');
    console.log('Admin Account   : admin@ecom.com / Admin@123');
    console.log('Customer Account: customer@ecom.com / Customer@123');
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
