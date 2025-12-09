const Peak = require('../models/Peak');

const peakController = {
    // Get all peaks (with pagination and search)
    getAllPeaks: async (req, res) => {
        try {
            // Extract and validate query parameters
            const page = Math.max(1, parseInt(req.query.page) || 1);
            const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
            const search = req.query.search || '';
            const sortBy = req.query.sortBy || 'rank_in_world';
            const order = req.query.order === 'DESC' ? 'DESC' : 'ASC';
            
            // Call model with parameters
            const result = await Peak.findAll({
                page: page,
                limit: limit,
                search: search,
                sortBy: sortBy,
                order: order
            });
            
            res.status(200).json({
                success: true,
                count: result.peaks.length,
                pagination: result.pagination,
                data: result.peaks
            });
        } catch (error) {
            console.error('Error in getAllPeaks:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching peaks',
                error: error.message
            });
        }
    },
    
    // Get single peak by ID
    getPeakById: async (req, res) => {
        try {
            const peakId = parseInt(req.params.id);
            
            if (isNaN(peakId) || peakId <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid peak ID'
                });
            }
            
            const peak = await Peak.findById(peakId);
            
            if (!peak) {
                return res.status(404).json({
                    success: false,
                    message: 'Peak not found'
                });
            }
            
            res.status(200).json({
                success: true,
                data: peak
            });
        } catch (error) {
            console.error('Error in getPeakById:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching peak',
                error: error.message
            });
        }
    },
    
    // Get peak by slug
    getPeakBySlug: async (req, res) => {
        try {
            const slug = req.params.slug;
            
            if (!slug || slug.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'Slug is required'
                });
            }
            
            const peak = await Peak.findBySlug(slug);
            
            if (!peak) {
                return res.status(404).json({
                    success: false,
                    message: 'Peak not found'
                });
            }
            
            res.status(200).json({
                success: true,
                data: peak
            });
        } catch (error) {
            console.error('Error in getPeakBySlug:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching peak',
                error: error.message
            });
        }
    },
    
    // Create new peak
    createPeak: async (req, res) => {
        try {
            const peakData = req.body;
            
            // Validate required fields
            if (!peakData.name || !peakData.name.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Peak name is required'
                });
            }
            
            if (!peakData.elevation_meters || isNaN(peakData.elevation_meters)) {
                return res.status(400).json({
                    success: false,
                    message: 'Valid elevation is required'
                });
            }
            
            if (!peakData.slug || !peakData.slug.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Slug is required'
                });
            }
            
            // Create the peak
            const newPeak = await Peak.create(peakData);
            
            res.status(201).json({
                success: true,
                message: 'Peak created successfully',
                data: newPeak
            });
        } catch (error) {
            console.error('Error in createPeak:', error);
            res.status(500).json({
                success: false,
                message: 'Error creating peak',
                error: error.message
            });
        }
    },
    
    // Update peak
    updatePeak: async (req, res) => {
        try {
            const peakId = parseInt(req.params.id);
            
            if (isNaN(peakId) || peakId <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid peak ID'
                });
            }
            
            const updateData = req.body;
            
            // Check if there's data to update
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No data provided for update'
                });
            }
            
            // Update the peak
            const updatedPeak = await Peak.update(peakId, updateData);
            
            if (!updatedPeak) {
                return res.status(404).json({
                    success: false,
                    message: 'Peak not found'
                });
            }
            
            res.status(200).json({
                success: true,
                message: 'Peak updated successfully',
                data: updatedPeak
            });
        } catch (error) {
            console.error('Error in updatePeak:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating peak',
                error: error.message
            });
        }
    },
    
    // Delete peak
    deletePeak: async (req, res) => {
        try {
            const peakId = parseInt(req.params.id);
            
            if (isNaN(peakId) || peakId <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid peak ID'
                });
            }
            
            const deleted = await Peak.delete(peakId);
            
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Peak not found'
                });
            }
            
            res.status(200).json({
                success: true,
                message: 'Peak deleted successfully'
            });
        } catch (error) {
            console.error('Error in deletePeak:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting peak',
                error: error.message
            });
        }
    },
    
    // Get peaks by elevation range
    getPeaksByElevation: async (req, res) => {
        try {
            const min = parseFloat(req.query.min);
            const max = parseFloat(req.query.max);
            
            if (isNaN(min) || isNaN(max) || min < 0 || max < 0 || min > max) {
                return res.status(400).json({
                    success: false,
                    message: 'Valid min and max elevation values are required'
                });
            }
            
            const peaks = await Peak.findByElevation(min, max);
            
            res.status(200).json({
                success: true,
                count: peaks.length,
                data: peaks
            });
        } catch (error) {
            console.error('Error in getPeaksByElevation:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching peaks by elevation',
                error: error.message
            });
        }
    },
    
    // Get top peaks
    getTopPeaks: async (req, res) => {
        try {
            const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
            
            const peaks = await Peak.getTopPeaks(limit);
            
            res.status(200).json({
                success: true,
                count: peaks.length,
                data: peaks
            });
        } catch (error) {
            console.error('Error in getTopPeaks:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching top peaks',
                error: error.message
            });
        }
    },
    
    // SIMPLE TEST ENDPOINT - Use this if getAllPeaks has issues
    getAllPeaksSimple: async (req, res) => {
        try {
            const peaks = await Peak.getAllSimple ? await Peak.getAllSimple() : await Peak.findAll({ limit: 100 });
            
            res.status(200).json({
                success: true,
                count: peaks.length || peaks.peaks?.length || 0,
                data: peaks.peaks || peaks
            });
        } catch (error) {
            console.error('Error in getAllPeaksSimple:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching peaks',
                error: error.message
            });
        }
    },
    
    // Health check endpoint
    healthCheck: async (req, res) => {
        try {
            // Test database connection with a simple query
            const testResult = await Peak.findById(1); // Try to get first peak
            
            res.status(200).json({
                success: true,
                message: 'Peaks API is working',
                database: testResult ? 'Connected' : 'Connected but no data',
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            res.status(200).json({
                success: false,
                message: 'Peaks API has issues',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }
};

module.exports = peakController;