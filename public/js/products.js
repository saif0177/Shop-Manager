// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Setup event listeners first
    setupProductEventListeners();
    
    // Load products when on the products page
    if (document.getElementById('products').classList.contains('active')) {
        loadProducts();
    }
    
    // If navigating to products later, load products
    document.querySelector('[data-page="products"]').addEventListener('click', () => {
        // Show loading indicator
        const productsGrid = document.getElementById('productsGrid');
        productsGrid.innerHTML = '<div class="loading-products"><i class="fas fa-spinner fa-spin"></i><p>Loading products...</p></div>';
        
        // Use setTimeout to ensure UI updates before loading products
        setTimeout(() => {
            loadProducts();
        }, 50);
    });

    // Edit Mode Button
    const editModeBtn = document.getElementById('editModeBtn');
    editModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('edit-mode');
        editModeBtn.classList.toggle('active');
        if (editModeBtn.classList.contains('active')) {
            editModeBtn.innerHTML = '<i class="fas fa-check"></i>';
        } else {
            editModeBtn.innerHTML = '<i class="fas fa-edit"></i>';
        }
    });

    // Floating Sell Button
    const floatingSellBtn = document.getElementById('floatingSellBtn');
    floatingSellBtn.addEventListener('click', () => {
        // Get the first available product
        const availableProduct = demoProducts.find(product => product.stock > 0);
        if (availableProduct) {
            openSellModal(availableProduct);
        } else {
            showNotification('No products available for sale', 'error');
        }
    });

    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    // Close modal when clicking close button
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modal = closeBtn.closest('.modal');
            closeModal(modal);
        });
    });
});

// Sample product data - in a real app, this would come from the server
const demoProducts = [
    {
        id: 1,
        name: 'Black T-Shirt',
        category: 't-shirts',
        price: 19.99,
        originalPrice: 24.99,
        discount: 20,
        stock: 45,
        rating: 4.5,
        ratingCount: 128,
        image: 'public/images/Y2A5560-Edit-600x800.webp',
        description: 'Premium cotton black t-shirt for everyday wear.'
    },
    {
        id: 2,
        name: 'Blue Denim Jeans',
        category: 'pants',
        price: 49.99,
        originalPrice: 59.99,
        discount: 17,
        stock: 32,
        rating: 4.8,
        ratingCount: 95,
        image: 'public/images/Y2A5735-Edit-600x800.webp',
        description: 'Classic blue denim jeans with a comfortable fit.'
    },
    {
        id: 3,
        name: 'White Dress Shirt',
        category: 'shirts',
        price: 34.99,
        originalPrice: 34.99,
        discount: 0,
        stock: 18,
        rating: 4.2,
        ratingCount: 67,
        image: 'public/images/Shirt-12-600x800.webp',
        description: 'Elegant white dress shirt for formal occasions.'
    },
    {
        id: 4,
        name: 'Running Shoes',
        category: 'shoes',
        price: 79.99,
        originalPrice: 99.99,
        discount: 20,
        stock: 8,
        rating: 4.7,
        ratingCount: 203,
        image: 'public/images/8613918_2_300x.avif',
        description: 'High-quality running shoes with extra comfort.'
    },
    {
        id: 5,
        name: 'Striped Polo Shirt',
        category: 'shirts',
        price: 29.99,
        originalPrice: 29.99,
        discount: 0,
        stock: 27,
        rating: 4.0,
        ratingCount: 45,
        image: 'public/images/Shirt-11-scaled.webp',
        description: 'Casual striped polo shirt for a stylish look.'
    },
    {
        id: 6,
        name: 'Cargo Pants',
        category: 'pants',
        price: 44.99,
        originalPrice: 54.99,
        discount: 18,
        stock: 0,
        rating: 4.3,
        ratingCount: 58,
        image: 'public/images/8306125_2_300x.avif',
        description: 'Versatile cargo pants with multiple pockets.'
    }
];

// Load products
function loadProducts(category = 'all') {
    const productsGrid = document.getElementById('productsGrid');
    const productSearch = document.getElementById('productSearch');
    const searchTerm = productSearch ? productSearch.value.toLowerCase() : '';
    
    // Clear the existing products
    productsGrid.innerHTML = '';
    
    // Filter products by category and search term
    let filteredProducts = [...demoProducts]; // Create a copy to avoid mutation issues
    
    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === category);
    }
    
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Add products to the grid
    if (filteredProducts.length > 0) {
        filteredProducts.forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.appendChild(productCard);
        });
    } else {
        // Display a message if no products found
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <p>No products found. Try a different search or category.</p>
            </div>
        `;
    }
}

// Create a product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    
    // Determine stock status
    let stockStatus = 'in-stock';
    let stockText = `In Stock (${product.stock})`;
    
    if (product.stock === 0) {
        stockStatus = 'out-stock';
        stockText = 'Out of Stock';
    } else if (product.stock < 10) {
        stockStatus = 'low-stock';
        stockText = `Low Stock (${product.stock})`;
    }
    
    // Check if there's a discount
    const hasDiscount = product.discount > 0;
    
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='public/images/product-placeholder.jpg'">
        <div class="product-details">
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">
                $${product.price.toFixed(2)}
                ${hasDiscount ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                ${hasDiscount ? `<span class="discount-badge">${product.discount}% OFF</span>` : ''}
            </div>
            <div class="product-stock">
                <span class="stock-text ${stockStatus}">${stockText}</span>
            </div>
            <div class="product-actions">
                <button class="edit-btn" title="Edit Product">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" title="Delete Product">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <button class="sell-btn" ${product.stock === 0 ? 'disabled' : ''}>
                <i class="fas fa-shopping-cart"></i> Sell
            </button>
        </div>
    `;
    
    // Add event listeners for edit and delete buttons
    const editBtn = card.querySelector('.edit-btn');
    const deleteBtn = card.querySelector('.delete-btn');
    const sellBtn = card.querySelector('.sell-btn');
    
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        editProduct(product.id);
    });
    
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteProduct(product.id, card);
    });
    
    sellBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openSellModal(product);
    });
    
    return card;
}

