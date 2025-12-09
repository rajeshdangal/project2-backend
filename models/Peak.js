const { pool } = require('../config/database');

class Peak {
    // SIMPLE WORKING VERSION - Get all peaks
    static async findAll() {
        try {
            const [rows] = await pool.execute('SELECT * FROM peaks ORDER BY rank_in_world');
            
            return {
                peaks: rows,
                pagination: {
                    total: rows.length,
                    page: 1,
                    limit: rows.length,
                    totalPages: 1
                }
            };
        } catch (error) {
            console.error('Database error in Peak.findAll:', error);
            throw error;
        }
    }
    
    // Get single peak by ID
    static async findById(id) {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM peaks WHERE peak_id = ?',
                [parseInt(id)]
            );
            return rows[0] || null;
        } catch (error) {
            console.error('Database error in Peak.findById:', error);
            throw error;
        }
    }
    
    // Get peak by slug
    static async findBySlug(slug) {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM peaks WHERE slug = ?',
                [slug]
            );
            return rows[0] || null;
        } catch (error) {
            console.error('Database error in Peak.findBySlug:', error);
            throw error;
        }
    }
    
    // Create new peak
    static async create(peakData) {
        try {
            const { name, elevation_meters, rank_in_world, location, description, image_url, slug } = peakData;
            
            const [result] = await pool.execute(
                `INSERT INTO peaks (name, elevation_meters, rank_in_world, location, description, image_url, slug)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [name, elevation_meters, rank_in_world || null, location, description || '', image_url || '', slug]
            );
            
            return this.findById(result.insertId);
        } catch (error) {
            console.error('Database error in Peak.create:', error);
            throw error;
        }
    }
    
    // Update peak
    static async update(id, peakData) {
        try {
            const fields = [];
            const values = [];
            
            // Build update query
            if (peakData.name !== undefined) {
                fields.push('name = ?');
                values.push(peakData.name);
            }
            if (peakData.elevation_meters !== undefined) {
                fields.push('elevation_meters = ?');
                values.push(peakData.elevation_meters);
            }
            if (peakData.rank_in_world !== undefined) {
                fields.push('rank_in_world = ?');
                values.push(peakData.rank_in_world);
            }
            if (peakData.location !== undefined) {
                fields.push('location = ?');
                values.push(peakData.location);
            }
            if (peakData.description !== undefined) {
                fields.push('description = ?');
                values.push(peakData.description);
            }
            if (peakData.image_url !== undefined) {
                fields.push('image_url = ?');
                values.push(peakData.image_url);
            }
            if (peakData.slug !== undefined) {
                fields.push('slug = ?');
                values.push(peakData.slug);
            }
            
            if (fields.length === 0) {
                return this.findById(id);
            }
            
            values.push(parseInt(id));
            
            const [result] = await pool.execute(
                `UPDATE peaks SET ${fields.join(', ')} WHERE peak_id = ?`,
                values
            );
            
            if (result.affectedRows === 0) {
                return null;
            }
            
            return this.findById(id);
        } catch (error) {
            console.error('Database error in Peak.update:', error);
            throw error;
        }
    }
    
    // Delete peak
    static async delete(id) {
        try {
            const [result] = await pool.execute(
                'DELETE FROM peaks WHERE peak_id = ?',
                [parseInt(id)]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Database error in Peak.delete:', error);
            throw error;
        }
    }
    
    // Get peaks by elevation range
    static async findByElevation(min, max) {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM peaks WHERE elevation_meters BETWEEN ? AND ? ORDER BY elevation_meters DESC',
                [parseFloat(min), parseFloat(max)]
            );
            return rows;
        } catch (error) {
            console.error('Database error in Peak.findByElevation:', error);
            throw error;
        }
    }
    
    // Get top N highest peaks
    static async getTopPeaks(limit = 10) {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM peaks ORDER BY rank_in_world ASC LIMIT ?',
                [parseInt(limit)]
            );
            return rows;
        } catch (error) {
            console.error('Database error in Peak.getTopPeaks:', error);
            throw error;
        }
    }
    
    // SIMPLE METHOD - Use this for testing
    static async getAllSimple() {
        try {
            const [rows] = await pool.execute('SELECT * FROM peaks');
            return rows;
        } catch (error) {
            console.error('Database error in Peak.getAllSimple:', error);
            throw error;
        }
    }
}

module.exports = Peak;