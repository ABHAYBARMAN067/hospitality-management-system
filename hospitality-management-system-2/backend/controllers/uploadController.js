const cloudinary = require('../utils/cloudinary');

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'hotel-images',
        });

        res.json({
            message: 'Image uploaded successfully',
            imageUrl: result.secure_url,
            publicId: result.public_id,
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    uploadImage,
};
