# Shop Management Website

A user-friendly, responsive shop management website for sellers to manage their products, track orders, and make notes.

## Features

- **Responsive Design**: Fully responsive on mobile, tablet, and PC
- **Dashboard**: Visual charts showing business performance
- **Product Management**: Add, edit, delete products with discount options
- **Order History**: Track past orders with filtering options
- **Notes**: Keep track of important notes and reminders
- **Server-Side Storage**: Data is stored on a secure server

## Screenshots

![Dashboard](screenshots/dashboard.png)
![Products](screenshots/products.png)
![Order History](screenshots/history.png)
![Notes](screenshots/notes.png)

## Technologies Used

- HTML5, CSS3, JavaScript (ES6+)
- Chart.js for data visualization
- Font Awesome for icons
- Node.js and Express for the backend
- RESTful API for data storage and retrieval

## Installation

1. Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

2. Clone this repository:
   ```
   git clone https://github.com/yourusername/shop-management-website.git
   cd shop-management-website
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the server:
   ```
   npm start
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## API Endpoints

The following API endpoints are available:

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a specific product
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

### Orders

- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get a specific order
- `POST /api/orders` - Create a new order
- `PUT /api/orders/:id` - Update an order

### Notes

- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get a specific note
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

## Future Enhancements

- User authentication and authorization
- Database integration (MongoDB)
- Advanced filtering and sorting options
- Export data to PDF/Excel
- Inventory management alerts
- Customer management system

## License

This project is licensed under the MIT License - see the LICENSE file for details. 