const express = require('express');
const router = express.Router();
const peakController = require('../controllers/peakController');

// =============================================
// TEST & HEALTH ROUTES (Put these first)
// =============================================

// Test endpoint - simple get all peaks
router.get('/test', peakController.getAllPeaksSimple);

// Health check endpoint
router.get('/health', peakController.healthCheck);

// Quick test - returns sample data
router.get('/sample', (req, res) => {
    res.json({
        success: true,
        message: 'Peaks API is working',
        sampleData: [
            { id: 1, name: 'Mount Everest', elevation: 8848 },
            { id: 2, name: 'Kanchenjunga', elevation: 8586 }
        ]
    });
});

// =============================================
// MAIN CRUD ROUTES
// =============================================

// GET /api/v1/peaks - Get all peaks with pagination
// Query params: page, limit, search, sortBy, order
router.get('/', peakController.getAllPeaks);

// GET /api/v1/peaks/top - Get top N highest peaks
// Query params: limit (default: 10)
router.get('/top', peakController.getTopPeaks);

// GET /api/v1/peaks/elevation - Get peaks by elevation range
// Query params: min, max (both required)
router.get('/elevation', peakController.getPeaksByElevation);

// GET /api/v1/peaks/:id - Get peak by ID
router.get('/:id', peakController.getPeakById);

// GET /api/v1/peaks/slug/:slug - Get peak by slug
router.get('/slug/:slug', peakController.getPeakBySlug);

// POST /api/v1/peaks - Create new peak
router.post('/', peakController.createPeak);

// PUT /api/v1/peaks/:id - Update peak
router.put('/:id', peakController.updatePeak);

// PATCH /api/v1/peaks/:id - Partial update peak
router.patch('/:id', peakController.updatePeak);

// DELETE /api/v1/peaks/:id - Delete peak
router.delete('/:id', peakController.deletePeak);

// =============================================
// UTILITY ROUTES
// =============================================

// GET /api/v1/peaks/count - Get total count of peaks
router.get('/count', async (req, res) => {
    try {
        // Using getAllPeaks to get count
        const result = await peakController.getAllPeaksSimple(req, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error getting count',
            error: error.message
        });
    }
});

// GET /api/v1/peaks/highest - Get highest peak
router.get('/highest', async (req, res) => {
    try {
        const peaks = await peakController.getTopPeaks({ query: { limit: 1 } }, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error getting highest peak',
            error: error.message
        });
    }
});

// =============================================
// FALLBACK ROUTES
// =============================================

// Handle invalid routes
router.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found in peaks API`,
        availableRoutes: [
            'GET / - Get all peaks',
            'GET /top - Get top peaks',
            'GET /elevation - Get by elevation range',
            'GET /:id - Get by ID',
            'GET /slug/:slug - Get by slug',
            'POST / - Create peak',
            'PUT /:id - Update peak',
            'DELETE /:id - Delete peak',
            'GET /test - Test endpoint',
            'GET /health - Health check'
        ]
    });
});

module.exports = router;