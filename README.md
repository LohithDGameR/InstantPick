# Instant Pick: Your Freshness, Delivered Instantly

**Instant Pick** is an innovative web platform dedicated to providing rapid home delivery of fresh vegetables. Our core mission is to bridge the gap between local produce sellers (especially small vendors who may not have an online presence) and consumers, ensuring swift delivery, often within a specific timeframe based on the delivery person's proximity.

The name "Instant Pick" reflects our commitment to speed and convenience, signifying that products are "picked" — both literally from local vendors and figuratively by our system — almost instantly after an order is placed, and then delivered promptly to the customer's doorstep. Our goal is to make fresh produce readily available with unprecedented speed.

---

### How It Works

Instant Pick leverages a unique wallet-based system and flexible pricing model to streamline the delivery process and ensure fair compensation for vendors.

1.  **Wallet-Based System:** Customers add money to their in-app wallet for seamless transactions.
2.  **Flexible Pricing:** Product prices are displayed within a flexible range (e.g., ₹25-₹35 for 1kg tomatoes). This accounts for varying prices among different local sellers.
3.  **Smart Procurement:** Upon an order, our delivery partners visit nearby collaborating shops to procure the freshest produce, aiming to secure the best possible price within the displayed range.
4.  **Instant Delivery:** Once purchased, the vegetables are immediately delivered to the customer.
5.  **Automated Deduction:** After successful delivery, the exact amount paid for the product is deducted from the customer's wallet.

---

## Key Features

### User Features

* **User Registration and Login:** Secure account creation and access.
* **Product Browse by Category:** Easy navigation through different types of vegetables.
* **Product Search and Filtering:** Efficiently find desired items.
* **Product Detail View with Image Gallery:** Comprehensive information and visuals for each product.
* **Add to Cart, Update Quantity, and Remove Items:** Intuitive shopping cart management.
* **Address Management for Shipping:** Store and select multiple delivery addresses.
* **Multiple Payment Options:** Cash on Delivery (COD), Stripe, and Wallet for flexible payment methods.
* **Order History and Tracking:** View past orders and monitor current delivery status.
* **Wallet Balance Management:** Monitor and manage in-app wallet funds.

### Seller/Admin Features

* **Seller Login and Authentication:** Secure access for administrators/sellers.
* **Add New Products with Image Uploads:** Easily list new items with supporting visuals.
* **View and Manage Product Listings:** Oversee all available products.
* **Toggle Product Stock Availability:** Update inventory status in real-time.
* **View and Manage Customer Orders:** Process and track customer requests.

### Wallet System

* **Add Funds to Wallet:** Conveniently top-up the in-app wallet.
* **Pay for Orders using Wallet Balance:** Seamless deductions for purchases.
* **Wallet balance persists using localStorage:** Ensures continuity of funds across sessions.

---

## API Endpoints Overview

This section outlines the key API endpoints that facilitate communication between the frontend and backend.

### Orders

* `POST /api/order/cod` – Place order with Cash on Delivery
* `POST /api/order/stripe` – Place order with Stripe
* `GET /api/order/user` – Get orders for logged-in user
* `GET /api/order/seller` – Get all orders for seller
* `POST /stripe` – Stripe webhook for payment verification

### Products

* `POST /api/product/add` – Add new product (admin)
* `GET /api/product/list` – Get all products
* `POST /api/product/stock` – Toggle product stock status

### Cart

* `POST /api/cart/update` – Update user cart in DB

### Address

* `POST /api/address/add` – Add a new shipping address
* `GET /api/address/get` – Get all addresses for user

### User

* `POST /api/user/register` – Register a new user
* `POST /api/user/login` – Login user
* `GET /api/user/is-auth` – Check user authentication
* `GET /api/user/logout` – Logout user

### Seller

* `POST /api/seller/login` – Login seller
* `GET /api/seller/is-auth` – Check seller authentication
* `GET /api/seller/logout` – Logout seller

---

## Technologies Used

This project leverages a modern and robust tech stack for a performant and scalable application.

### Frontend

* **React.js:** A declarative, efficient, and flexible JavaScript library for building user interfaces.
* **Vite:** A next-generation frontend tooling that provides an extremely fast development experience.
* **React Router DOM:** For declarative routing within the React application.
* **Axios:** A promise-based HTTP client for making API requests.
* **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.
* **Lucide React:** A beautiful and consistent icon library.
* **React Hot Toast:** For elegant and responsive notifications.

### Backend

* **Node.js:** A JavaScript runtime for building scalable server-side applications.
* **Express.js:** A fast, unopinionated, minimalist web framework for Node.js.
* **MongoDB:** A NoSQL database for flexible and scalable data storage.
* **Mongoose:** An elegant MongoDB object modeling for Node.js.

