import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import router from './routes'; // ← Import de votre router

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globaux
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: 'API E-commerce EMCA',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      products: '/api/products',
      orders: '/api/orders',
      payments: '/api/payments'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: AppDataSource.isInitialized ? 'connected' : 'disconnected'
  });
});

// Routes API
app.use('/api', router);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route non trouvée',
    path: req.path,
    method: req.method
  });
});

// Error Handler global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Erreur:', err);
  
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Erreur serveur interne';
  
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err.details 
    })
  });
});

// Connexion à la base de données et démarrage du serveur
AppDataSource.initialize()
  .then(() => {
    console.log('✅ Connexion à la base de données MySQL réussie');
    
    app.listen(PORT, () => {
      console.log('\n============================================');
      console.log(`   Serveur démarré sur http://localhost:${PORT}`);
      console.log(`   Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log('============================================\n');
      
      console.log('Endpoints disponibles:\n');
      console.log('Authentification:');
      console.log('   POST   /api/auth/register');
      console.log('   POST   /api/auth/login');
      console.log('   GET    /api/auth/profile\n');
      
      console.log('Utilisateurs:');
      console.log('   GET    /api/users (admin)');
      console.log('   GET    /api/users/:id');
      console.log('   DELETE /api/users/:id (admin)\n');
      
      console.log('Health check: http://localhost:${PORT}/health\n');
    });
  })
  .catch((error) => {
    console.error('❌ Erreur de connexion à la base de données:', error);
    process.exit(1);
  });

export default app;
