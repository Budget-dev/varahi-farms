/**
 * Vivaan Farms — Firestore Backup (Client SDK)
 * =============================================
 * Uses the Firebase JS client SDK + Firestore REST API so no service account needed.
 * Exports: products, reviews, faqs, siteSettings, categories, universalCoupons
 * Output: /backups/firestore-backup-<timestamp>.json
 *
 * Usage:  node scripts/backup-firestore.mjs
 *
 * IMPORTANT: This uses the public API key which grants READ access only.
 * The backup is read-only — it never writes to Firestore.
 */

import { createWriteStream, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ── Firebase config (matches src/firebase/config.ts) ─────────────────────────
const PROJECT_ID  = 'vivanfarms-53957';
const API_KEY     = 'AIzaSyAgKIEsoHi8ZX0Wn8-yeZpybNQuZKsKe_8';
const BASE_URL    = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// ── Collections to back up ────────────────────────────────────────────────────
const COLLECTIONS = [
  'products',
  'reviews',
  'faqs',
  'siteSettings',
  'categories',
  'universalCoupons',
];

// ── Firestore value decoder ───────────────────────────────────────────────────
function decodeValue(val) {
  if (!val) return null;
  if ('nullValue'      in val) return null;
  if ('booleanValue'   in val) return val.booleanValue;
  if ('integerValue'   in val) return Number(val.integerValue);
  if ('doubleValue'    in val) return Number(val.doubleValue);
  if ('stringValue'    in val) return val.stringValue;
  if ('timestampValue' in val) return val.timestampValue;
  if ('bytesValue'     in val) return val.bytesValue;
  if ('referenceValue' in val) return val.referenceValue;
  if ('geoPointValue'  in val) return val.geoPointValue;
  if ('arrayValue'     in val) {
    return (val.arrayValue.values || []).map(decodeValue);
  }
  if ('mapValue' in val) {
    const obj = {};
    for (const [k, v] of Object.entries(val.mapValue.fields || {})) {
      obj[k] = decodeValue(v);
    }
    return obj;
  }
  return null;
}

function decodeDocument(doc) {
  const fields = doc.fields || {};
  const result = {};
  for (const [k, v] of Object.entries(fields)) {
    result[k] = decodeValue(v);
  }
  return result;
}

// ── Fetch all docs in a collection via REST ───────────────────────────────────
async function fetchCollection(colName) {
  const docs = {};
  let pageToken = undefined;

  do {
    const url = `${BASE_URL}/${colName}?key=${API_KEY}${pageToken ? `&pageToken=${pageToken}` : ''}`;
    const res = await fetch(url);

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 404 || text.includes('NOT_FOUND')) {
        console.log(`  ⚠  "${colName}" not found or empty, skipping.`);
        return docs;
      }
      throw new Error(`HTTP ${res.status} for ${colName}: ${text.substring(0, 200)}`);
    }

    const data = await res.json();

    if (data.documents) {
      for (const doc of data.documents) {
        // doc.name = "projects/.../documents/colName/docId"
        const docId = doc.name.split('/').pop();
        docs[docId] = decodeDocument(doc);
      }
    }

    pageToken = data.nextPageToken;
  } while (pageToken);

  return docs;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🔒 Vivaan Farms — Firestore Backup (REST API)');
  console.log('──────────────────────────────────────────────');

  const backup = {
    _meta: {
      createdAt: new Date().toISOString(),
      projectId: PROJECT_ID,
      collections: COLLECTIONS,
      version: '1.0',
    },
  };

  for (const col of COLLECTIONS) {
    try {
      const docs = await fetchCollection(col);
      backup[col] = docs;
      const count = Object.keys(docs).length;
      console.log(`  ✓ ${col}: ${count} document(s)`);
    } catch (err) {
      console.warn(`  ⚠ Could not export "${col}": ${err.message}`);
      backup[col] = { _error: err.message };
    }
  }

  // Write backup file
  const backupsDir = join(ROOT, 'backups');
  mkdirSync(backupsDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outPath = join(backupsDir, `firestore-backup-${timestamp}.json`);

  await new Promise((resolve, reject) => {
    const stream = createWriteStream(outPath);
    stream.write(JSON.stringify(backup, null, 2));
    stream.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });

  console.log(`\n✅ Backup saved:\n   ${outPath}\n`);

  // Print summary
  console.log('📊 Summary:');
  for (const col of COLLECTIONS) {
    const count = typeof backup[col] === 'object' && !backup[col]._error
      ? Object.keys(backup[col]).length
      : 'ERROR';
    console.log(`   ${col}: ${count} doc(s)`);
  }
}

main().catch(err => {
  console.error('\n❌ Backup failed:', err);
  process.exit(1);
});
