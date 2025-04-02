const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

async function translate(text, targetLang) {
 try {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  const response = await axios.get(url);
  return response.data[0].map(item => item[0]).join('');
 } catch (error) {
  console.error('Error en traducción:', error.message);
  return null;
 }
}
app.get('/api/translate', async (req, res) => {
 try {
  const { text, lang = 'en' } = req.query;

  if (!text) {
   return res.status(400).json({
    error: 'Parámetro "text" requerido',
    ejemplo: '/api/translate?text=hola&lang=es'
   });
  }

  const translation = await translate(text, lang);
  if (!translation) throw new Error('Error en traducción');

  res.json({
   original: text,
   translated: translation,
   from: 'auto',
   to: lang
  });

 } catch (error) {
  res.status(500).json({
   error: 'Error interno',
   detalle: error.message
  });
 }
});

app.listen(PORT, () => {
 console.log(`Servidor en http://localhost:${PORT}`);
});

module.exports = app; 
app.use('/api/translate', (req, res, next) => next()); 