// Create rating stars based on rating value
function createRatingStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    // Add half star if needed
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Setup event listeners for product-related functionality
function setupProductEventListeners() {
    const productSearch = document.getElementById('productSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const productsGrid = document.getElementById('productsGrid');
    
    // Search products
    if (productSearch) {
        productSearch.addEventListener('input', () => {
            const category = categoryFilter ? categoryFilter.value : 'all';
            loadProducts(category);
        });
    }
    
    // Filter by category
    if (categoryFilter) {
        categoryFilter.addEventListener('change', () => {
            loadProducts(categoryFilter.value);
        });
    }
    
    // Edit product
    if (productsGrid) {
        productsGrid.addEventListener('click', (e) => {
            // Edit button clicked
            if (e.target.closest('.edit-btn')) {
                const productCard = e.target.closest('.product-card');
                const productId = parseInt(productCard.dataset.id);
                editProduct(productId);
            }
            
            // Delete button clicked
            if (e.target.closest('.delete-btn')) {
                const productCard = e.target.closest('.product-card');
                const productId = parseInt(productCard.dataset.id);
                deleteProduct(productId, productCard);
            }
        });
    }
    
    // Handle product form submission
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveProduct();
        });
    }
}

// Edit a product
function editProduct(productId) {
    const product = demoProducts.find(p => p.id === productId);
    
    if (product) {
        // Set the modal title
        document.getElementById('productModalTitle').textContent = 'Edit Product';
        
        // Fill the form with product data
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productDiscount').value = product.discount;
        document.getElementById('productDescription').value = product.description;
        
        // Add the product ID to the form for reference
        document.getElementById('productForm').dataset.id = productId;
        
        // Open the modal
        openModal(document.getElementById('productModal'));
    }
}

// Delete a product
function deleteProduct(productId, productCard) {
    if (confirm('Are you sure you want to delete this product?')) {
        // In a real app, you would send a request to the server
        // For demo, we'll just remove the card from DOM
        productCard.remove();
        
        // Remove from the array (in a real app, this would be handled by the server)
        const index = demoProducts.findIndex(p => p.id === productId);
        if (index !== -1) {
            demoProducts.splice(index, 1);
        }
        
        alert('Product deleted successfully!');
    }
}

// Save a product (create or update)
function saveProduct() {
    const productForm = document.getElementById('productForm');
    const productId = productForm.dataset.id ? parseInt(productForm.dataset.id) : null;
    
    // Get form data
    const productData = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        discount: parseInt(document.getElementById('productDiscount').value),
        description: document.getElementById('productDescription').value
    };
    
    // Assign an image based on the category
    const categoryImages = {
        't-shirts': 'public/images/Y2A5560-Edit-600x800.webp',
        'shirts': 'public/images/Shirt-12-600x800.webp',
        'pants': 'public/images/Y2A5735-Edit-600x800.webp',
        'shoes': 'public/images/8613918_2_300x.avif'
    };
    
    productData.image = categoryImages[productData.category] || 'public/images/product-placeholder.jpg';
    
    if (productId) {
        // Update existing product
        const index = demoProducts.findIndex(p => p.id === productId);
        if (index !== -1) {
            // Calculate original price
            if (productData.discount > 0) {
                productData.originalPrice = parseFloat((productData.price / (1 - productData.discount / 100)).toFixed(2));
            } else {
                productData.originalPrice = productData.price;
            }
            
            // Keep rating from original product
            productData.rating = demoProducts[index].rating;
            productData.ratingCount = demoProducts[index].ratingCount;
            productData.id = productId;
            
            // Update the product in the array
            demoProducts[index] = productData;
        }
    } else {
        // Add new product
        productData.id = demoProducts.length > 0 ? Math.max(...demoProducts.map(p => p.id)) + 1 : 1;
        productData.originalPrice = productData.price;
        productData.rating = 0;
        productData.ratingCount = 0;
        
        // Add to the demoProducts array
        demoProducts.push(productData);
    }
    
    // Close the modal
    closeModal(document.getElementById('productModal'));
    
    // Reload the products
    loadProducts(document.getElementById('categoryFilter').value);
    
    // Reset the form
    productForm.reset();
    delete productForm.dataset.id;
}

