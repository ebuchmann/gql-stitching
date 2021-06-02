import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';

const SCHEMA_DIR = path.join(__dirname, 'schemas');

if (!fs.existsSync(SCHEMA_DIR)) {
  fs.mkdirSync(SCHEMA_DIR);
}

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
    const files = fs.readdirSync(SCHEMA_DIR);
    const data = files.map((file) =>
      JSON.parse(fs.readFileSync(`${path.join(__dirname, 'schemas')}/${file}`, 'utf8')),
    );

    hash.update(JSON.stringify(data));

    this.hash = hash.digest('hex');
    this.data = data;
  }
}

export default new SchemaRegistry();
