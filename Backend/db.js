const { Sequelize } = require('sequelize');
// Carga las variables del archivo .env para uso local (Render lo ignora)
require('dotenv').config(); 

// --- Configuración Principal ---
// Render proporciona la cadena de conexión completa en esta variable
const DATABASE_URL = process.env.DATABASE_URL;

// Verifica si la variable crítica existe
if (!DATABASE_URL) {
    console.warn("⚠️ Advertencia: La variable DATABASE_URL no está configurada. Usando configuración local por defecto.");
    // Si no está en Render (es decir, estás local), usa una configuración separada:
    const DB_NAME = process.env.DB_NAME || 'PRUEBA_01';
    const DB_USER = process.env.DB_USER || 'postgres';
    const DB_PASS = process.env.DB_PASS || '12345';
    const DB_HOST = process.env.DB_HOST || 'localhost';
    const DB_PORT = process.env.DB_PORT || 5432;
    
    // Si estás local, crea la instancia con los valores separados:
    var sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
        host: DB_HOST,
        port: DB_PORT,
        dialect: 'postgres',
        logging: console.log,
    });
} else {
    // Si está en Render, crea la instancia usando la URL completa:
    var sequelize = new Sequelize(DATABASE_URL, {
        dialect: 'postgres',
        
        // 💡 IMPORTANTE para Render: Configurar SSL/TLS
        dialectOptions: {
            ssl: {
                require: true, // Render requiere SSL
                rejectUnauthorized: false // Permite la conexión aunque no valide el certificado (común en entornos cloud)
            }
        },
        logging: console.log, // Deja logging activado para depurar
    });
}

// --- Función para Probar la Conexión (Opcional) ---
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión exitosa a la base de datos PostgreSQL.');
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:', error.message);
    }
};

// Solo se ejecuta si corres este archivo directamente
if (require.main === module) {
    testConnection();
}

module.exports = sequelize;