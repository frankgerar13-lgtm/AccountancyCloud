# FinanceFlow - Comprehensive Accounting & Financial Management System

## Overview

FinanceFlow is a modern, full-stack financial management application built for small to medium businesses. The system provides comprehensive accounting features including invoice management, client/vendor tracking, expense claims, bank reconciliation, purchase orders, and financial reporting. Built with a React frontend and Express.js backend, it uses PostgreSQL with Drizzle ORM for data persistence and includes Stripe integration for payment processing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

The frontend follows a component-based architecture with clear separation between pages, reusable components, and UI primitives. The application uses a sidebar navigation layout with a main content area for different modules.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API endpoints organized by resource
- **Middleware**: Custom logging, JSON parsing, and error handling
- **Development**: Hot reloading with Vite integration in development mode
- **Build**: ESBuild for production bundling

The backend uses a modular structure with separate files for routing, storage layer, and database configuration. It implements a storage interface pattern for data access abstraction.

### Data Storage Solution
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Comprehensive relational schema covering all business entities
- **Migrations**: Drizzle Kit for schema management and migrations

The database schema includes tables for users, clients, vendors, accounts (chart of accounts), bank accounts, invoices, bills, purchase orders, expense claims, bank transactions, and journal entries with proper foreign key relationships.

### Key Business Modules
- **Sales Management**: Invoice creation, client management, payment tracking
- **Purchase Management**: Bill processing, vendor management, purchase orders
- **Banking**: Bank account management, transaction imports, reconciliation
- **Expense Management**: Employee expense claims with approval workflows
- **Accounting**: Chart of accounts, journal entries, financial reporting
- **Dashboard**: Key performance metrics and business insights

### Authentication & Authorization
The application includes user management with role-based access control, though the current implementation appears to be in development with placeholder authentication logic.

## External Dependencies

### Database & ORM
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon database
- **drizzle-orm**: TypeScript ORM for database operations
- **drizzle-kit**: Database migration and schema management tools

### Payment Processing
- **@stripe/stripe-js**: Client-side Stripe integration for payment processing
- **@stripe/react-stripe-js**: React components for Stripe payment flows

### UI & Styling
- **@radix-ui/***: Comprehensive suite of unstyled, accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **clsx**: Conditional class name utility

### Data & Forms
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Performant form library with validation
- **@hookform/resolvers**: Validation resolver for React Hook Form
- **zod**: TypeScript-first schema validation

### Charts & Reporting
- **chart.js**: Canvas-based charting library (referenced but not fully implemented)
- **jspdf**: Client-side PDF generation for invoices and reports
- **date-fns**: Date manipulation and formatting utilities

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Static type checking
- **esbuild**: Fast JavaScript bundler for production
- **@replit/***: Replit-specific development plugins and tools

The application is designed to be deployed on Replit with integrated development tools and can scale with PostgreSQL as the backend database grows.