import { DatabaseSync } from 'node:sqlite';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

export async function createStatsStore(path, { now = Date.now, maxReceipts = 100_000 } = {}) {
  if (path !== ':memory:') await mkdir(dirname(path), {recursive:true,mode:0o700});
  const db = new DatabaseSync(path, {timeout:3000});
  try {
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL) STRICT;
    CREATE TABLE IF NOT EXISTS copies (mod_id TEXT PRIMARY KEY, count INTEGER NOT NULL CHECK(count >= 0)) STRICT;
    CREATE TABLE IF NOT EXISTS receipts (event_id TEXT PRIMARY KEY, mod_id TEXT NOT NULL, variant TEXT NOT NULL, created_at INTEGER NOT NULL) STRICT;
    CREATE INDEX IF NOT EXISTS receipts_created_at ON receipts(created_at);
  `);
  db.prepare('INSERT OR IGNORE INTO metadata VALUES (?, ?)').run('since',new Date(now()).toISOString());
  const since = db.prepare('SELECT value FROM metadata WHERE key = ?').get('since').value;
  const receipt = db.prepare('SELECT mod_id, variant FROM receipts WHERE event_id = ?');
  const count = db.prepare('SELECT count FROM copies WHERE mod_id = ?');
  const prune = db.prepare('DELETE FROM receipts WHERE created_at < ?');
  const size = db.prepare('SELECT COUNT(*) AS total FROM receipts');
  const insert = db.prepare('INSERT INTO receipts VALUES (?, ?, ?, ?)');
  const increment = db.prepare('INSERT INTO copies VALUES (?, 1) ON CONFLICT(mod_id) DO UPDATE SET count = count + 1');
  return {
    snapshot(ids) {
      const values = new Map(db.prepare('SELECT mod_id, count FROM copies').all().map(row=>[row.mod_id,row.count]));
      return {version:1,since,counts:Object.fromEntries(ids.map(id=>[id,values.get(id) ?? 0]))};
    },
    record(modId, variant, eventId) {
      db.exec('BEGIN IMMEDIATE');
      try {
        const existing = receipt.get(eventId);
        if (existing) {
          if (existing.mod_id !== modId || existing.variant !== variant) {
            throw Object.assign(new Error('Event ID already used for another prompt'), {status:409});
          }
        } else {
          prune.run(now() - 7*24*60*60*1000);
          if (size.get().total >= maxReceipts) throw Object.assign(new Error('Copy statistics are temporarily busy'), {status:503});
          insert.run(eventId, modId, variant, now());
          increment.run(modId);
        }
        const copies = count.get(modId).count;
        db.exec('COMMIT');
        return {modId,count:copies,duplicate:Boolean(existing),since};
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
    },
    close() {db.close();},
  };
  } catch (error) {db.close();throw error;}
}
