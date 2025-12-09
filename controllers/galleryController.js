const GalleryImage = require('../models/GalleryImage');
const ApiFeatures = require('../utils/apiFeatures');

const galleryController = {
    // Get all images
    getAllImages: async (req, res) => {
        try {
            const features = new ApiFeatures({}, req.query)
                .filter()
                .pagination();
            
            const query = features.getQuery();
            const result = await GalleryImage.findAll(query);
            
            res.status(200).json({
                success: true,
                count: result.images.length,
                pagination: result.pagination,
                data: result.images
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching gallery images',
                error: error.message
            });
        }
    },
    
    // Get image by ID
    getImageById: async (req, res) => {
        try {
            const image = await GalleryImage.findById(req.params.id);
            
            if (!image) {
                return res.status(404).json({
                    success: false,
                    message: 'Image not found'
                });
            }
            
            res.status(200).json({
                success: true,
                data: image
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching image',
                error: error.message
            });
        }
    },
    
    // Get featured images
    getFeaturedImages: async (req, res) => {
        try {
            const limit = req.query.limit || 10;
            const images = await GalleryImage.getFeatured(limit);
            
            res.status(200).json({
                success: true,
                count: images.length,
                data: images
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching featured images',
                error: error.message
            });
        }
    },
    
    // Create new image
    createImage: async (req, res) => {
        try {
            const imageData = req.body;
            
            // Validate required fields
            if (!imageData.title || !imageData.image_url) {
                return res.status(400).json({
                    success: false,
                    message: 'Title and image URL are required'
                });
            }
            
            const newImage = await GalleryImage.create(imageData);
            
            res.status(201).json({
                success: true,
                message: 'Image created successfully',
                data: newImage
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating image',
                error: error.message
            });
        }
    },
    
    // Update image
    updateImage: async (req, res) => {
        try {
            const updatedImage = await GalleryImage.update(req.params.id, req.body);
            
            if (!updatedImage) {
                return res.status(404).json({
                    success: false,
                    message: 'Image not found'
                });
            }
            
            res.status(200).json({
                success: true,
                message: 'Image updated successfully',
                data: updatedImage
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating image',
                error: error.message
            });
        }
    },
    
    // Delete image
    deleteImage: async (req, res) => {
        try {
            const deleted = await GalleryImage.delete(req.params.id);
            
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Image not found'
                });
            }
            
            res.status(200).json({
                success: true,
                message: 'Image deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting image',
                error: error.message
            });
        }
    }
};

module.exports = galleryController;