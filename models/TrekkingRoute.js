const { pool } = require('../config/database');

class TrekkingRoute {
    // Get all trekking routes
    static async findAll({ page = 1, limit = 10, difficulty, region, search = '' }) {
        const offset = (page - 1) * limit;
        
        let query = `SELECT * FROM trekking_routes WHERE 1=1`;
        const params = [];
        
        if (difficulty) {
            query += ` AND difficulty = ?`;
            params.push(difficulty);
        }
        
        if (region) {
            query += ` AND region = ?`;
            params.push(region);
        }
        
        if (search) {
            query += ` AND (name LIKE ? OR description LIKE ?)`;
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm);
        }
        
        query += ` LIMIT ? OFFSET ?`;
        params.push(limit, offset);
        
        const [rows] = await pool.execute(query, params);
        
        // Get total count
        const countQuery = `SELECT COUNT(*) as total FROM trekking_routes`;
        const [countResult] = await pool.execute(countQuery);
        const total = countResult[0].total;
        
        return {
            routes: rows,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    
    // Get route by ID
    static async findById(id) {
        const [rows] = await pool.execute(
            'SELECT * FROM trekking_routes WHERE route_id = ?',
            [id]
        );
        return rows[0];
    }
    
    // Get route by slug
    static async findBySlug(slug) {
        const [rows] = await pool.execute(
            'SELECT * FROM trekking_routes WHERE slug = ?',
            [slug]
        );
        return rows[0];
    }
    
    // Create new route
    static async create(routeData) {
        const { name, difficulty, duration_days, region, description, map_image_url, slug } = routeData;
        
        const [result] = await pool.execute(
            `INSERT INTO trekking_routes (name, difficulty, duration_days, region, description, map_image_url, slug)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, difficulty, duration_days, region, description, map_image_url, slug]
        );
        
        return this.findById(result.insertId);
    }
    
    // Update route
    static async update(id, routeData) {
        const fields = [];
        const values = [];
        
        Object.keys(routeData).forEach(key => {
            if (routeData[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(routeData[key]);
            }
        });
        
        if (fields.length === 0) {
            return this.findById(id);
        }
        
        values.push(id);
        
        const [result] = await pool.execute(
            `UPDATE trekking_routes SET ${fields.join(', ')} WHERE route_id = ?`,
            values
        );
        
        if (result.affectedRows === 0) {
            return null;
        }
        
        return this.findById(id);
    }
    
    // Delete route
    static async delete(id) {
        const [result] = await pool.execute(
            'DELETE FROM trekking_routes WHERE route_id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
    
    // Get routes by difficulty
    static async findByDifficulty(difficulty) {
        const [rows] = await pool.execute(
            'SELECT * FROM trekking_routes WHERE difficulty = ? ORDER BY duration_days',
            [difficulty]
        );
        return rows;
    }
}

module.exports = TrekkingRoute;