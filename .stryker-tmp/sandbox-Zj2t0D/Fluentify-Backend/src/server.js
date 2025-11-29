// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import "dotenv/config";
import express from "express";
import cors from "cors";
import db, { connectToDatabase, gracefulShutdown } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import preferencesRoutes from './routes/preferences.js';
import courseRoutes from './routes/courses.js';
import progressRoutes from './routes/progress.js';
import retellRoutes from './routes/retellRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import learnerModulesRoutes from './routes/learnerModulesRoutes.js';
import tutorRoutes from './routes/tutor.js';
import contestRoutes from './routes/contest.js';
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware.js';
const app = express();
const port = stryMutAct_9fa48("2966") ? process.env.PORT && 5000 : stryMutAct_9fa48("2965") ? false : stryMutAct_9fa48("2964") ? true : (stryCov_9fa48("2964", "2965", "2966"), process.env.PORT || 5000);

// Configure CORS
app.use(cors(stryMutAct_9fa48("2967") ? {} : (stryCov_9fa48("2967"), {
  origin: stryMutAct_9fa48("2968") ? [] : (stryCov_9fa48("2968"), [stryMutAct_9fa48("2969") ? "" : (stryCov_9fa48("2969"), 'http://localhost:3000'), stryMutAct_9fa48("2970") ? "" : (stryCov_9fa48("2970"), 'http://127.0.0.1:3000'), stryMutAct_9fa48("2971") ? "" : (stryCov_9fa48("2971"), 'http://localhost:5174'), stryMutAct_9fa48("2972") ? "" : (stryCov_9fa48("2972"), 'http://localhost:5173'), stryMutAct_9fa48("2973") ? "" : (stryCov_9fa48("2973"), 'https://fluentify-rho.vercel.app'), // Production frontend
  stryMutAct_9fa48("2974") ? /\.vercel\.app/ : (stryCov_9fa48("2974"), /\.vercel\.app$/) // Allow all Vercel preview deployments
  ]),
  credentials: stryMutAct_9fa48("2975") ? false : (stryCov_9fa48("2975"), true),
  methods: stryMutAct_9fa48("2976") ? [] : (stryCov_9fa48("2976"), [stryMutAct_9fa48("2977") ? "" : (stryCov_9fa48("2977"), 'GET'), stryMutAct_9fa48("2978") ? "" : (stryCov_9fa48("2978"), 'POST'), stryMutAct_9fa48("2979") ? "" : (stryCov_9fa48("2979"), 'PUT'), stryMutAct_9fa48("2980") ? "" : (stryCov_9fa48("2980"), 'PATCH'), stryMutAct_9fa48("2981") ? "" : (stryCov_9fa48("2981"), 'DELETE'), stryMutAct_9fa48("2982") ? "" : (stryCov_9fa48("2982"), 'OPTIONS')]),
  allowedHeaders: stryMutAct_9fa48("2983") ? [] : (stryCov_9fa48("2983"), [stryMutAct_9fa48("2984") ? "" : (stryCov_9fa48("2984"), 'Content-Type'), stryMutAct_9fa48("2985") ? "" : (stryCov_9fa48("2985"), 'Authorization'), stryMutAct_9fa48("2986") ? "" : (stryCov_9fa48("2986"), 'Accept')]),
  exposedHeaders: stryMutAct_9fa48("2987") ? [] : (stryCov_9fa48("2987"), [stryMutAct_9fa48("2988") ? "" : (stryCov_9fa48("2988"), 'Content-Length'), stryMutAct_9fa48("2989") ? "" : (stryCov_9fa48("2989"), 'Content-Type')])
})));
app.use(express.json());

// Root check
app.get(stryMutAct_9fa48("2990") ? "" : (stryCov_9fa48("2990"), "/"), (req, res) => {
  if (stryMutAct_9fa48("2991")) {
    {}
  } else {
    stryCov_9fa48("2991");
    res.json(stryMutAct_9fa48("2992") ? {} : (stryCov_9fa48("2992"), {
      status: stryMutAct_9fa48("2993") ? "" : (stryCov_9fa48("2993"), "Backend is running 🚀")
    }));
  }
});

// Health check endpoint (for Docker)
app.get(stryMutAct_9fa48("2994") ? "" : (stryCov_9fa48("2994"), "/health"), async (req, res) => {
  if (stryMutAct_9fa48("2995")) {
    {}
  } else {
    stryCov_9fa48("2995");
    try {
      if (stryMutAct_9fa48("2996")) {
        {}
      } else {
        stryCov_9fa48("2996");
        await db.query(stryMutAct_9fa48("2997") ? "" : (stryCov_9fa48("2997"), "SELECT 1"));
        res.status(200).json(stryMutAct_9fa48("2998") ? {} : (stryCov_9fa48("2998"), {
          status: stryMutAct_9fa48("2999") ? "" : (stryCov_9fa48("2999"), "healthy"),
          database: stryMutAct_9fa48("3000") ? "" : (stryCov_9fa48("3000"), "connected"),
          timestamp: new Date().toISOString()
        }));
      }
    } catch (err) {
      if (stryMutAct_9fa48("3001")) {
        {}
      } else {
        stryCov_9fa48("3001");
        res.status(503).json(stryMutAct_9fa48("3002") ? {} : (stryCov_9fa48("3002"), {
          status: stryMutAct_9fa48("3003") ? "" : (stryCov_9fa48("3003"), "unhealthy"),
          database: stryMutAct_9fa48("3004") ? "" : (stryCov_9fa48("3004"), "disconnected"),
          error: err.message
        }));
      }
    }
  }
});

