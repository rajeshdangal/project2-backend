const TrekkingRoute = require('../models/TrekkingRoute');
const ApiFeatures = require('../utils/apiFeatures');

const trekkingController = {
    getAllRoutes: async (req, res) => {
        try {
            const features = new ApiFeatures({}, req.query)
                .search()
                .filter()
                .pagination();
            
            const query = features.getQuery();
            const result = await TrekkingRoute.findAll(query);
            
            res.status(200).json({
                success: true,
                count: result.routes.length,
                pagination: result.pagination,
                data: result.routes
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching trekking routes',
                error: error.message
            });
        }
    },
    
    // ... other methods similar to peakController
    getRouteById: async (req, res) => { /* ... */ },
    getRouteBySlug: async (req, res) => { /* ... */ },
    createRoute: async (req, res) => { /* ... */ },
    updateRoute: async (req, res) => { /* ... */ },
    deleteRoute: async (req, res) => { /* ... */ },
    getRoutesByDifficulty: async (req, res) => { /* ... */ }
};

module.exports = trekkingController;