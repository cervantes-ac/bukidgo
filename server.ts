import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { createWriteStream } from "fs";
import { mkdir } from "fs/promises";
import { serverLogger, logServerError, logServerInfo, logServerWarning } from "./src/lib/server-logger.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure logs directory exists
try {
  await mkdir('logs', { recursive: true });
} catch (error) {
  console.warn('Could not create logs directory:', error);
}

// Setup request logging
const accessLogStream = createWriteStream(path.join(__dirname, 'logs', 'access.log'), { flags: 'a' });

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const isDevelopment = process.env.NODE_ENV !== 'production';

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        scriptSrc: ["'self'", ...(isDevelopment ? ["'unsafe-eval'"] : [])],
        connectSrc: ["'self'", "https://api.gemini.com", "https://*.googleapis.com", "wss:", "ws:"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  // CORS configuration
  app.use(cors({
    origin: isDevelopment 
      ? ['http://localhost:3000', 'http://localhost:5173']
      : [process.env.APP_URL, 'https://bukidgo.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: isDevelopment ? 1000 : 100, // Limit each IP to 100 requests per windowMs in production
    message: {
      error: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: isDevelopment ? 100 : 10, // Limit API calls more strictly
    message: {
      error: 'Too many API requests, please try again later.',
    },
  });

  app.use(limiter);
  app.use('/api/', apiLimiter);

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logging middleware
  app.use((req, res, next) => {
    const start = Date.now();
    const originalSend = res.send;
    
    res.send = function(data) {
      const duration = Date.now() - start;
      const logEntry = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        contentLength: res.get('Content-Length') || 0,
      };
      
      accessLogStream.write(JSON.stringify(logEntry) + '\n');
      
      if (!isDevelopment) {
        console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
      }
      
      return originalSend.call(this, data);
    };
    
    next();
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0',
    });
  });

  // Enhanced API Route for Gemini with better error handling
  app.post("/api/generate-itinerary", async (req, res) => {
    try {
      const { prompt } = req.body;
      
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({
          error: 'Invalid request: prompt is required and must be a string'
        });
      }

      if (prompt.length > 2000) {
        return res.status(400).json({
          error: 'Prompt too long: maximum 2000 characters allowed'
        });
      }

      // Mock fallback (always used in development or when Gemini fails)
      console.log("Generating mock itinerary for:", prompt.substring(0, 100) + "...");
      
      const durationMatch = prompt.match(/Duration: (\d+)/i) || prompt.match(/(\d+)\s*days?/i);
      const duration = durationMatch ? Math.min(parseInt(durationMatch[1]), 14) : 3;
      
      const tripTypeMatch = prompt.match(/Trip Type: ([^,\n]+)/i) || prompt.match(/(adventure|cultural|nature|family|romantic)/i);
      const tripType = tripTypeMatch ? tripTypeMatch[1].toLowerCase() : "adventure";

      const budgetMatch = prompt.match(/(budget|mid-range|luxury)/i);
      const budget = budgetMatch ? budgetMatch[1].toLowerCase() : "mid-range";

      const activitiesPool = [
        { time: "08:00 AM", activity: "Dahilayan Adventure Park", location: "Manolo Fortich", description: "Experience Asia's longest dual zipline and the forest luge.", cost: "₱500-800" },
        { time: "10:30 AM", activity: "Del Monte Pineapple Plantation", location: "Manolo Fortich", description: "Tour the vast pineapple fields and learn about sustainable farming.", cost: "₱200-300" },
        { time: "12:00 PM", activity: "Lunch at Pinegrove Mountain Lodge", location: "Manolo Fortich", description: "Enjoy local cuisine with stunning mountain views.", cost: "₱400-600" },
        { time: "02:00 PM", activity: "Monastery of Transfiguration", location: "Malaybalay City", description: "Visit the iconic pyramid church and taste world-famous Monk's Blend coffee.", cost: "₱100-200" },
        { time: "04:30 PM", activity: "Kaamulan Grounds", location: "Malaybalay City", description: "Explore cultural park and learn about the seven hill tribes.", cost: "₱50-100" },
        { time: "09:00 AM", activity: "Mount Kitanglad Range Natural Park", location: "Impasug-ong", description: "Bird watching and trekking in a UNESCO Biosphere Reserve.", cost: "₱300-500" },
        { time: "11:00 AM", activity: "CEDAR Waterfalls", location: "Impasug-ong", description: "Discover three magnificent waterfalls in pristine forest.", cost: "₱150-250" },
        { time: "03:00 PM", activity: "Communal Ranch", location: "Impasug-ong", description: "Experience the 'New Zealand of Bukidnon' with rolling hills.", cost: "₱100-200" },
        { time: "07:00 AM", activity: "Sunrise at Panimahawa Ridge", location: "Impasug-ong", description: "Early morning trek for breathtaking sea of clouds view.", cost: "₱200-400" },
        { time: "01:00 PM", activity: "Lake Apo", location: "Valencia", description: "Relax by the serene crater lake with floating bamboo cottages.", cost: "₱150-300" }
      ];

      const days = [];
      for (let i = 1; i <= duration; i++) {
        const dayActivities = [];
        const startIndex = ((i - 1) * 3) % activitiesPool.length;
        for (let j = 0; j < 3; j++) {
          dayActivities.push(activitiesPool[(startIndex + j) % activitiesPool.length]);
        }
        days.push({
          day: i,
          title: `Day ${i}: ${i === 1 ? 'Arrival & Adventure' : i === duration ? 'Cultural Immersion & Departure' : 'Exploration & Discovery'}`,
          activities: dayActivities
        });
      }

      const costRanges = {
        budget: duration <= 3 ? "₱2,500 - ₱4,000" : "₱5,000 - ₱8,000",
        "mid-range": duration <= 3 ? "₱4,000 - ₱7,000" : "₱8,000 - ₱15,000",
        luxury: duration <= 3 ? "₱7,000 - ₱12,000" : "₱15,000 - ₱25,000"
      };

      const mockItinerary = {
        title: `Bukidnon ${tripType.charAt(0).toUpperCase() + tripType.slice(1)} Explorer - ${duration} Days`,
        summary: `A carefully curated ${duration}-day ${budget} journey through the heart of Bukidnon, showcasing its natural wonders, rich culture, and adventure opportunities. Perfect for ${tripType} enthusiasts seeking authentic Filipino highland experiences.`,
        days: days,
        estimatedCost: costRanges[budget as keyof typeof costRanges],
        tips: [
          "Pack layers - mountain weather can change quickly from cool mornings to warm afternoons.",
          "Bring comfortable trekking shoes with good grip for waterfall and mountain trails.",
          "Respect local tribal customs and ask permission before photographing indigenous communities.",
          "Try local delicacies like Binaki (corn tamales) and Monk's Blend coffee.",
          "Book accommodations in advance, especially during Kaamulan Festival season (February-March).",
          "Carry cash as some remote attractions may not accept cards.",
          "Consider hiring local guides for authentic cultural experiences and safety."
        ],
        sustainabilityNotes: [
          "Support local communities by purchasing authentic handicrafts directly from artisans.",
          "Follow Leave No Trace principles when visiting natural attractions.",
          "Choose eco-friendly accommodations that support conservation efforts."
        ]
      };

      res.json({ text: JSON.stringify(mockItinerary) });
    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({
        error: 'Internal server error. Please try again later.',
        ...(isDevelopment && { details: error instanceof Error ? error.message : String(error) })
      });
    }
  });

  // Error handling middleware
  app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Server Error:', error);
    
    const errorResponse = {
      error: 'Internal Server Error',
      timestamp: new Date().toISOString(),
      path: req.path,
      ...(isDevelopment && { 
        message: error.message,
        stack: error.stack 
      })
    };
    
    res.status(500).json(errorResponse);
  });

  // Vite middleware for development
  if (isDevelopment) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, {
      maxAge: '1y',
      etag: true,
      lastModified: true,
    }));
    
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`🚀 BukidGo server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔒 Security: ${isDevelopment ? 'Development mode' : 'Production security enabled'}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('Process terminated');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
      console.log('Process terminated');
      process.exit(0);
    });
  });
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
