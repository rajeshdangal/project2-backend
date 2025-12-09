const { pool } = require('../config/database');

class Page {
    // Get all pages
    static async findAll() {
        const [rows] = await pool.execute(
            'SELECT * FROM pages ORDER BY display_order ASC'
        );
        return rows;
    }
    
    // Get page by ID
    static async findById(id) {
        const [rows] = await pool.execute(
            'SELECT * FROM pages WHERE page_id = ?',
            [id]
        );
        return rows[0];
    }
    
    // Get page by slug
    static async findBySlug(slug) {
        const [rows] = await pool.execute(
            'SELECT * FROM pages WHERE slug = ?',
            [slug]
        );
        return rows[0];
    }
    
    // Create new page
    static async create(pageData) {
        const { page_name, title, content_html, meta_description, slug, display_order } = pageData;
        
        const [result] = await pool.execute(
            `INSERT INTO pages (page_name, title, content_html, meta_description, slug, display_order)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [page_name, title, content_html, meta_description, slug, display_order]
        );
        
        return this.findById(result.insertId);
    }
    
    // Update page
    static async update(id, pageData) {
        const fields = [];
        const values = [];
        
        Object.keys(pageData).forEach(key => {
            if (pageData[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(pageData[key]);
            }
        });
        
        if (fields.length === 0) {
            return this.findById(id);
        }
        
        values.push(id);
        
        const [result] = await pool.execute(
            `UPDATE pages SET ${fields.join(', ')} WHERE page_id = ?`,
            values
        );
        
        if (result.affectedRows === 0) {
            return null;
        }
        
        return this.findById(id);
    }
    
    // Delete page
    static async delete(id) {
        const [result] = await pool.execute(
            'DELETE FROM pages WHERE page_id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Page;