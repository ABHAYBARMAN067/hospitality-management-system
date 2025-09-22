import Product from '../models/Product.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  // Build filter object
  const filter = { isActive: true };

  if (req.query.category) {
    filter.category = req.query.category;
  }

  if (req.query.subcategory) {
    filter.subcategory = req.query.subcategory;
  }

  if (req.query.brand) {
    filter.brand = req.query.brand;
  }

  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
  }

  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  if (req.query.isFeatured !== undefined) {
    filter.isFeatured = req.query.isFeatured === 'true';
  }

  // Build sort object
  let sort = {};
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'price_asc':
        sort = { price: 1 };
        break;
      case 'price_desc':
        sort = { price: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'rating':
        sort = { ratings: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }
  } else {
    sort = { createdAt: -1 };
  }

  const products = await Product.find(filter)
    .populate('createdBy', 'name')
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .select('-reviews'); // Exclude reviews for performance

  const total = await Product.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    products
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('createdBy', 'name')
    .populate('reviews.user', 'name avatar');

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  res.status(200).json({
    success: true,
    product
  });
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  // Add user to req.body
  req.body.createdBy = req.user._id;

  // Handle image uploads
  if (req.files && req.files.length > 0) {
    const imageUrls = [];
    for (const file of req.files) {
      const result = await uploadToCloudinary(file.path, 'products');
      imageUrls.push({
        public_id: result.public_id,
        url: result.secure_url
      });
    }
    req.body.images = imageUrls;
  }

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    product
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Handle image uploads for new images
  if (req.files && req.files.length > 0) {
    const imageUrls = [...product.images]; // Keep existing images
    for (const file of req.files) {
      const result = await uploadToCloudinary(file.path, 'products');
      imageUrls.push({
        public_id: result.public_id,
        url: result.secure_url
      });
    }
    req.body.images = imageUrls;
  }

  // Handle image deletions
  if (req.body.deletedImages && req.body.deletedImages.length > 0) {
    for (const publicId of req.body.deletedImages) {
      await deleteFromCloudinary(publicId);
      product.images = product.images.filter(img => img.public_id !== publicId);
    }
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    product
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Delete images from Cloudinary
  for (const image of product.images) {
    await deleteFromCloudinary(image.public_id);
  }

  await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
export const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Check if user already reviewed this product
  const alreadyReviewed = product.reviews.find(
    review => review.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    return res.status(400).json({
      success: false,
      message: 'Product already reviewed'
    });
  }

  const review = {
    user: req.user._id,
    rating: Number(rating),
    comment
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;

  // Calculate average rating
  product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

  await product.save();

  res.status(201).json({
    success: true,
    message: 'Review added successfully'
  });
});

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
export const getProductReviews = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews.user', 'name avatar');

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews
  });
});

// @desc    Get all product categories
// @route   GET /api/products/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category', { isActive: true });

  // Define category display names and order
  const categoryMap = {
    'Electronics': 'Electronics',
    'Clothing': 'Clothing',
    'Books': 'Books',
    'Home & Garden': 'Home & Garden',
    'Sports': 'Sports',
    'Beauty': 'Beauty',
    'Toys': 'Toys',
    'Automotive': 'Automotive',
    'Health': 'Health',
    'Other': 'Other'
  };

  // Filter out any categories that aren't in our predefined list
  const validCategories = categories.filter(cat => categoryMap[cat]);

  // Sort categories in a logical order
  const sortedCategories = validCategories.sort((a, b) => {
    const order = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys', 'Automotive', 'Health', 'Other'];
    return order.indexOf(a) - order.indexOf(b);
  });

  res.status(200).json({
    success: true,
    categories: sortedCategories,
    count: sortedCategories.length
  });
});