// DB check route (detailed)
app.get(stryMutAct_9fa48("3005") ? "" : (stryCov_9fa48("3005"), "/db-check"), async (req, res) => {
  if (stryMutAct_9fa48("3006")) {
    {}
  } else {
    stryCov_9fa48("3006");
    try {
      if (stryMutAct_9fa48("3007")) {
        {}
      } else {
        stryCov_9fa48("3007");
        const result = await db.query(stryMutAct_9fa48("3008") ? "" : (stryCov_9fa48("3008"), "SELECT NOW(), version() as db_version"));
        res.json(stryMutAct_9fa48("3009") ? {} : (stryCov_9fa48("3009"), {
          status: stryMutAct_9fa48("3010") ? "" : (stryCov_9fa48("3010"), "✅ Connected to PostgreSQL!"),
          time: result.rows[0].now,
          version: result.rows[0].db_version,
          environment: stryMutAct_9fa48("3013") ? process.env.NODE_ENV && 'development' : stryMutAct_9fa48("3012") ? false : stryMutAct_9fa48("3011") ? true : (stryCov_9fa48("3011", "3012", "3013"), process.env.NODE_ENV || (stryMutAct_9fa48("3014") ? "" : (stryCov_9fa48("3014"), 'development')))
        }));
      }
    } catch (err) {
      if (stryMutAct_9fa48("3015")) {
        {}
      } else {
        stryCov_9fa48("3015");
        res.status(500).json(stryMutAct_9fa48("3016") ? {} : (stryCov_9fa48("3016"), {
          status: stryMutAct_9fa48("3017") ? "" : (stryCov_9fa48("3017"), "❌ DB connection failed"),
          error: err.message
        }));
      }
    }
  }
});

// Auth routes
app.use(stryMutAct_9fa48("3018") ? "" : (stryCov_9fa48("3018"), "/api/auth"), authRoutes);
// Preferences routes
app.use(stryMutAct_9fa48("3019") ? "" : (stryCov_9fa48("3019"), '/api/preferences'), preferencesRoutes);
// Course routes
app.use(stryMutAct_9fa48("3020") ? "" : (stryCov_9fa48("3020"), '/api/courses'), courseRoutes);
// Progress routes
app.use(stryMutAct_9fa48("3021") ? "" : (stryCov_9fa48("3021"), '/api/progress'), progressRoutes);
// Retell AI routes
app.use(stryMutAct_9fa48("3022") ? "" : (stryCov_9fa48("3022"), '/api/retell'), retellRoutes);
// Admin routes
app.use(stryMutAct_9fa48("3023") ? "" : (stryCov_9fa48("3023"), '/api/admin'), adminRoutes);
// Learner Modules routes (published courses for learners)
app.use(stryMutAct_9fa48("3024") ? "" : (stryCov_9fa48("3024"), '/api/learner-modules'), learnerModulesRoutes);
// AI Tutor routes
app.use(stryMutAct_9fa48("3025") ? "" : (stryCov_9fa48("3025"), '/api/tutor'), tutorRoutes);
// Contest routes (Peer-to-Peer Leaderboard & Weekly Contest)
app.use(stryMutAct_9fa48("3026") ? "" : (stryCov_9fa48("3026"), '/api/contests'), contestRoutes);

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Global error handler - must be last
app.use(errorHandler);

// Start server with database connection
const startServer = async () => {
  if (stryMutAct_9fa48("3027")) {
    {}
  } else {
    stryCov_9fa48("3027");
    await connectToDatabase();
    app.listen(port, () => {
      if (stryMutAct_9fa48("3028")) {
        {}
      } else {
        stryCov_9fa48("3028");
        console.log(stryMutAct_9fa48("3029") ? `` : (stryCov_9fa48("3029"), `🚀 Server running at http://localhost:${port}`));
        console.log(stryMutAct_9fa48("3030") ? `` : (stryCov_9fa48("3030"), `🌍 Environment: ${stryMutAct_9fa48("3033") ? process.env.NODE_ENV && 'development' : stryMutAct_9fa48("3032") ? false : stryMutAct_9fa48("3031") ? true : (stryCov_9fa48("3031", "3032", "3033"), process.env.NODE_ENV || (stryMutAct_9fa48("3034") ? "" : (stryCov_9fa48("3034"), 'development')))}`));
      }
    });
  }
};

// Graceful shutdown handlers
process.on(stryMutAct_9fa48("3035") ? "" : (stryCov_9fa48("3035"), 'SIGTERM'), async () => {
  if (stryMutAct_9fa48("3036")) {
    {}
  } else {
    stryCov_9fa48("3036");
    console.log(stryMutAct_9fa48("3037") ? "" : (stryCov_9fa48("3037"), 'SIGTERM received, shutting down gracefully...'));
    await gracefulShutdown();
    process.exit(0);
  }
});
process.on(stryMutAct_9fa48("3038") ? "" : (stryCov_9fa48("3038"), 'SIGINT'), async () => {
  if (stryMutAct_9fa48("3039")) {
    {}
  } else {
    stryCov_9fa48("3039");
    console.log(stryMutAct_9fa48("3040") ? "" : (stryCov_9fa48("3040"), 'SIGINT received, shutting down gracefully...'));
    await gracefulShutdown();
    process.exit(0);
  }
});
startServer().catch(error => {
  if (stryMutAct_9fa48("3041")) {
    {}
  } else {
    stryCov_9fa48("3041");
    console.error(stryMutAct_9fa48("3042") ? "" : (stryCov_9fa48("3042"), 'Failed to start server:'), error);
    process.exit(1);
  }
});