// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Setup event listeners first
    setupHistoryEventListeners();
    
    // Load history when on the history page
    if (document.getElementById('history').classList.contains('active')) {
        loadHistory();
    }
    
    // If navigating to history later, load history
    document.querySelector('[data-page="history"]').addEventListener('click', () => {
        // Show loading indicator
        const historyTable = document.getElementById('historyTableBody');
        historyTable.innerHTML = '<tr><td colspan="6" class="loading-history"><i class="fas fa-spinner fa-spin"></i><p>Loading history...</p></td></tr>';
        
        // Use setTimeout to ensure UI updates before loading history
        setTimeout(() => {
            loadHistory();
        }, 50);
    });
});

// Sample selling history data
window.demoHistory = [
    {
        id: 1,
        productName: 'Black T-Shirt',
        quantity: 2,
        price: 19.99,
        discount: 10,
        total: 35.98,
        date: '2024-03-15',
        time: '14:30'
    },
    {
        id: 2,
        productName: 'Blue Denim Jeans',
        quantity: 1,
        price: 49.99,
        discount: 0,
        total: 49.99,
        date: '2024-03-15',
        time: '15:45'
    },
    {
        id: 3,
        productName: 'White Dress Shirt',
        quantity: 3,
        price: 34.99,
        discount: 15,
        total: 89.22,
        date: '2024-03-14',
        time: '11:20'
    },
    {
        id: 4,
        productName: 'Running Shoes',
        quantity: 1,
        price: 79.99,
        discount: 0,
        total: 79.99,
        date: '2024-03-14',
        time: '16:15'
    },
    {
        id: 5,
        productName: 'Striped Polo Shirt',
        quantity: 2,
        price: 29.99,
        discount: 5,
        total: 56.98,
        date: '2024-03-13',
        time: '10:30'
    }
];

// Load history
function loadHistory() {
    const historyTable = document.getElementById('historyTableBody');
    const historySearch = document.getElementById('historySearch');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    
    // Get search term and date range
    const searchTerm = historySearch ? historySearch.value.toLowerCase() : '';
    const startDateValue = startDate ? startDate.value : '';
    const endDateValue = endDate ? endDate.value : '';
    
    // Clear the existing history
    historyTable.innerHTML = '';
    
    // Filter history by search term and date range
    let filteredHistory = [...window.demoHistory];
    
    if (searchTerm) {
        filteredHistory = filteredHistory.filter(item => 
            item.productName.toLowerCase().includes(searchTerm)
        );
    }
    
    if (startDateValue && endDateValue) {
        filteredHistory = filteredHistory.filter(item => {
            const itemDate = new Date(item.date);
            const start = new Date(startDateValue);
            const end = new Date(endDateValue);
            return itemDate >= start && itemDate <= end;
        });
    }
    
    // Add history items to the table
    if (filteredHistory.length > 0) {
        filteredHistory.forEach(item => {
            const historyRow = createHistoryRow(item);
            historyTable.appendChild(historyRow);
        });
    } else {
        // Display a message if no history found
        historyTable.innerHTML = `
            <tr>
                <td colspan="6" class="empty-table">
                    <i class="fas fa-search"></i>
                    <p>No sales history found. Try a different search or date range.</p>
                </td>
            </tr>
        `;
    }
}

// Create a history row element
function createHistoryRow(item) {
    const row = document.createElement('tr');
    
    // Format date and time
    const date = new Date(item.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.productName}</td>
        <td>${item.quantity}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>${item.discount}%</td>
        <td>$${item.total.toFixed(2)}</td>
        <td>${formattedDate} ${item.time}</td>
    `;
    
    return row;
}

// Setup event listeners for history-related functionality
function setupHistoryEventListeners() {
    const historySearch = document.getElementById('historySearch');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    
    // Search history
    if (historySearch) {
        historySearch.addEventListener('input', () => {
            loadHistory();
        });
    }
    
    // Filter by date range
    if (startDate && endDate) {
        startDate.addEventListener('change', () => {
            if (endDate.value) {
                loadHistory();
            }
        });
        
        endDate.addEventListener('change', () => {
            if (startDate.value) {
                loadHistory();
            }
        });
    }
} 