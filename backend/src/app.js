require('dotenv').config();

const express= require('express');

const cors = require('cors');

const { connectDB } = require('./config/db');

const taskRoutes = require('./routes/taskRoutes');

const errorHandler = require('./middleware/errorHandler');

const app= express();

app.use(cors({
  origin:  process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json())
 
app.use(express.urlencoded({extended:true}))

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'TaskFlow API está funcionando',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/tasks', taskRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta '${req.originalUrl}' no encontrada`
  });
});


app.use(errorHandler);

module.exports = app;
