const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');

// GET /api/v1/gallery - Get all images
router.get('/', galleryController.getAllImages);

// GET /api/v1/gallery/featured - Get featured images
router.get('/featured', galleryController.getFeaturedImages);

// GET /api/v1/gallery/:id - Get image by ID
router.get('/:id', galleryController.getImageById);

// POST /api/v1/gallery - Create new image
router.post('/', galleryController.createImage);

// PUT /api/v1/gallery/:id - Update image
router.put('/:id', galleryController.updateImage);

// DELETE /api/v1/gallery/:id - Delete image
router.delete('/:id', galleryController.deleteImage);

module.exports = router;