import express from 'express';
import schemaRegistry from './SchemaRegistry';

const app = express();

app.use(express.json());

// Register schemas
app.post('/register', (req, res) => {
  console.log(`Registering schema for ${req.body.name}`);
  schemaRegistry.registerSchema(req.body);

  res.status(200);
  return res.send('Ok');
});

// Get schemas
app.get('/schemas', (req, res) => {
  res.status(200);
  return res.json(schemaRegistry.readData());
});

app.get('/schemas/:hash', (req, res) => {
  if (req.params.hash === schemaRegistry.hash) {
    return res.status(304).json(null);
  }

  return res.status(200).json(schemaRegistry.readData());
});

app.listen(4500, () => console.log(`Registry running at http://localhost:4500`));
