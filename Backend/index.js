// index.js
const express = require('express');
const cors = require('cors'); // ✅ CORRECCIÓN: Importación correcta de 'cors'
const db = require('./db.js');      // Conexión a la BD (Sequelize)
const Hi = require('./models/item.js'); // Modelo para la tabla 'hi'

// Configuración del puerto
const PORT = process.env.PORT || 3000; 
const app = express();

app.use(cors());
app.use(express.json()); // Habilita la lectura de cuerpos JSON

// ------------------------------------
// ✅ RUTAS DE LA API
// ------------------------------------

// RUTA HOME
app.get('/', (req, res) => {
    res.send('✅ Servidor Backend corriendo y listo para usar.');
});

// ✅ RUTA GET: Obtener todos los registros de la tabla 'hi' (Uso típico: /api/hi)
app.get('/api/hi', async (req, res) => {
    try {
        const hi = await Hi.findAll();
        res.json(hi);
    } catch (error) {
        console.error('Error al obtener registros:', error.message);
        res.status(500).json({ error: 'Error al obtener registros' });
    }
});

// 🚀 RUTA GET: /consulta - Para ver los datos agregados (es un alias funcional de /api/hi)
app.get('/consulta', async (req, res) => {
    try {
        const datosAgregados = await Hi.findAll();
        res.json({
            mensaje: 'Datos obtenidos de la tabla "hi"',
            data: datosAgregados
        });
    } catch (error) {
        console.error('Error al consultar datos:', error.message);
        res.status(500).json({ error: 'Error al consultar datos' });
    }
});

// ✅ RUTA POST: Crear un nuevo registro en la tabla 'hi' (Uso en Postman: /api/hi)
app.post('/api/hi', async (req, res) => {
    try {
        const { nombre } = req.body;      // Extrae el campo 'nombre' del cuerpo JSON
        
        if (!nombre) {
            return res.status(400).json({ error: 'El campo "nombre" es obligatorio.' });
        }
        
        const nuevo = await Hi.create({ nombre });
        res.status(201).json(nuevo); // Retorna el nuevo registro creado
    } catch (error) {
        console.error('Error al crear registro:', error.message);
        res.status(500).json({ error: 'Error al crear registro', detail: error.message });
    }
});

// ------------------------------------
// ✅ CONEXIÓN A DB Y LEVANTAMIENTO DEL SERVIDOR
// ------------------------------------

(async () => {
    try {
        // 1. Autenticar la conexión a la DB
        await db.authenticate();
        console.log('✅ Conexión a la base de datos exitosa');
        
        // 2. Sincronizar modelos con la DB (crea la tabla si no existe o aplica cambios)
        await db.sync({ alter: true }); 
        console.log('✅ Base de datos sincronizada');

        // 3. Levantamiento del servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
            console.log(`URL de prueba (GET): http://localhost:${PORT}/consulta`);
        });
    } catch (err) {
        console.error('❌ Error de conexión o sincronización:', err.message);
    }
})();