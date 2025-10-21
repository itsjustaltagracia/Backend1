// index.js
const express = require('express');
const cors = require('cors'); 
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

// 🚀 RUTA GET: /consulta - Para VER los datos agregados
app.get('/consulta', async (req, res) => {
    try {
        const datosAgregados = await Hi.findAll();
        res.json({
            mensaje: 'Datos obtenidos de la tabla "hi" (Consulta GET)',
            data: datosAgregados
        });
    } catch (error) {
        console.error('Error al consultar datos:', error.message);
        res.status(500).json({ error: 'Error al consultar datos' });
    }
});

// ✅ RUTA POST: /consulta - Para AGREGAR un nuevo registro (según tu requerimiento)
app.post('/consulta', async (req, res) => {
    try {
        const { nombre } = req.body;      
        
        if (!nombre) {
            return res.status(400).json({ error: 'El campo "nombre" es obligatorio.' });
        }
        
        const nuevo = await Hi.create({ nombre });
        res.status(201).json({
            mensaje: 'Dato agregado exitosamente a la tabla "hi" (Consulta POST)',
            registro: nuevo
        });
    } catch (error) {
        console.error('Error al crear registro:', error.message);
        res.status(500).json({ error: 'Error al crear registro', detail: error.message });
    }
});


// ------------------------------------
// ✅ LEVANTAMIENTO DEL SERVIDOR (INMEDIATO)
// ------------------------------------

// 🚀 Levantamiento del servidor (se abre el puerto de inmediato)
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    console.log(`URL de prueba (GET/POST): http://localhost:${PORT}/consulta`);
});


// ------------------------------------
// ✅ CONEXIÓN A DB Y SINCRONIZACIÓN (ASÍNCRONA)
// ------------------------------------

(async () => {
    try {
        // 1. Autenticar la conexión a la DB
        await db.authenticate();
        console.log('✅ Conexión a la base de datos exitosa');
        
        // 2. Sincronizar modelos con la DB
        await db.sync({ alter: true }); 
        console.log('✅ Base de datos sincronizada');
    } catch (err) {
        console.error('❌ Error de conexión o sincronización:', err.message);
    }
})();