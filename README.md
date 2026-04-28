# 🏔️ BukidGo - Premium Travel & Tourism Platform

[![CI/CD Pipeline](https://github.com/your-org/bukidgo/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/your-org/bukidgo/actions)
[![codecov](https://codecov.io/gh/your-org/bukidgo/branch/main/graph/badge.svg)](https://codecov.io/gh/your-org/bukidgo)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

A modern, full-stack travel platform showcasing the natural beauty and cultural richness of Bukidnon, Philippines. Built with React, TypeScript, Firebase, and powered by AI for personalized itinerary generation.

## ✨ Features

- 🗺️ **Interactive Destination Explorer** - Discover 25+ curated destinations with detailed information
- 🤖 **AI-Powered Itinerary Generator** - Personalized travel plans using Google Gemini AI
- 🍽️ **Local Food Guide** - Authentic Bukidnon cuisine and restaurant recommendations
- 🎉 **Events Calendar** - Cultural festivals and local events
- 👥 **Local Guide Booking** - Connect with certified local guides
- 📱 **Responsive Design** - Optimized for all devices
- 🔐 **Secure Authentication** - Firebase Auth with multiple providers
- ⚡ **Performance Optimized** - Fast loading with modern web technologies
- 🌐 **PWA Ready** - Progressive Web App capabilities

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 8+
- Firebase project with Firestore and Authentication
- Google Gemini API key (optional, falls back to mock data)
- Google Maps API key (for map features)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/bukidgo.git
cd bukidgo

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Configure your environment variables in .env
# VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
# GEMINI_API_KEY=your_gemini_api_key
# APP_URL=http://localhost:3000

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 19 with TypeScript
- Tailwind CSS for styling
- Motion (Framer Motion) for animations
- React Router for navigation
- React Error Boundary for error handling

**Backend:**
- Express.js server
- Firebase Firestore (database)
- Firebase Authentication
- Google Gemini AI integration

**Development & Production:**
- Vite for build tooling
- Vitest for unit testing
- Playwright for E2E testing
- ESLint + Prettier for code quality
- Docker for containerization
- GitHub Actions for CI/CD

### Project Structure

```
bukidgo/
├── src/
│   ├── components/          # Reusable UI components
│   ├── contexts/           # React contexts (Firebase, etc.)
│   ├── lib/               # Utilities and configurations
│   ├── pages/             # Route components
│   ├── test/              # Test utilities and setup
│   └── types.ts           # TypeScript type definitions
├── e2e/                   # End-to-end tests
├── public/                # Static assets
├── logs/                  # Application logs (production)
└── dist/                  # Built application (generated)
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run all tests and checks
npm run validate
```

## 📦 Building & Deployment

### Development Build

```bash
npm run build
npm run preview
```

### Docker Deployment

```bash
# Build and run with Docker
docker build -t bukidgo .
docker run -p 3000:3000 --env-file .env bukidgo

# Or use Docker Compose
docker-compose up -d
```

### Production Deployment

The application is production-ready with:

- **Security**: Helmet.js, CORS, rate limiting, input validation
- **Performance**: Gzip compression, static asset caching, code splitting
- **Monitoring**: Structured logging, health checks, error tracking
- **Scalability**: Stateless design, Docker containerization

#### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Server port (default: 3000) | No |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key | Yes |
| `GEMINI_API_KEY` | Google Gemini AI API key | No* |
| `APP_URL` | Application base URL | Yes |

*Falls back to mock data if not provided

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore Database and Authentication
3. Download the configuration and update `firebase-applet-config.json`
4. Set up Firestore security rules (see `firestore.rules`)

### Google Maps Setup

1. Create a project in [Google Cloud Console](https://console.cloud.google.com)
2. Enable Maps JavaScript API
3. Create an API key and add it to your environment variables

### Gemini AI Setup (Optional)

1. Get API access at [Google AI Studio](https://makersuite.google.com)
2. Generate an API key and add it to your environment variables

## 🛡️ Security

- **Input Validation**: Zod schemas for all user inputs
- **Authentication**: Firebase Auth with secure session management
- **Authorization**: Role-based access control (User/Admin/Guide)
- **HTTPS**: Enforced in production with security headers
- **Rate Limiting**: API and general request limiting
- **Content Security Policy**: Prevents XSS attacks
- **Dependency Scanning**: Automated vulnerability checks

## 📊 Monitoring & Analytics

- **Application Logs**: Structured JSON logging with Winston
- **Error Tracking**: Comprehensive error boundary with context
- **Performance**: Firebase Performance Monitoring
- **Analytics**: Firebase Analytics (production only)
- **Health Checks**: `/health` endpoint for monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the coding standards
4. Run tests (`npm run validate`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Standards

- Follow TypeScript best practices
- Use Prettier for code formatting
- Follow ESLint rules
- Write tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Bukidnon Tourism Office** - For destination information and support
- **Local Communities** - For cultural insights and authentic experiences
- **Contributors** - Everyone who helped make this project possible

## 📞 Support

- **Documentation**: [Wiki](https://github.com/your-org/bukidgo/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-org/bukidgo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/bukidgo/discussions)
- **Email**: support@bukidgo.com

---

**Made with ❤️ for Bukidnon, Philippines**

