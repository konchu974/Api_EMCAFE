import { AppDataSource } from './config/database';

AppDataSource.initialize()
  .then(async () => {
    console.log('✅ Connexion réussie à MySQL!');
    
    // Test de requête
    const users = await AppDataSource.query('SELECT * FROM user_account');
    console.log(`Nombre d'utilisateurs : ${users.length}`);
    
    const products = await AppDataSource.query('SELECT * FROM product');
    console.log(`Nombre de produits : ${products.length}`);
    
    await AppDataSource.destroy();
    console.log('✅ Connexion fermée');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erreur de connexion:', error);
    process.exit(1);
  });
