const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');

// GET /api/v1/pages - Get all pages
router.get('/', pageController.getAllPages);

// GET /api/v1/pages/:id - Get page by ID
router.get('/:id', pageController.getPageById);

// GET /api/v1/pages/slug/:slug - Get page by slug
router.get('/slug/:slug', pageController.getPageBySlug);

// POST /api/v1/pages - Create new page
router.post('/', pageController.createPage);

// PUT /api/v1/pages/:id - Update page
router.put('/:id', pageController.updatePage);

// DELETE /api/v1/pages/:id - Delete page
router.delete('/:id', pageController.deletePage);

module.exports = router;