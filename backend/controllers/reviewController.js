import Review from '../models/Review.js';
import Restaurant from '../models/Restaurant.js';

export const createReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const restaurantId = req.params.restaurantId || req.body.restaurant;

        // Check if user already reviewed this restaurant
        const existingReview = await Review.findOne({
            user: req.user.id,
            restaurant: restaurantId
        });

        if (existingReview) {
            return res.status(400).json({ error: 'You have already reviewed this restaurant' });
        }

        const review = new Review({
            user: req.user.id,
            restaurant: restaurantId,
            rating,
            comment
        });

        await review.save();

        // Update restaurant average rating
        const reviews = await Review.find({ restaurant: restaurantId });
        const avgRating = reviews.length > 0
            ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
            : 0;

    await Restaurant.findByIdAndUpdate(restaurantId, {
        rating: avgRating,
        reviewCount: reviews.length
    });

        const populatedReview = await Review.findById(review._id).populate('user', 'name email');

        res.status(201).json({ review: populatedReview });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getReviewsByRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const reviews = await Review.find({ restaurant: id })
            .populate('user', 'name')
            .sort({ createdAt: -1 })
            .limit(20);

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
