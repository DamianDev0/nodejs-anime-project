const express = require('express');
const animeRoutes = require('./routes/anime');
const studiosRouter = require('./routes/studios');
const directorsRouter = require('./routes/directors');
const charactersRouter = require('./routes/characters');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = 3000;

app.use(express.json());

// Rutas
app.use('/anime', animeRoutes);
app.use('/studios', studiosRouter);
app.use('/directors', directorsRouter);
app.use('/characters', charactersRouter);

// Middleware de manejo de errores
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
