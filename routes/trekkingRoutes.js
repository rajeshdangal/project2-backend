const express = require('express');
const router = express.Router();
const trekkingController = require('../controllers/trekkingController');

// GET /api/v1/trekking - Get all trekking routes
router.get('/', trekkingController.getAllRoutes);

// GET /api/v1/trekking/difficulty/:level - Get routes by difficulty
router.get('/difficulty/:level', trekkingController.getRoutesByDifficulty);

// GET /api/v1/trekking/:id - Get route by ID
router.get('/:id', trekkingController.getRouteById);

// GET /api/v1/trekking/slug/:slug - Get route by slug
router.get('/slug/:slug', trekkingController.getRouteBySlug);

// POST /api/v1/trekking - Create new route
router.post('/', trekkingController.createRoute);

// PUT /api/v1/trekking/:id - Update route
router.put('/:id', trekkingController.updateRoute);

// DELETE /api/v1/trekking/:id - Delete route
router.delete('/:id', trekkingController.deleteRoute);

module.exports = router;