const navigationController = {
    getAllMenuItems: async (req, res) => {
        res.json([{ message: 'Navigation menu API' }]);
    },
    
    getMenuItemById: async (req, res) => {
        res.json({ id: req.params.id, message: 'Menu item' });
    },
    
    createMenuItem: async (req, res) => {
        res.status(201).json({ message: 'Menu item created', data: req.body });
    },
    
    updateMenuItem: async (req, res) => {
        res.json({ id: req.params.id, message: 'Menu item updated', data: req.body });
    },
    
    deleteMenuItem: async (req, res) => {
        res.json({ message: 'Menu item deleted', id: req.params.id });
    }
};

module.exports = navigationController;