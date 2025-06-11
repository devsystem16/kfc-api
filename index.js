require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Person = require('./models/person');

const app = express();
const PORT = process.env.PORT || 3000;

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error al conectar Atlas:', err));

app.use(express.json());

// CREAR persona
app.post('/persons', async (req, res) => {
  try {
    const newPerson = new Person(req.body);
    const savedPerson = await newPerson.save();
    res.status(201).json(savedPerson);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar todas las personas
app.get('/persons', async (req, res) => {
  const people = await Person.find();
  res.json(people);
});

// Obtener persona por ID
app.get('/persons/:id', async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) return res.status(404).json({ error: 'No encontrada' });
    res.json(person);
  } catch {
    res.status(400).json({ error: 'ID inválido' });
  }
});

// Actualizar persona
app.put('/persons/:id', async (req, res) => {
  try {
    const updated = await Person.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'No encontrada' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar persona
app.delete('/persons/:id', async (req, res) => {
  try {
    const result = await Person.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'No encontrada' });
    res.status(204).end();
  } catch {
    res.status(400).json({ error: 'ID inválido' });
  }
});

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});
