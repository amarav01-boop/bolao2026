const express = require('express');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');

const { loadEnv } = require('./config/env');
const { createSessionMiddleware } = require('./config/session');
const authRoutes = require('./routes/auth-routes');
const adminRoutes = require('./routes/admin-routes');
const predictionRoutes = require('./routes/prediction-routes');
const rankingRoutes = require('./routes/ranking-routes');
const homeRoutes = require('./routes/home-routes');
const revealRoutes = require('./routes/reveal-routes');
const healthRoutes = require('./routes/health-routes');
const { notFoundHandler, errorHandler } = require('./middleware/error-handler');

loadEnv();

const app = express();

app.disable('x-powered-by');

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(
  helmet({
    contentSecurityPolicy: false
  })
);
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    const origin = req.headers.origin;
    const isLocalDevOrigin =
      typeof origin === 'string' &&
      /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

    if (isLocalDevOrigin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Vary', 'Origin');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
      }
    }
  }

  return next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(createSessionMiddleware());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/ranking', rankingRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/reveal', revealRoutes);
app.use('/api/health', healthRoutes);

const clientDist = path.resolve(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('/', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
  app.get(/^\/(?!api\/).*/, (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      data: {
        status: 'ok',
        service: 'bolao2026-api'
      }
    });
  });
}

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