### Authentication

* **JWT (JSON Web Tokens):** For secure user authentication and authorization.
* **Cookies:** Used for managing authentication tokens.
* **Bcrypt.js:** For secure password hashing.
* **Cookie Parser:** To parse cookie headers.
* **CORS:** Middleware for enabling Cross-Origin Resource Sharing.
* **Dotenv:** To load environment variables from a `.env` file.

### Payments

* **Stripe:** A powerful API for online payments.

### File Uploads

* **Cloudinary:** Cloud-based image and video management service for storing product images.
* **Multer:** Middleware for handling `multipart/form-data`, primarily used for uploading files.

### State Management

* **React Context API:** For application-wide state management.

---

## Setup Instructions

Follow these steps to get the project up and running on your local machine.

### Prerequisites

* Node.js (LTS version recommended)
* npm (comes with Node.js)
* MongoDB Atlas account (or a local MongoDB instance)
* Cloudinary account
* Stripe account

### 1. Clone the Repository

bash
git clone <YOUR_GITHUB_REPO_LINK>
cd instant-veggies # Or whatever your project folder is named


### 2. Backend Setup

Navigate into the `server` (or `backend`) directory:

bash
cd server # Or your backend folder name
npm install


Create a `.env` file in the `server` directory and add the following environment variables. Replace the placeholder values with your actual credentials.


PORT=4000
MONGO_URI=<YOUR_MONGODB_CONNECTION>
JWT_SECRET=<YOUR_JWT_SECRET_KEY>
CLOUDINARY_CLOUD_NAME=<YOUR_CLOUDINARY_CLOUD_NAME>
CLOUDINARY_API_KEY=<YOUR_CLOUDINARY_API_KEY>
CLOUDINARY_API_SECRET=<YOUR_CLOUDINARY_API_SECRET>
STRIPE_SECRET_KEY=<YOUR_STRIPE_SECRET_KEY>


To start the backend server:

bash
npm start # Or node server.js depending on your setup


The backend server should now be running on `http://localhost:4000` (or your specified port).

### 3. Frontend Setup

Open a new terminal and navigate into the `client` (or `frontend`) directory:

bash
cd ../client # Assuming you are in the server directory
npm install


Create a `.env` file in the `client` directory and add the following environment variables:


VITE_BACKEND_URL=http://localhost:4000/api # Adjust if your backend runs on a different port or path
VITE_STRIPE_PUBLISHABLE_KEY=<YOUR_STRIPE_PUBLISHABLE_KEY>


To start the frontend development server:

bash
npm run dev


The frontend application should now be accessible at `http://localhost:5173` (or the port Vite assigns).

---

## Important URLs

* **Seller Dashboard:** Access the seller dashboard by appending `/seller` to the base URL: `http://localhost:5173/seller`
* **Delivery Dashboard:** Access the delivery dashboard by appending `/delivery` to the base URL: `http://localhost:5173/delivery`

---

## Resources Used

These websites were instrumental in collecting resources for this project:

1.  **[cleanpng.com](https://www.cleanpng.com/)**: For transparent PNG images.
2.  **[icons8.com](http://icons8.com/)**: For various icons used throughout the application.

---

## Team Contributions

This project was a collaborative effort, with each member making significant contributions:

* **Pavani Ponnuri:** Led the development of core frontend **homepage components**, including `navabar.jsx`, `mainbanner.jsx`, `bestseller.jsx`, and `categories.jsx`.
* **Prasanna Priya:** Contributed to various **frontend sections** such as `BottomBanner.jsx`, `NewsLetter.jsx`, `Footer.jsx`, `login.jsx`, `AllProducts.jsx`, and `ProductCategory.jsx`.
* **Seeram Srinivas:** Implemented crucial **user-centric features** on the frontend, specifically `MyOrder.jsx` and `AddAddress.jsx`.
* **Lohith Kallapalli:** Developed the **Admin Dashboard**, encompassing components like `SellerLogin.jsx`, `SellerLayout.jsx`, `AddProducts.jsx`, `MyProducts.jsx`, and `Orders.jsx`. Additionally, Lohith was responsible for significant portions of the **backend logic**, including the integration of the Stripe payment gateway and connecting the backend with the frontend.
* **Deepak CR:** Contributed approximately 80% of the **backend development**, building the robust foundation of the application's server-side operations, including `server.js`, **controllers, models, routes, and middlewares.**

---

## Demo

Here's a glimpse of the project in action:

### Screenshots Include

* Homepage
* Product Listing
* Product Detail
* Cart Page
* Admin Dashboard

---

### Project Demo Video

https://drive.google.com/file/d/12oEDQr5ml3kVHxBuB79yvxUw64OiS4yf/view?usp=drivesdk
