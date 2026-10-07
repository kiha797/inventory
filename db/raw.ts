import {env} from 'cloudflare:workers';
export function rawDb(){const db=(env as unknown as {DB:D1Database}).DB;if(!db)throw new Error('조사 데이터 저장소에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.');return db}
