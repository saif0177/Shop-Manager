// DOM Elements
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const productModal = document.getElementById('productModal');
const noteModal = document.getElementById('noteModal');
const addProductBtn = document.getElementById('addProductBtn');
const addNoteBtn = document.getElementById('addNoteBtn');
const closeButtons = document.querySelectorAll('.close');
const cancelProductBtn = document.getElementById('cancelProductBtn');
const cancelNoteBtn = document.getElementById('cancelNoteBtn');

// Toggle sidebar on mobile
sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('show');
});

// Handle navigation
navItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class from all nav items
        navItems.forEach(navItem => navItem.classList.remove('active'));
        
        // Add active class to clicked nav item
        item.classList.add('active');
        
        // Hide all pages
        pages.forEach(page => page.classList.remove('active'));
        
        // Show corresponding page
        const pageId = item.getAttribute('data-page');
        document.getElementById(pageId).classList.add('active');
        
        // Close sidebar on mobile after navigation
        if (window.innerWidth <= 576) {
            sidebar.classList.remove('show');
        }
    });
});

// Modal Functions
function openModal(modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
}

function closeModal(modal) {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto'; // Enable scrolling when modal is closed
}

// Event Listeners for Modals
if (addProductBtn) {
    addProductBtn.addEventListener('click', () => {
        document.getElementById('productModalTitle').textContent = 'Add New Product';
        document.getElementById('productForm').reset();
        openModal(productModal);
    });
}

if (addNoteBtn) {
    addNoteBtn.addEventListener('click', () => {
        document.getElementById('noteModalTitle').textContent = 'Add New Note';
        document.getElementById('noteForm').reset();
        openModal(noteModal);
    });
}

// Close modals with the X button
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        closeModal(modal);
    });
});

// Close modals with the Cancel button
if (cancelProductBtn) {
    cancelProductBtn.addEventListener('click', () => closeModal(productModal));
}

if (cancelNoteBtn) {
    cancelNoteBtn.addEventListener('click', () => closeModal(noteModal));
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target);
    }
});

// Handle form submissions
const productForm = document.getElementById('productForm');
const noteForm = document.getElementById('noteForm');

if (productForm) {
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const productData = {
            name: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            price: document.getElementById('productPrice').value,
            stock: document.getElementById('productStock').value,
            discount: document.getElementById('productDiscount').value,
            description: document.getElementById('productDescription').value,
            // Note: In a real application, you would handle the image upload differently
        };
        
        // Send data to the server - will be implemented in products.js
        console.log('Product data:', productData);
        
        // Close modal
        closeModal(productModal);
        
        // In a real app, you would refresh the products grid or add the new product
        alert('Product saved successfully!');
    });
}

if (noteForm) {
    noteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const noteData = {
            title: document.getElementById('noteTitle').value,
            content: document.getElementById('noteContent').value,
            date: new Date().toISOString()
        };
        
        // Send data to the server - will be implemented in notes.js
        console.log('Note data:', noteData);
        
        // Close modal
        closeModal(noteModal);
        
        // In a real app, you would refresh the notes grid or add the new note
        alert('Note saved successfully!');
    });
}

// Responsive handling
window.addEventListener('resize', () => {
    if (window.innerWidth > 576 && sidebar.classList.contains('show')) {
        sidebar.classList.remove('show');
    }
}); 