import { readFileSync, writeFileSync } from 'node:fs';
const config = JSON.parse(readFileSync('wrangler.json', 'utf8'));
const id = process.env.D1_DATABASE_ID;
if (id) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    throw new Error('D1_DATABASE_ID에 Cloudflare D1의 Database ID를 입력하세요.');
  }
  config.d1_databases[0].database_id = id;
  writeFileSync('wrangler.json', JSON.stringify(config, null, 2) + '\n');
}
export function requireDatabase() {
  if (config.d1_databases[0].database_id === '00000000-0000-4000-8000-000000000000') {
    throw new Error('배포 전에 D1_DATABASE_ID 환경 변수에 inventory-db의 실제 Database ID를 설정하세요.');
  }
}
