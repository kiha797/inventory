import { spawnSync } from 'node:child_process';
import { requireDatabase } from './configure-cloudflare.mjs';
requireDatabase();
const result = spawnSync(process.execPath, ['node_modules/wrangler/bin/wrangler.js', 'd1', 'migrations', 'apply', 'DB', '--remote', '--config', 'wrangler.json'], { stdio: 'inherit', env: process.env });
if (result.error) throw result.error;
process.exit(result.status ?? 1);
