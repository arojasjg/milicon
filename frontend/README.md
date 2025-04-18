# Frontend for miliconstore E-commerce

This is the React-based frontend for our milicons e-commerce application. The frontend communicates with various microservices through the API Gateway.

## Setup and Installation

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

## Key Features

- User registration and authentication
- Product browsing and searching
- Shopping cart functionality
- Checkout process
- User profile management
- Order history
- Admin dashboard for product, order, and user management
- Product recommendations

## Development Guidelines

### Code Structure

- **components/**: Reusable UI components
- **pages/**: Complete page components that use smaller components
- **redux/**: Redux state management (slices, store, etc.)
- **services/**: API service calls
- **utils/**: Utility functions
- **assets/**: Static assets (images, fonts, etc.)

### Form Validation

All forms should implement client-side validation:

- Required fields should be clearly marked
- Validation errors should be displayed below the respective fields
- Use the `.input-error` class for styling error fields
- Use the `.error-message` class for styling error messages

### Responsive Design

All components should be responsive and work well on:

- Desktop (1024px and above)
- Tablet (768px to 1023px)
- Mobile (below 768px)

### Testing

- Write unit tests for all components using Jest and React Testing Library
- Ensure tests cover both happy paths and error handling

## Available Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run linter
npm run lint

# Format code with Prettier
npm run format
```

## API Integration

All API calls to the backend should go through the API gateway at:

- Development: `http://localhost:8080/api`
- Production: Configured through environment variables

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Ensure linting passes
5. Submit a pull request
