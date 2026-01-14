import fs from 'fs';
import path from 'path';

const content = `DATABASE_URL="mysql://root@localhost:3306/servicios_estudiantiles"
PORT=3000
JWT_SECRET="supersecret_secret_2025_learned"
NODE_ENV="development"
`;

fs.writeFileSync(path.join(process.cwd(), '.env'), content.trim(), { encoding: 'utf8' });
console.log('.env file created successfully with UTF-8 encoding');
