const { pool } = require('../config/database');

class NavigationMenu {
    // Get all menu items
    static async findAll() {
        const [rows] = await pool.execute(
            `SELECT nm.*, p.title as page_title
             FROM navigation_menu nm
             LEFT JOIN pages p ON nm.page_slug = p.slug
             WHERE nm.is_active = TRUE
             ORDER BY nm.display_order ASC`
        );
        return rows;
    }
    
    // Get menu item by ID
    static async findById(id) {
        const [rows] = await pool.execute(
            'SELECT * FROM navigation_menu WHERE menu_id = ?',
            [id]
        );
        return rows[0];
    }
    
    // Create new menu item
    static async create(menuData) {
        const { menu_text, page_slug, external_url, display_order, is_active } = menuData;
        
        const [result] = await pool.execute(
            `INSERT INTO navigation_menu (menu_text, page_slug, external_url, display_order, is_active)
             VALUES (?, ?, ?, ?, ?)`,
            [menu_text, page_slug, external_url, display_order, is_active]
        );
        
        return this.findById(result.insertId);
    }
    
    // Update menu item
    static async update(id, menuData) {
        const fields = [];
        const values = [];
        
        Object.keys(menuData).forEach(key => {
            if (menuData[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(menuData[key]);
            }
        });
        
        if (fields.length === 0) {
            return this.findById(id);
        }
        
        values.push(id);
        
        const [result] = await pool.execute(
            `UPDATE navigation_menu SET ${fields.join(', ')} WHERE menu_id = ?`,
            values
        );
        
        if (result.affectedRows === 0) {
            return null;
        }
        
        return this.findById(id);
    }
    
    // Delete menu item
    static async delete(id) {
        const [result] = await pool.execute(
            'DELETE FROM navigation_menu WHERE menu_id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = NavigationMenu;