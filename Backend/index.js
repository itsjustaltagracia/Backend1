// index.js
const express = require('express');
const cors = require('cors');
const db = require('./db.js');      // conexión a la BD
const Hi = require('./models/item.js'); // modelo para la tabla 'hi' (Asegúrate de que este modelo exista)

// 💡 CORRECCIÓN para Render: Usa la variable de entorno PORT, o 3000 por defecto (local)
const PORT = process.env.PORT || 3000; 
const app = express();

app.use(cors());
app.use(express.json());

// ✅ RUTA MÍNIMA para la raíz (Home)
app.get('/', (req, res) => {
    res.send('✅ Servidor Backend corriendo y listo para usar.');
});

// ✅ RUTA para obtener todos los registros de la tabla 'hi'
app.get('/api/hi', async (req, res) => {
    try {
        const hi = await Hi.findAll();
        res.json(hi);
    } catch (error) {
        console.error('Error al obtener registros:', error.message);
        res.status(500).json({ error: 'Error al obtener registros' });
    }
});

// ✅ RUTA para crear un nuevo registro en la tabla 'hi'
app.post('/api/hi', async (req, res) => {
    try {
        const { nombre } = req.body;      // coincide con el campo de tu tabla
        const nuevo = await Hi.create({ nombre });
        res.status(201).json(nuevo);
    } catch (error) {
        console.error('Error al crear registro:', error.message);
        res.status(500).json({ error: 'Error al crear registro' });
    }
});

// ✅ Conectar a la base de datos y levantar el servidor
(async () => {
    try {
        await db.authenticate();
        console.log('✅ Conexión a la base de datos exitosa');
        
        // 💡 db.sync() debe estar aquí para crear o actualizar tablas
        await db.sync({ alter: true }); // { alter: true } ajusta las tablas sin borrarlas (útil en desarrollo)
        
        // 🚀 Levantamiento del servidor
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
            console.log(`¡Servidor listo en Render! URL pública: [tu-url.onrender.com]`);
        });
    } catch (err) {
        console.error('❌ Error de conexión o sincronización:', err.message);
    }
})();