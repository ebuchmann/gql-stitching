import express from 'express';
import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';

const app = express();
const hash = createHash('sha1');

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

interface RegisterSchema {
  name: string;
  url: string;
  typeDefs: string;
}

class SchemaRegistry {
  hash;
  data;

  constructor() {
    this.generateData();
  }

  registerSchema({ name, url, typeDefs }: RegisterSchema) {
    fs.writeFileSync(
      `${path.join(__dirname, 'schemas')}/${name}.json`,
      JSON.stringify({ name, url, typeDefs }),
    );

    this.generateData();
  }

  readData() {
    return { hash: this.hash, data: this.data };
  }

  generateData() {
    const hash = createHash('sha1');
    const files = fs.readdirSync(path.join(__dirname, 'schemas'));
    const data = files.map((file) =>
      JSON.parse(fs.readFileSync(`${path.join(__dirname, 'schemas')}/${file}`, 'utf8')),
    );

    hash.update(JSON.stringify(data));

    this.hash = hash.digest('hex');
    this.data = data;
  }
}

const schemaRegistry = new SchemaRegistry();
