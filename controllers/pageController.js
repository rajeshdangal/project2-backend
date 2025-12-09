const Page = require('../models/Page');

const pageController = {
    getAllPages: async (req, res) => {
        try {
            const pages = await Page.findAll();
            res.json(pages);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    getPageById: async (req, res) => {
        try {
            const page = await Page.findById(req.params.id);
            if (!page) return res.status(404).json({ error: 'Page not found' });
            res.json(page);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    getPageBySlug: async (req, res) => {
        try {
            const page = await Page.findBySlug(req.params.slug);
            if (!page) return res.status(404).json({ error: 'Page not found' });
            res.json(page);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    createPage: async (req, res) => {
        try {
            const newPage = await Page.create(req.body);
            res.status(201).json(newPage);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    updatePage: async (req, res) => {
        try {
            const updated = await Page.update(req.params.id, req.body);
            if (!updated) return res.status(404).json({ error: 'Page not found' });
            res.json(updated);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    deletePage: async (req, res) => {
        try {
            const deleted = await Page.delete(req.params.id);
            if (!deleted) return res.status(404).json({ error: 'Page not found' });
            res.json({ message: 'Page deleted' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = pageController;  // Make sure this line exists