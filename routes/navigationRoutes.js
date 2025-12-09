const express = require('express');
const router = express.Router();
const navigationController = require('../controllers/navigationController');

// GET /api/v1/navigation - Get all navigation items
router.get('/', navigationController.getAllMenuItems);

// GET /api/v1/navigation/:id - Get menu item by ID
router.get('/:id', navigationController.getMenuItemById);

// POST /api/v1/navigation - Create new menu item
router.post('/', navigationController.createMenuItem);

// PUT /api/v1/navigation/:id - Update menu item
router.put('/:id', navigationController.updateMenuItem);

// DELETE /api/v1/navigation/:id - Delete menu item
router.delete('/:id', navigationController.deleteMenuItem);

module.exports = router;