# Contributing to BukidGo

Thank you for your interest in contributing to BukidGo! This document provides guidelines and information for contributors.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please read it before contributing.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected behavior**
- **Actual behavior**
- **Screenshots** if applicable
- **Environment details** (OS, browser, Node.js version)

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- **Clear title and description**
- **Use case** and motivation
- **Detailed explanation** of the proposed feature
- **Mockups or examples** if applicable

### Pull Requests

1. **Fork** the repository
2. **Create a branch** from `main` for your feature/fix
3. **Make your changes** following our coding standards
4. **Add tests** for new functionality
5. **Update documentation** as needed
6. **Run the test suite** to ensure everything passes
7. **Submit a pull request**

#### Pull Request Guidelines

- Use a clear and descriptive title
- Reference any related issues
- Provide a detailed description of changes
- Include screenshots for UI changes
- Ensure all tests pass
- Keep changes focused and atomic

## Development Setup

### Prerequisites

- Node.js 18+
- npm 8+
- Git

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/your-username/bukidgo.git
cd bukidgo

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

### Development Workflow

```bash
# Create a new branch
git checkout -b feature/your-feature-name

# Make your changes
# ...

# Run tests
npm run test

# Run linting
npm run lint

# Run type checking
npm run type-check

# Run all checks
npm run validate

# Commit your changes
git add .
git commit -m "feat: add your feature description"

# Push to your fork
git push origin feature/your-feature-name
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type when possible
- Use strict mode settings

### React

- Use functional components with hooks
- Follow React best practices
- Use proper prop types
- Implement error boundaries where appropriate

### Styling

- Use Tailwind CSS classes
- Follow the existing design system
- Ensure responsive design
- Test on multiple screen sizes

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Format code
npm run lint:fix

# Check formatting
npm run lint
```

### Commit Messages

Follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(auth): add Google OAuth integration
fix(ui): resolve mobile navigation issue
docs(readme): update installation instructions
```

## Testing

### Unit Tests

- Write tests for new functions and components
- Use Vitest for unit testing
- Aim for good test coverage
- Test edge cases and error conditions

```bash
# Run unit tests
npm run test

# Run with coverage
npm run test:coverage
```

### E2E Tests

- Write E2E tests for critical user flows
- Use Playwright for E2E testing
- Test on multiple browsers

```bash
# Run E2E tests
npm run test:e2e
```

## Documentation

### Code Documentation

- Add JSDoc comments for functions and classes
- Document complex logic and algorithms
- Keep comments up to date with code changes

### README Updates

- Update README for new features
- Include setup instructions for new dependencies
- Add examples for new APIs

## Project Structure

```
bukidgo/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── __tests__/      # Component tests
│   │   └── ComponentName.tsx
│   ├── contexts/           # React contexts
│   ├── lib/               # Utilities and configurations
│   │   ├── __tests__/     # Utility tests
│   │   └── utility.ts
│   ├── pages/             # Route components
│   └── types.ts           # Type definitions
├── e2e/                   # End-to-end tests
├── public/                # Static assets
└── docs/                  # Additional documentation
```

## Component Guidelines

### Creating New Components

1. Create component file in appropriate directory
2. Add TypeScript interfaces for props
3. Implement component with proper error handling
4. Add unit tests
5. Update Storybook stories if applicable
6. Document usage in README or docs

### Component Structure

```tsx
import React from 'react';
import { ComponentProps } from './types';

interface Props extends ComponentProps {
  // Component-specific props
}

export default function ComponentName({ prop1, prop2 }: Props) {
  // Component implementation
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

## API Guidelines

### Adding New Endpoints

1. Define route in server.ts
2. Add input validation with Zod
3. Implement proper error handling
4. Add rate limiting if needed
5. Write tests for the endpoint
6. Update API documentation

### Error Handling

- Use consistent error response format
- Provide meaningful error messages
- Log errors appropriately
- Handle edge cases gracefully

## Performance Guidelines

### Frontend Performance

- Use React.memo for expensive components
- Implement proper loading states
- Optimize images and assets
- Use code splitting for large features

### Backend Performance

- Implement caching where appropriate
- Use database indexes effectively
- Monitor API response times
- Optimize expensive operations

## Security Guidelines

- Validate all user inputs
- Use parameterized queries
- Implement proper authentication
- Follow OWASP security guidelines
- Never commit secrets to version control

## Release Process

1. **Feature Development**: Work on feature branches
2. **Code Review**: All changes require review
3. **Testing**: Automated tests must pass
4. **Integration**: Merge to main branch
5. **Deployment**: Automated deployment to staging
6. **Validation**: Manual testing on staging
7. **Production**: Deploy to production

## Getting Help

- **Documentation**: Check the README and docs/
- **Issues**: Search existing GitHub issues
- **Discussions**: Use GitHub Discussions for questions
- **Discord**: Join our community Discord server
- **Email**: Contact maintainers at dev@bukidgo.com

## Recognition

Contributors will be recognized in:
- README contributors section
- Release notes for significant contributions
- Annual contributor appreciation posts

Thank you for contributing to BukidGo! 🏔️