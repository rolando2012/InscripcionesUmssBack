import app from './app.js';

const PORT = app.get('port');

app.get('/', (req, res) => {
    res.send('Servidor de Inscripciones UMSS Encendido');
});

app.listen(PORT, () => {
   console.log(`Servidor ejecutando en http://localhost:${PORT}`); 
});