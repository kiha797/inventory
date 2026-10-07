import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { requireDatabase } from './configure-cloudflare.mjs';
requireDatabase();
const source = JSON.parse(readFileSync('wrangler.json', 'utf8'));
const built = JSON.parse(readFileSync('dist/server/wrangler.json', 'utf8'));
if (source.d1_databases[0].database_id !== built.d1_databases[0].database_id) {
  throw new Error('D1 설정이 변경되었습니다. pnpm build를 다시 실행한 후 배포하세요.');
}
for (const args of [
  ['scripts/migrate.mjs'],
  ['node_modules/wrangler/bin/wrangler.js', 'deploy', '--config', 'dist/server/wrangler.json'],
]) {
  const result = spawnSync(process.execPath, args, { stdio: 'inherit', env: process.env });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
