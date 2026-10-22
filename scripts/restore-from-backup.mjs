/**
 * Vivaan Farms — Restore From Backup
 * ====================================
 * Puts original product documents back from a backup JSON.
 * Only restores the `products` collection (the only one the migration touches).
 *
 * Modes:
 *   --dry-run  (default) Print what would be restored. No writes.
 *   --run               Actually write to Firestore.
 *
 * Requires:
 *   $env:GOOGLE_APPLICATION_CREDENTIALS = "path\to\service-account-key.json"
 *
 * Usage (PowerShell):
 *   $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\key.json"
 *   node scripts/restore-from-backup.mjs            # dry-run
 *   node scripts/restore-from-backup.mjs --run      # real restore
 */

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DRY_RUN = !process.argv.includes('--run');
const PROJECT_ID = 'vivanfarms-53957';

// ── Find latest backup ────────────────────────────────────────────────────────
let backupPath;
const specificFile = process.argv.find(a => a.endsWith('.json'));
if (specificFile) {
  backupPath = specificFile;
} else {
  const backupsDir = join(ROOT, 'backups');
  const files = readdirSync(backupsDir)
    .filter(f => f.startsWith('firestore-backup-') && f.endsWith('.json'))
    .sort().reverse();
  if (!files.length) {
    console.error('No backup file found. Run backup-firestore.mjs first.');
    process.exit(1);
  }
  backupPath = join(backupsDir, files[0]);
}

console.log(`\n📂 Using backup: ${backupPath}`);

const backup = JSON.parse(readFileSync(backupPath, 'utf-8'));
const products = Object.entries(backup.products || {});

// ── Init Firebase Admin (only when writing) ──────────────────────────────────
let db = null;
let batch = null;
if (!DRY_RUN) {
  if (!getApps().length) {
    try {
      initializeApp();
    } catch {
      try {
        const { credential } = await import('firebase-admin');
        initializeApp({ projectId: PROJECT_ID });
      } catch (e) {
        console.error('Could not init Firebase Admin. Set $env:GOOGLE_APPLICATION_CREDENTIALS in PowerShell.');
        process.exit(1);
      }
    }
  }
  db = getFirestore();
  batch = db.batch();
}

function sep() { return '─'.repeat(60); }
function heading(t) { console.log(`\n${'═'.repeat(60)}\n${t}\n${sep()}`); }

heading(DRY_RUN ? '🔍 DRY-RUN — Restore Preview (no writes)' : '✍️  LIVE RESTORE — Writing original documents to Firestore');

console.log(`\n📦 ${products.length} products in backup:`);

let count = 0;

for (const [id, data] of products) {
  const name = data.name || data.title || id;
  console.log(`\n  [${id}] "${name}"`);

  // Show what fields would be restored
  const fields = Object.keys(data);
  console.log(`  Fields: ${fields.join(', ')}`);

  if (!DRY_RUN) {
    // Full overwrite with original backup data (set without merge)
    batch.set(db.collection('products').doc(id), data);
  }
  count++;
}

heading('Summary');
console.log(`  Products to restore: ${count}`);
console.log(`  Collections affected: products only`);
console.log(`  Orders, reviews, users: NOT touched`);

if (DRY_RUN) {
  console.log('\n  ✅ DRY-RUN COMPLETE. No writes made.');
  console.log('  Run with --run to restore:\n  node scripts/restore-from-backup.mjs --run\n');
} else {
  await batch.commit();
  console.log(`\n  ✅ RESTORE COMPLETE. ${count} products restored from backup.\n`);
}
