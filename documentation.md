# Nastan.mk - Modern Web Application Documentation

## Table of Contents

1. Introduction
   - Project Overview
   - Technology Stack
   - System Requirements

2. Architecture Overview
   - Project Structure
   - Design Patterns
   - Key Components

3. Technology Stack Deep Dive
   - Next.js 15.3
   - React 18
   - TypeScript
   - Tailwind CSS
   - Firebase Integration
   - Additional Libraries

4. Project Structure and Organization
   - Directory Layout
   - Component Organization
   - File Naming Conventions
   - Code Organization Principles

5. Core Features
   - Routing System
   - Authentication
   - Image Optimization
   - API Integration
   - State Management
   - Performance Optimization

6. Component Library
   - Common Components
   - Feature Components
   - Layout Components
   - UI Components

7. Image Handling and Optimization
   - WebP Implementation
   - Lazy Loading
   - Responsive Images
   - Best Practices

8. Styling and Design System
   - Tailwind Configuration
   - Custom Components
   - Theme Management
   - Responsive Design

9. Authentication and Authorization
   - Firebase Authentication
   - Protected Routes
   - User Roles
   - Security Measures

10. Performance Optimization
    - Image Optimization
    - Code Splitting
    - Lazy Loading
    - Caching Strategies

11. Development Workflow
    - Setup Instructions
    - Development Commands
    - Build Process
    - Deployment

12. Best Practices and Conventions
    - Coding Standards
    - Git Workflow
    - Testing Strategy
    - Documentation

## 1. Introduction

### Project Overview
Nastan.mk is a modern web application built using Next.js and React, designed to provide a seamless user experience with optimized performance and responsive design. The project implements various modern web development practices and technologies to create a scalable and maintainable application.

### Technology Stack
- **Frontend Framework**: Next.js 15.3
- **UI Library**: React 18
- **Programming Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend Services**: Firebase
- **Authentication**: Firebase Authentication
- **State Management**: React Context API
- **Image Optimization**: Next.js Image Component
- **Animation**: Framer Motion
- **UI Components**: Radix UI
- **Development Tools**: ESLint, PostCSS

### System Requirements
- Node.js 18.x or higher
- npm 8.x or higher
- Git for version control
- Modern web browser
- Code editor (VS Code recommended)

## 2. Architecture Overview

### Project Structure
The project follows a modular architecture with clear separation of concerns:

```
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication related pages
│   ├── (dashboard)/       # Dashboard related pages
│   └── api/               # API routes
├── components/            # React components
│   ├── common/           # Shared components
│   ├── features/         # Feature-specific components
│   ├── layouts/          # Layout components
│   └── ui/               # UI components
├── lib/                   # Utility functions
│   ├── config/           # Configuration files
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API services
│   └── utils/            # Helper functions
├── public/               # Static assets
│   └── images/          # Optimized images
├── styles/               # Global styles
└── types/                # TypeScript definitions
```

### Design Patterns
1. **Component Composition**: Building complex UIs from simple, reusable components
2. **Container/Presenter Pattern**: Separating logic from presentation
3. **Custom Hooks**: Extracting reusable stateful logic
4. **Context API**: Managing global state
5. **Render Props**: Sharing component logic

### Key Components

#### OptimizedImage Component
```typescript
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  fill?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}
```

This component handles:
- Automatic WebP conversion
- Lazy loading
- Blur-up loading effect
- Responsive sizing
- Quality control

## 3. Technology Stack Deep Dive

### Next.js 15.3
- App Router
- Server Components
- API Routes
- Image Optimization
- Static Site Generation
- Incremental Static Regeneration

### React 18
- Concurrent Features
- Automatic Batching
- Transitions
- Suspense
- Server Components

### TypeScript
- Strict Type Checking
- Interface Definitions
- Type Safety
- Enhanced IDE Support

### Tailwind CSS
- Utility-First Approach
- Custom Configuration
- Component Classes
- Responsive Design
- Dark Mode Support

### Firebase Integration
- Authentication
- Firestore Database
- Storage
- Cloud Functions
- Security Rules

## 4. Project Structure and Organization

### Directory Layout
Detailed explanation of each directory:

#### App Directory
- `app/page.tsx`: Main entry point
- `app/layout.tsx`: Root layout
- `app/Provider.tsx`: Context providers
- `app/middleware.ts`: Request middleware

#### Components Directory
- Common components (buttons, inputs)
- Feature components (specific features)
- Layout components (headers, footers)
- UI components (from design system)

#### Lib Directory
- Configuration files
- Custom hooks
- API services
- Utility functions

## 5. Core Features

### Routing System
Next.js App Router implementation:
```typescript
// app/page.tsx
export default function Home() {
  return (
    <main>
      <h1>Welcome to Nastan.mk</h1>
    </main>
  );
}
```

### Authentication
Firebase Authentication integration:
```typescript
// lib/firebase/auth.ts
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();
```

### Image Optimization
Next.js Image component with WebP support:
```typescript
// next.config.mjs
const nextConfig = {
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  }
};
```

## 6. Component Library

### Common Components
Reusable components used throughout the application:
- Buttons
- Input fields
- Cards
- Navigation elements

### Feature Components
Components specific to features:
- User profile
- Post creation
- Session management
- Shared components

### Layout Components
Components that define the application structure:
- Headers
- Footers
- Sidebars
- Navigation menus

## 7. Image Handling and Optimization

### WebP Implementation
Automatic WebP conversion for modern browsers:
```typescript
// components/common/OptimizedImage.tsx
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  quality = 85,
  fill = false,
  objectFit = 'cover',
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  // Implementation details...
}
```

### Lazy Loading
Implementing lazy loading for better performance:
- Using Intersection Observer
- Priority loading for above-the-fold images
- Loading state management

## 8. Styling and Design System

### Tailwind Configuration
Custom Tailwind CSS configuration:
```javascript
// tailwind.config.ts
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Custom theme extensions
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('daisyui'),
  ],
};
```

### Custom Components
Building consistent UI components:
- Button variants
- Input styles
- Card designs
- Typography system

## 9. Authentication and Authorization

### Firebase Authentication
Implementation of authentication flows:
- Google Sign-in
- Email/Password
- Social authentication
- Session management

### Protected Routes
Securing routes and content:
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // Authentication and authorization logic
}
```

## 10. Performance Optimization

### Image Optimization
Strategies implemented:
- WebP format
- Responsive sizes
- Lazy loading
- Quality optimization

### Code Splitting
Implementing code splitting:
- Dynamic imports
- Route-based splitting
- Component-level splitting

## 11. Development Workflow

### Setup Instructions
```bash
# Clone repository
git clone <repository-url>

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

### Development Commands
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run linting

## 12. Best Practices and Conventions

### Coding Standards
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Component naming conventions

### Git Workflow
- Branch naming conventions
- Commit message format
- Pull request process
- Code review guidelines

### Testing Strategy
- Unit testing
- Integration testing
- End-to-end testing
- Performance testing

## Conclusion

This documentation provides a comprehensive overview of the Nastan.mk project, its architecture, and implementation details. The project demonstrates modern web development practices, focusing on performance, maintainability, and user experience.

For any questions or clarifications, please refer to the project repository or contact the development team. 