// Modal functions - duplicating from main.js to ensure this file works independently
function openModal(modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Open sell modal
function openSellModal(product) {
    const modal = document.getElementById('sellModal');
    const form = document.getElementById('sellForm');
    
    // Remove any existing event listeners
    const quantityInput = document.getElementById('sellQuantity');
    const discountInput = document.getElementById('sellDiscount');
    const cancelBtn = document.getElementById('cancelSellBtn');
    const newQuantityInput = quantityInput.cloneNode(true);
    const newDiscountInput = discountInput.cloneNode(true);
    const newCancelBtn = cancelBtn.cloneNode(true);
    quantityInput.parentNode.replaceChild(newQuantityInput, quantityInput);
    discountInput.parentNode.replaceChild(newDiscountInput, discountInput);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
    
    // Fill in the form
    document.getElementById('sellProductName').value = product.name;
    document.getElementById('sellPrice').value = product.price;
    document.getElementById('sellQuantity').max = product.stock;
    document.getElementById('sellQuantity').value = 1;
    document.getElementById('sellDiscount').value = 0;
    updateSellTotal();
    
    // Show the modal
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Add event listeners
    document.getElementById('sellQuantity').addEventListener('input', updateSellTotal);
    document.getElementById('sellDiscount').addEventListener('input', updateSellTotal);
    document.getElementById('cancelSellBtn').addEventListener('click', () => closeSellModal());
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        completeSale(product);
    });
}

// Update sell total
function updateSellTotal() {
    const quantity = parseInt(document.getElementById('sellQuantity').value);
    const price = parseFloat(document.getElementById('sellPrice').value);
    const discount = parseFloat(document.getElementById('sellDiscount').value);
    
    // Calculate total before discount
    const subtotal = quantity * price;
    
    // Calculate discount amount
    const discountAmount = subtotal * (discount / 100);
    
    // Calculate final total
    const total = subtotal - discountAmount;
    
    document.getElementById('sellTotal').value = total.toFixed(2);
}

// Close sell modal
function closeSellModal() {
    const modal = document.getElementById('sellModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Complete sale
function completeSale(product) {
    const quantity = parseInt(document.getElementById('sellQuantity').value);
    const discount = parseFloat(document.getElementById('sellDiscount').value);
    
    if (quantity > product.stock) {
        showNotification('Not enough stock available!', 'error');
        return;
    }
    
    // Calculate sale details
    const subtotal = quantity * product.price;
    const discountAmount = subtotal * (discount / 100);
    const total = subtotal - discountAmount;
    
    // Update stock - only reduce by the actual quantity sold
    product.stock = product.stock - quantity;
    
    // Add to history
    const now = new Date();
    const saleRecord = {
        id: demoHistory.length + 1,
        productName: product.name,
        quantity: quantity,
        price: product.price,
        discount: discount,
        total: total,
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().split(' ')[0].substring(0, 5)
    };
    
    // Add to history array
    demoHistory.unshift(saleRecord);
    
    // Update the stock text in the product card
    const productCard = document.querySelector(`.product-card[data-id="${product.id}"]`);
    if (productCard) {
        const stockText = productCard.querySelector('.stock-text');
        if (stockText) {
            let stockStatus = 'in-stock';
            let stockDisplay = `In Stock (${product.stock})`;
            
            if (product.stock === 0) {
                stockStatus = 'out-stock';
                stockDisplay = 'Out of Stock';
            } else if (product.stock < 10) {
                stockStatus = 'low-stock';
                stockDisplay = `Low Stock (${product.stock})`;
            }
            
            stockText.className = `stock-text ${stockStatus}`;
            stockText.textContent = stockDisplay;
            
            // Update sell button disabled state
            const sellBtn = productCard.querySelector('.sell-btn');
            if (sellBtn) {
                sellBtn.disabled = product.stock === 0;
            }
        }
    }
    
    // Close the modal
    closeSellModal();
    
    // Show success message
    showSuccessMessage(product, quantity, subtotal, discount, discountAmount, total);
    
    // If we're on the history page, reload the history
    if (document.getElementById('history').classList.contains('active')) {
        loadHistory();
    }
}

// Show success message
function showSuccessMessage(product, quantity, subtotal, discount, discountAmount, total) {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div class="success-content">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="success-details">
                <h3>Sale Completed Successfully!</h3>
                <div class="sale-info">
                    <p><strong>Product:</strong> ${product.name}</p>
                    <p><strong>Quantity:</strong> ${quantity}</p>
                    <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
                    ${discount > 0 ? `<p><strong>Discount:</strong> ${discount}% ($${discountAmount.toFixed(2)})</p>` : ''}
                    <p class="total-amount"><strong>Total:</strong> $${total.toFixed(2)}</p>
                </div>
            </div>
            <button class="close-success" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(successMessage);
    
    // Remove the message after 5 seconds
    setTimeout(() => {
        if (successMessage.parentNode) {
            successMessage.remove();
        }
    }, 5000);
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove the notification after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
} 