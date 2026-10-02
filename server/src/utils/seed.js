import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecom_db');
    console.log('Connected to MongoDB for seeding...');

    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    const admin = await User.create({
      name: 'Store Admin',
      email: 'admin@example.com',
      password: 'AdminPassword123',
      role: 'admin'
    });

    const customer = await User.create({
      name: 'Alex Johnson',
      email: 'alex@example.com',
      password: 'Password123',
      role: 'customer'
    });

    const catElectronics = await Category.create({
      name: 'Electronics',
      description: 'Smartphones, laptops, and gadgets'
    });
    const catFashion = await Category.create({
      name: 'Fashion',
      description: 'Apparel, clothing, and accessories'
    });
    const catShoes = await Category.create({
      name: 'Shoes',
      description: 'Sneakers, formal shoes, and sports footwear'
    });

    const products = await Product.insertMany([
      {
        name: 'Wireless Noise-Cancelling Headphones',
        description: 'High fidelity audio with 30-hour battery life and active noise cancellation.',
        price: 99.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
        category: catElectronics._id,
        stock: 15
      },
      {
        name: 'Flagship 5G Smartphone',
        description: '6.7-inch OLED display, 128GB storage, 48MP triple lens camera setup.',
        price: 699.99,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600',
        category: catElectronics._id,
        stock: 8
      },
      {
        name: 'Ultra-Slim Laptop 14"',
        description: 'Lightweight aluminum chassis, Intel i7 processor, 16GB RAM, 512GB SSD.',
        price: 1099.99,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600',
        category: catElectronics._id,
        stock: 5
      },
      {
        name: 'Classic Denim Jacket',
        description: '100% cotton washed denim trucker jacket with front button closure.',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600',
        category: catFashion._id,
        stock: 25
      },
      {
        name: 'Cotton Graphic Hoodie',
        description: 'Soft fleece-lined hoodie with minimalist chest graphic.',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600',
        category: catFashion._id,
        stock: 3
      },
      {
        name: 'Running Performance Sneakers',
        description: 'Breathable mesh upper with responsive foam cushion sole.',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
        category: catShoes._id,
        stock: 20
      },
      {
        name: 'Minimalist Leather Sneakers',
        description: 'Premium white leather low-top sneakers for everyday wear.',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600',
        category: catShoes._id,
        stock: 0
      }
    ]);

    await Order.create({
      user: customer._id,
      products: [
        {
          product: products[0]._id,
          name: products[0].name,
          price: products[0].price,
          quantity: 1
        }
      ],
      totalAmount: 99.99,
      shippingAddress: {
        name: 'Alex Johnson',
        phone: '+1 555-0192',
        address: '742 Evergreen Terrace',
        city: 'Springfield',
        pincode: '97477'
      },
      paymentMethod: 'Cash on Delivery',
      status: 'Pending'
    });

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedData();
