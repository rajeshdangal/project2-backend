class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }
    
    // Search functionality
    search() {
        const search = this.queryStr.search;
        if (search) {
            this.query = {
                ...this.query,
                search: search
            };
        }
        return this;
    }
    
    // Filter functionality
    filter() {
        const queryCopy = { ...this.queryStr };
        
        // Remove fields that are not for filtering
        const removeFields = ['page', 'limit', 'sortBy', 'order', 'search'];
        removeFields.forEach(field => delete queryCopy[field]);
        
        this.query = {
            ...this.query,
            ...queryCopy
        };
        
        return this;
    }
    
    // Pagination
    pagination() {
        const page = parseInt(this.queryStr.page) || 1;
        const limit = parseInt(this.queryStr.limit) || 10;
        
        this.query = {
            ...this.query,
            page: page,
            limit: limit
        };
        
        return this;
    }
    
    // Sorting
    sort() {
        const sortBy = this.queryStr.sortBy || 'created_at';
        const order = this.queryStr.order || 'DESC';
        
        this.query = {
            ...this.query,
            sortBy: sortBy,
            order: order.toUpperCase()
        };
        
        return this;
    }
    
    // Get the final query object
    getQuery() {
        return this.query;
    }
}

module.exports = ApiFeatures;