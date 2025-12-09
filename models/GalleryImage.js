const { pool } = require('../config/database');

class GalleryImage {
    // SIMPLIFIED VERSION - Get all gallery images
    static async findAll() {
        try {
            const [rows] = await pool.execute(`
                SELECT gi.*, 
                       p.name as peak_name,
                       tr.name as route_name
                FROM gallery_images gi
                LEFT JOIN peaks p ON gi.related_peak_id = p.peak_id
                LEFT JOIN trekking_routes tr ON gi.related_route_id = tr.route_id
                ORDER BY gi.upload_date DESC
            `);
            
            return {
                images: rows,
                pagination: {
                    total: rows.length,
                    page: 1,
                    limit: rows.length,
                    totalPages: 1
                }
            };
        } catch (error) {
            console.error('Database error in GalleryImage.findAll:', error);
            throw error;
        }
    }
    
    // Get image by ID
    static async findById(id) {
        try {
            const [rows] = await pool.execute(
                `SELECT gi.*, 
                        p.name as peak_name,
                        tr.name as route_name
                 FROM gallery_images gi
                 LEFT JOIN peaks p ON gi.related_peak_id = p.peak_id
                 LEFT JOIN trekking_routes tr ON gi.related_route_id = tr.route_id
                 WHERE gi.image_id = ?`,
                [parseInt(id)]
            );
            return rows[0] || null;
        } catch (error) {
            console.error('Database error in GalleryImage.findById:', error);
            throw error;
        }
    }
    
    // Create new image
    static async create(imageData) {
        try {
            const { title, alt_text, image_url, category, related_peak_id, related_route_id, is_featured } = imageData;
            
            const [result] = await pool.execute(
                `INSERT INTO gallery_images (title, alt_text, image_url, category, related_peak_id, related_route_id, is_featured)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    title || '',
                    alt_text || '',
                    image_url || '',
                    category || 'mountain',
                    related_peak_id || null,
                    related_route_id || null,
                    is_featured || false
                ]
            );
            
            return this.findById(result.insertId);
        } catch (error) {
            console.error('Database error in GalleryImage.create:', error);
            throw error;
        }
    }
    
    // Update image
    static async update(id, imageData) {
        try {
            const fields = [];
            const values = [];
            
            // Build update query safely
            if (imageData.title !== undefined) {
                fields.push('title = ?');
                values.push(imageData.title);
            }
            if (imageData.alt_text !== undefined) {
                fields.push('alt_text = ?');
                values.push(imageData.alt_text);
            }
            if (imageData.image_url !== undefined) {
                fields.push('image_url = ?');
                values.push(imageData.image_url);
            }
            if (imageData.category !== undefined) {
                fields.push('category = ?');
                values.push(imageData.category);
            }
            if (imageData.related_peak_id !== undefined) {
                fields.push('related_peak_id = ?');
                values.push(imageData.related_peak_id);
            }
            if (imageData.related_route_id !== undefined) {
                fields.push('related_route_id = ?');
                values.push(imageData.related_route_id);
            }
            if (imageData.is_featured !== undefined) {
                fields.push('is_featured = ?');
                values.push(imageData.is_featured);
            }
            
            if (fields.length === 0) {
                return this.findById(id);
            }
            
            values.push(parseInt(id));
            
            const [result] = await pool.execute(
                `UPDATE gallery_images SET ${fields.join(', ')} WHERE image_id = ?`,
                values
            );
            
            if (result.affectedRows === 0) {
                return null;
            }
            
            return this.findById(id);
        } catch (error) {
            console.error('Database error in GalleryImage.update:', error);
            throw error;
        }
    }
    
    // Delete image
    static async delete(id) {
        try {
            const [result] = await pool.execute(
                'DELETE FROM gallery_images WHERE image_id = ?',
                [parseInt(id)]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Database error in GalleryImage.delete:', error);
            throw error;
        }
    }
    
    // Get featured images
    static async getFeatured(limit = 10) {
        try {
            const [rows] = await pool.execute(
                `SELECT gi.*, 
                        p.name as peak_name,
                        tr.name as route_name
                 FROM gallery_images gi
                 LEFT JOIN peaks p ON gi.related_peak_id = p.peak_id
                 LEFT JOIN trekking_routes tr ON gi.related_route_id = tr.route_id
                 WHERE gi.is_featured = TRUE
                 ORDER BY gi.upload_date DESC
                 LIMIT ?`,
                [parseInt(limit)]
            );
            return rows;
        } catch (error) {
            console.error('Database error in GalleryImage.getFeatured:', error);
            throw error;
        }
    }
    
    // SIMPLE METHOD - For testing
    static async getAllSimple() {
        try {
            const [rows] = await pool.execute('SELECT * FROM gallery_images ORDER BY upload_date DESC');
            return rows;
        } catch (error) {
            console.error('Database error in GalleryImage.getAllSimple:', error);
            throw error;
        }
    }
}

module.exports = GalleryImage;