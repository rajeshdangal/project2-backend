const { pool } = require('../config/database');

class TrekkingRoute {
    // SIMPLIFIED - Get all trekking routes
    static async findAll() {
        try {
            const [rows] = await pool.execute('SELECT * FROM trekking_routes ORDER BY name');
            
            return {
                routes: rows,
                pagination: {
                    total: rows.length,
                    page: 1,
                    limit: rows.length,
                    totalPages: 1
                }
            };
        } catch (error) {
            console.error('Database error in TrekkingRoute.findAll:', error);
            throw error;
        }
    }
    
    // Get route by ID
    static async findById(id) {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM trekking_routes WHERE route_id = ?',
                [parseInt(id)]
            );
            return rows[0] || null;
        } catch (error) {
            console.error('Database error in TrekkingRoute.findById:', error);
            throw error;
        }
    }
    
    // Get route by slug
    static async findBySlug(slug) {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM trekking_routes WHERE slug = ?',
                [slug]
            );
            return rows[0] || null;
        } catch (error) {
            console.error('Database error in TrekkingRoute.findBySlug:', error);
            throw error;
        }
    }
    
    // Create new route
    static async create(routeData) {
        try {
            const { name, difficulty, duration_days, region, description, map_image_url, slug } = routeData;
            
            const [result] = await pool.execute(
                `INSERT INTO trekking_routes (name, difficulty, duration_days, region, description, map_image_url, slug)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    name || '',
                    difficulty || 'Moderate',
                    duration_days || null,
                    region || '',
                    description || '',
                    map_image_url || '',
                    slug || ''
                ]
            );
            
            return this.findById(result.insertId);
        } catch (error) {
            console.error('Database error in TrekkingRoute.create:', error);
            throw error;
        }
    }
    
    // Update route
    static async update(id, routeData) {
        try {
            const fields = [];
            const values = [];
            
            // Build update query
            if (routeData.name !== undefined) {
                fields.push('name = ?');
                values.push(routeData.name);
            }
            if (routeData.difficulty !== undefined) {
                fields.push('difficulty = ?');
                values.push(routeData.difficulty);
            }
            if (routeData.duration_days !== undefined) {
                fields.push('duration_days = ?');
                values.push(routeData.duration_days);
            }
            if (routeData.region !== undefined) {
                fields.push('region = ?');
                values.push(routeData.region);
            }
            if (routeData.description !== undefined) {
                fields.push('description = ?');
                values.push(routeData.description);
            }
            if (routeData.map_image_url !== undefined) {
                fields.push('map_image_url = ?');
                values.push(routeData.map_image_url);
            }
            if (routeData.slug !== undefined) {
                fields.push('slug = ?');
                values.push(routeData.slug);
            }
            
            if (fields.length === 0) {
                return this.findById(id);
            }
            
            values.push(parseInt(id));
            
            const [result] = await pool.execute(
                `UPDATE trekking_routes SET ${fields.join(', ')} WHERE route_id = ?`,
                values
            );
            
            if (result.affectedRows === 0) {
                return null;
            }
            
            return this.findById(id);
        } catch (error) {
            console.error('Database error in TrekkingRoute.update:', error);
            throw error;
        }
    }
    
    // Delete route
    static async delete(id) {
        try {
            const [result] = await pool.execute(
                'DELETE FROM trekking_routes WHERE route_id = ?',
                [parseInt(id)]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Database error in TrekkingRoute.delete:', error);
            throw error;
        }
    }
    
    // Get routes by difficulty
    static async findByDifficulty(difficulty) {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM trekking_routes WHERE difficulty = ? ORDER BY duration_days',
                [difficulty]
            );
            return rows;
        } catch (error) {
            console.error('Database error in TrekkingRoute.findByDifficulty:', error);
            throw error;
        }
    }
    
    // SIMPLE METHOD - For testing
    static async getAllSimple() {
        try {
            const [rows] = await pool.execute('SELECT * FROM trekking_routes');
            return rows;
        } catch (error) {
            console.error('Database error in TrekkingRoute.getAllSimple:', error);
            throw error;
        }
    }
}

module.exports = TrekkingRoute;