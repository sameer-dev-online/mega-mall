# 🛍️ Mega Mall E-commerce Platform

<div align="center">
  <h3>Your Ultimate Shopping Destination</h3>
  <p>A comprehensive e-commerce platform built with Next.js, providing a seamless shopping experience for users and powerful management tools for administrators.</p>

  [![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
</div>

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Technology Stack](#-technology-stack)
- [Features](#-features)
- [Installation Instructions](#-installation-instructions)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Admin Panel](#-admin-panel)
- [Environment Variables](#-environment-variables)
- [Contributing Guidelines](#-contributing-guidelines)
- [License Information](#-license-information)
- [Screenshots](#-screenshots)

---

## 🚀 Project Overview

Mega Mall is a modern, full-stack e-commerce platform designed to provide an exceptional shopping experience. Built with cutting-edge technologies, it offers a responsive design, intuitive user interface, and comprehensive administrative capabilities.

### Key Highlights

- **Modern Architecture**: Built with Next.js 15 and React 19 for optimal performance
- **Type Safety**: Full TypeScript implementation for robust development
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **AI-Powered Features**: Intelligent product suggestions and recommendations
- **Role-Based Access**: Secure admin panel with granular permissions
- **Real-time Updates**: Dynamic cart management and order tracking

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15.3.4 with App Router
- **Language**: TypeScript 5.0
- **UI Library**: React 19.0
- **Styling**: Tailwind CSS 4.0
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives

### Backend & API
- **API Routes**: express js with ts api routes
- **HTTP Client**: Axios with interceptors
- **Authentication**: JWT tokens with localStorage
- **Image Hosting**: Cloudinary integration

### Development Tools
- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript strict mode
- **Package Manager**: npm/yarn
- **Build Tool**: Next.js with Turbopack

### External Services
- **Database**: MongoDB
- **Image CDN**: Cloudinary, Pinterest
- **Notifications**: React Toastify

---

## ✨ Features

### 🔐 User Authentication & Management
- **Secure Registration**: Email verification with OTP
- **User Login/Logout**: JWT-based authentication
- **Profile Management**: Update personal information, preferences
- **Password Management**: Change password functionality
- **Address Management**: Multiple shipping addresses
- **Privacy Settings**: Customizable privacy preferences

### 🛒 Product Management
- **Product Browsing**: Advanced search, filter, and sort capabilities
- **Product Details**: Comprehensive product information pages
- **AI-Powered Suggestions**: Intelligent product recommendations
- **Image Gallery**: Multiple product images with zoom functionality
- **Category Navigation**: Organized product categories
- **Wishlist**: Save products for later

### 🛍️ Shopping Cart & Checkout
- **Dynamic Cart**: Add, remove, update quantities
- **Real-time Calculations**: Automatic price calculations and discounts
- **Persistent Cart**: Cart state maintained across sessions
- **Secure Checkout**: Streamlined checkout process
- **Multiple Payment Options**: Various payment methods support
- **Order Summary**: Detailed order breakdown

### 📦 Order Management
- **Order Creation**: Seamless order placement
- **Order Tracking**: Real-time order status updates
- **Order History**: Complete order history for users
- **Order Cancellation**: Cancel orders within allowed timeframe
- **Delivery Status**: Track shipment progress
- **Order Details**: Comprehensive order information

### 👨‍💼 Admin Panel
- **Dashboard**: Comprehensive analytics and statistics
- **User Management**: Full CRUD operations for users
- **Product Management**: Add, edit, delete products with image upload
- **Order Management**: Process and update order statuses
- **Role-Based Access**: Admin and Super Admin roles
- **Admin Registration**: Admin-to-admin signup functionality
- **Sales Analytics**: Revenue tracking and top-selling products
- **Message System**: Communication with customers

### 🤖 AI-Powered Features
- **Product Suggestions**: AI-driven product recommendations
- **Image Upload**: Auto-populate product details from images
- **Smart Search**: Enhanced search with AI assistance
- **Personalized Experience**: Tailored content based on user behavior

---

## 📥 Installation Instructions

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js**: Version 18.18.0 or higher (recommended: 20.0.0+)
- **Package Manager**: npm (comes with Node.js) or yarn
- **Git**: For cloning the repository

### Setup Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/mega-mall.git
   cd mega-mall
   ```

2. **Install Dependencies**
   ```bash
   # Using npm
   npm install

   # Using yarn
   yarn install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the project root:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api

   # Add other environment variables as needed
   # NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   # NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
   ```

4. **Start Development Server**
   ```bash
   # Using npm
   npm run dev

   # Using yarn
   yarn dev
   ```

5. **Open Application**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Linting

```bash
# Run ESLint
npm run lint
```

---

## 📁 Project Structure

```
mega-mall/
├── public/                     # Static assets
│   ├── images/                # Image assets
│   └── *.svg                  # Icon files
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── admin/            # Admin panel pages
│   │   ├── cart/             # Shopping cart page
│   │   ├── checkout/         # Checkout process
│   │   ├── orders/           # Order management
│   │   ├── product/          # Product pages
│   │   ├── profile/          # User profile
│   │   ├── shop/             # Shop/catalog pages
│   │   ├── signin/           # Authentication
│   │   ├── signup/           # User registration
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── globals.css       # Global styles
│   ├── components/           # Reusable components
│   │   ├── admin/           # Admin-specific components
│   │   ├── cart/            # Cart components
│   │   ├── checkout/        # Checkout components
│   │   ├── home/            # Homepage components
│   │   ├── product/         # Product components
│   │   ├── profile/         # Profile components
│   │   ├── shop/            # Shop components
│   │   ├── ui/              # UI primitives
│   │   ├── Footer.tsx       # Site footer
│   │   ├── NavBar.tsx       # Navigation bar
│   │   └── ProtectedRoute.tsx # Route protection
│   ├── contexts/            # React contexts
│   │   ├── admin/           # Admin context
│   │   ├── AuthContext.tsx  # User authentication
│   │   └── CartContext.tsx  # Shopping cart state
│   ├── lib/                 # Utility libraries
│   │   ├── axious.ts        # Axios configuration
│   │   └── utils.ts         # Helper utilities
│   ├── services/            # API services
│   │   ├── Api/             # API service modules
│   │   │   ├── adminService.ts    # Admin operations
│   │   │   ├── cartService.ts     # Cart operations
│   │   │   ├── messageService.ts  # Messaging
│   │   │   ├── orderService.ts    # Order operations
│   │   │   ├── productService.ts  # Product operations
│   │   │   ├── userService.ts     # User operations
│   │   │   └── index.ts           # Service exports
│   │   └── README.md        # API documentation
│   ├── types/               # TypeScript definitions
│   │   ├── api.ts           # API type definitions
│   │   └── order.ts         # Order type definitions
│   └── utils/               # Utility functions
│       └── orderUtils.ts    # Order-related utilities
├── components.json          # Shadcn/ui configuration
├── eslint.config.mjs       # ESLint configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies and scripts
├── postcss.config.mjs      # PostCSS configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

### Key Directories

- **`src/app/`**: Next.js 13+ App Router pages and layouts
- **`src/components/`**: Reusable React components organized by feature
- **`src/contexts/`**: React Context providers for global state management
- **`src/services/`**: API service layer with organized endpoint calls
- **`src/types/`**: TypeScript type definitions and interfaces
- **`src/lib/`**: Utility libraries and configurations

---

## 🔌 API Documentation

The application uses a service-oriented architecture with organized API calls. All services are located in `src/services/Api/`.

### Available Services

#### User Service (`userService`)
```typescript
// Authentication
userService.signUp(data: SignUpData)
userService.signIn(data: SignInData)
userService.verifyOtp(userId: string, otp: string)
userService.logout()

// Profile Management
userService.getUser()
userService.updateProfile(data: UpdateProfileData)
userService.changePassword(data: ChangePasswordData)
```

#### Product Service (`productService`)
```typescript
// Product Operations
productService.getAllProducts(params?: ProductQueryParams)
productService.getProductById(id: string)
productService.searchProducts(query: string)
productService.getProductsByCategory(category: string)
```

#### Cart Service (`cartService`)
```typescript
// Cart Management
cartService.getCart()
cartService.addToCart(productId: string, quantity: number)
cartService.updateCartItem(itemId: string, quantity: number)
cartService.removeFromCart(itemId: string)
cartService.clearCart()
```

#### Order Service (`orderService`)
```typescript
// Order Operations
orderService.createOrder(orderData: CreateOrderData)
orderService.getUserOrders()
orderService.getOrderById(orderId: string)
orderService.cancelOrder(orderId: string)
```

#### Admin Service (`adminService`)
```typescript
// Admin Authentication
adminService.signUp(data: AdminSignUpData)
adminService.login(data: SignInData)
adminService.logout()

// Admin Operations
adminService.getDashboardStats()
adminService.getAllUsers(params?: QueryParams)
adminService.getAllOrders(params?: QueryParams)
adminService.updateDeliveryStatus(data: UpdateDeliveryStatusData)

// Product Management
adminService.uploadProduct(data: ProductUploadData)
adminService.updateProduct(id: string, data: ProductUpdateData)
adminService.deleteProduct(id: string)
```

### API Configuration

The API base URL is configured through environment variables:

```typescript
// Default configuration
baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'
```

### Authentication

- **User Authentication**: JWT tokens stored in `localStorage` as `token`
- **Admin Authentication**: JWT tokens stored in `localStorage` as `admin_token`
- **Automatic Token Management**: Axios interceptors handle token attachment
- **Token Refresh**: Automatic logout on 401 responses

---

## 👨‍💼 Admin Panel

The admin panel provides comprehensive management capabilities for the e-commerce platform.

### Access & Authentication

- **URL**: `/admin`
- **Authentication**: Separate admin login system
- **Roles**: Admin and Super Admin with different permissions
- **Registration**: Admin-to-admin signup functionality

### Admin Features

#### Dashboard
- **Sales Analytics**: Revenue tracking and statistics
- **Order Overview**: Recent orders and status updates
- **User Metrics**: User registration and activity stats
- **Top Products**: Best-selling products analysis

#### User Management
- **View All Users**: Paginated user list with search
- **User Details**: Comprehensive user information
- **User Actions**: Enable/disable user accounts
- **User Analytics**: Registration trends and activity

#### Product Management
- **Add Products**: Rich product creation with image upload
- **Edit Products**: Update product information and images
- **Delete Products**: Remove products from catalog
- **Inventory Management**: Stock level tracking
- **Category Management**: Organize products by categories

#### Order Management
- **Order Processing**: Update order statuses
- **Delivery Tracking**: Manage shipment status
- **Order Details**: View comprehensive order information
- **Order Analytics**: Sales performance metrics

#### Admin Management (Super Admin only)
- **Add Admins**: Create new admin accounts
- **Manage Permissions**: Assign roles and permissions
- **Admin Activity**: Track admin actions and logs

### Admin Panel Structure

```
src/app/admin/
├── dashboard/              # Admin dashboard
├── users/                  # User management
├── products/               # Product management
├── orders/                 # Order management
├── admins/                 # Admin management
└── layout.tsx              # Admin layout
```

---

## 🔧 Environment Variables

Create a `.env.local` file in the project root with the following variables:

### Required Variables

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

### Optional Variables

```env
# Image Hosting (if using Cloudinary)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payment Integration (if using Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Analytics (if using Google Analytics)
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_measurement_id

# Email Service (if using SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_verified_sender_email
```

### Environment Variable Usage

- **`NEXT_PUBLIC_*`**: Variables accessible in the browser
- **Server-only**: Variables only accessible in server-side code
- **Security**: Never commit `.env.local` to version control

---

## 🤝 Contributing Guidelines

We welcome contributions to the Mega Mall project! Please follow these guidelines:

### Getting Started

1. **Fork the Repository**
   ```bash
   git fork https://github.com/your-username/mega-mall.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Follow the existing code style
   - Add appropriate TypeScript types
   - Include comments for complex logic

4. **Test Your Changes**
   ```bash
   npm run lint
   npm run build
   ```

5. **Commit Your Changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```

6. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Standards

- **TypeScript**: Use strict typing, avoid `any`
- **Components**: Use functional components with hooks
- **Styling**: Use Tailwind CSS classes
- **Naming**: Use descriptive, camelCase names
- **Comments**: Document complex logic and APIs

### Commit Convention

Follow conventional commits:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation updates
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/updates
- `chore:` Maintenance tasks

### Pull Request Process

1. Ensure your code passes all linting checks
2. Update documentation if needed
3. Add tests for new features
4. Request review from maintainers
5. Address feedback promptly

---
### Third-Party Licenses

This project uses several open-source libraries. Please refer to their respective licenses:

- **Next.js**: MIT License
- **React**: MIT License
- **Tailwind CSS**: MIT License
- **TypeScript**: Apache License 2.0
- **Radix UI**: MIT License
- **Lucide React**: ISC License

---


## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Import your GitHub repository to Vercel
   - Configure environment variables in Vercel dashboard

2. **Deploy**
   ```bash
   # Automatic deployment on push to main branch
   git push origin main
   ```

### Other Platforms

The application can be deployed on any platform that supports Next.js:

- **Netlify**: Static site generation support
- **AWS Amplify**: Full-stack deployment
- **Railway**: Container-based deployment
- **DigitalOcean App Platform**: Managed deployment

---


## 🙏 Acknowledgments

- **Next.js Team**: For the amazing framework
- **Vercel**: For hosting and deployment platform
- **Tailwind CSS**: For the utility-first CSS framework
- **Radix UI**: For accessible UI primitives
- **Lucide**: For beautiful icons
- **Open Source Community**: For the incredible tools and libraries

---

<div align="center">
  <p>Made with ❤️ by Abdul Sameer.</p>
  <p>⭐ Star this repository if you found it helpful!</p>
</div>