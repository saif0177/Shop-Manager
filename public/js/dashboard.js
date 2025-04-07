// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize charts if we're on the dashboard page
    if (document.getElementById('dashboard').classList.contains('active')) {
        initCharts();
    }
    
    // If navigating to dashboard later, initialize charts
    document.querySelector('[data-page="dashboard"]').addEventListener('click', initCharts);
});

// Initialize all dashboard charts
function initCharts() {
    renderSalesChart();
    renderCategoryChart();
    renderRevenueChart();
}

// Sales Overview Chart (Bar Chart)
function renderSalesChart() {
    const salesChartEl = document.getElementById('salesChart');
    
    // Clear existing chart if any
    if (salesChartEl.chart) {
        salesChartEl.chart.destroy();
    }
    
    // Sample data - in a real app, this would come from the server
    const salesData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'This Week',
            data: [650, 590, 800, 810, 560, 550, 480],
            backgroundColor: 'rgba(74, 111, 220, 0.7)',
            borderColor: 'rgba(74, 111, 220, 1)',
            borderWidth: 1
        }, {
            label: 'Last Week',
            data: [450, 390, 600, 700, 400, 490, 300],
            backgroundColor: 'rgba(108, 114, 147, 0.5)',
            borderColor: 'rgba(108, 114, 147, 1)',
            borderWidth: 1
        }]
    };
    
    // Chart configuration
    salesChartEl.chart = new Chart(salesChartEl, {
        type: 'bar',
        data: salesData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: $${context.raw}`;
                        }
                    }
                }
            }
        }
    });
}

// Top Categories Chart (Pie Chart)
function renderCategoryChart() {
    const categoryChartEl = document.getElementById('categoryChart');
    
    // Clear existing chart if any
    if (categoryChartEl.chart) {
        categoryChartEl.chart.destroy();
    }
    
    // Sample data - in a real app, this would come from the server
    const categoryData = {
        labels: ['T-shirts', 'Shirts', 'Pants', 'Shoes', 'Accessories'],
        datasets: [{
            data: [35, 25, 20, 15, 5],
            backgroundColor: [
                'rgba(74, 111, 220, 0.7)',
                'rgba(108, 114, 147, 0.7)',
                'rgba(252, 196, 25, 0.7)',
                'rgba(41, 204, 151, 0.7)',
                'rgba(235, 87, 87, 0.7)'
            ],
            borderColor: [
                'rgba(74, 111, 220, 1)',
                'rgba(108, 114, 147, 1)',
                'rgba(252, 196, 25, 1)',
                'rgba(41, 204, 151, 1)',
                'rgba(235, 87, 87, 1)'
            ],
            borderWidth: 1
        }]
    };
    
    // Chart configuration
    categoryChartEl.chart = new Chart(categoryChartEl, {
        type: 'pie',
        data: categoryData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
}

// Revenue Trends Chart (Line Chart)
function renderRevenueChart() {
    const revenueChartEl = document.getElementById('revenueChart');
    
    // Clear existing chart if any
    if (revenueChartEl.chart) {
        revenueChartEl.chart.destroy();
    }
    
    // Sample data - in a real app, this would come from the server
    const revenueData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Revenue',
            data: [15000, 17500, 14000, 16500, 19000, 18000, 20500, 21500, 23000, 19500, 22000, 24500],
            fill: false,
            borderColor: 'rgba(74, 111, 220, 1)',
            tension: 0.1,
            pointBackgroundColor: 'rgba(74, 111, 220, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4
        }]
    };
    
    // Chart configuration
    revenueChartEl.chart = new Chart(revenueChartEl, {
        type: 'line',
        data: revenueData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Revenue: $${context.raw.toLocaleString()}`;
                        }
                    }
                }
            }
        }
    });
}

// Handle window resize to redraw charts
window.addEventListener('resize', function() {
    if (document.getElementById('dashboard').classList.contains('active')) {
        // Timeout to prevent excessive redraws during resize
        if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(function() {
            initCharts();
        }, 300);
    }
}); 