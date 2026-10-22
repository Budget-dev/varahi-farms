/**
 * Vivaan Farms — Migration Dry-Run (from backup JSON, no credentials needed)
 * ===========================================================================
 * Reads the latest backup JSON and shows EXACTLY what the migration would do.
 * Zero network calls. Zero writes. Safe to run any time.
 *
 * Usage: node scripts/migrate-dryrun.mjs
 */

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ── Find latest backup ────────────────────────────────────────────────────────
const backupsDir = join(ROOT, 'backups');
const files = readdirSync(backupsDir)
  .filter(f => f.startsWith('firestore-backup-') && f.endsWith('.json'))
  .sort()
  .reverse();

if (!files.length) {
  console.error('No backup file found. Run: node scripts/backup-firestore.mjs first.');
  process.exit(1);
}

const backupPath = join(backupsDir, files[0]);
console.log(`\n📂 Reading backup: ${files[0]}\n`);
const backup = JSON.parse(readFileSync(backupPath, 'utf-8'));
const products = Object.entries(backup.products || {}).map(([id, data]) => ({ id, ...data }));

// ── Content being migrated ────────────────────────────────────────────────────
const GHEE_FIELDS = ['highlights', 'shortDescription', 'infoTabs', 'safePure', 'comparison', 'journey', 'badgeLabel'];
const SCHEMA_FIELDS = ['moneyBack', 'trustStrip', 'reviewsSummary', 'faqHeading', 'relatedProductIds', 'seo', 'images', 'slug', 'status', 'memberDiscountPercent', 'variants', 'basePrice', 'title'];

function sep(char = '─', len = 64) { return char.repeat(len); }
function heading(t) { console.log(`\n${sep('═')}\n${t}\n${sep()}`); }

heading('🔍 DRY-RUN — Migration Plan (from backup)');
console.log(`Found ${products.length} products in backup.\n`);

// ── Per-product plan ──────────────────────────────────────────────────────────
heading('Per-Product Updates');

let gheeCount = 0;
let otherCount = 0;
const needsContent = [];

for (const p of products) {
  const isGhee = (p.categoryId || p.cat || '').toLowerCase() === 'ghee';
  const icon = isGhee ? '🧈' : '🍯';
  const name = p.name || p.title || p.id;
  const cat = p.categoryId || p.cat || 'unknown';
  const hasNewVariants = Array.isArray(p.variants) && p.variants.length > 0 && p.variants[0].label !== undefined;
  const hasLegacyVars = Array.isArray(p.vars) && p.vars.length > 0;

  console.log(`\n${icon} [${p.id}]`);
  console.log(`   Name: "${name}"   Category: ${cat}   Status: ${p.status || 'published'}`);

  const toSet = [];
  const alreadySet = [];

  // Schema fields check
  for (const field of SCHEMA_FIELDS) {
    if (p[field] === undefined || p[field] === null) {
      toSet.push(field);
    } else {
      alreadySet.push(field);
    }
  }

  if (isGhee) {
    for (const field of GHEE_FIELDS) {
      if (p[field] === undefined || p[field] === null) {
        toSet.push(field + ' [GHEE CONTENT]');
      }
    }
    gheeCount++;
  } else {
    otherCount++;
    needsContent.push({ id: p.id, name, cat });
  }

  // Variant migration
  if (!hasNewVariants && hasLegacyVars) {
    console.log(`   ⚠  VARIANT MIGRATION: ${p.vars.length} legacy vars[] → variants[]`);
    for (let i = 0; i < p.vars.length; i++) {
      const v = p.vars[i];
      const price = Number(v.p) > 0 ? Number(v.p) : (Number(v.price) > 0 ? Number(v.price) : (p.price || 0));
      const mrp = Number(v.mrp) > 0 ? Number(v.mrp) : price;
      console.log(`      [${i}] label="${v.s}" | price=${price} | mrp=${mrp} | stock=${v.stock || 50} | isDefault=${!!v.on || i === 0}`);
      if (!price || price <= 0) {
        console.log(`           ⚠ BUG: price is 0 or missing for variant "${v.s}" — variant price field name mismatch (v.p = ${v.p}, v.price = ${(v).price})`);
      }
    }
  } else if (hasNewVariants) {
    console.log(`   ✅ Already has new variants[] (${p.variants.length}), skipping variant migration.`);
  } else {
    console.log(`   ⚠  No variants found for this product.`);
  }

  if (toSet.length > 0) {
    console.log(`   📝 WILL SET ${toSet.length} missing field(s):`);
    for (const f of toSet) console.log(`      + ${f}`);
  }
  if (alreadySet.length > 0) {
    console.log(`   ✅ Already present (will NOT overwrite): ${alreadySet.slice(0,6).join(', ')}${alreadySet.length > 6 ? '...' : ''}`);
  }
}

// ── FAQs ──────────────────────────────────────────────────────────────────────
heading('FAQs to be written');
console.log(`  🌐 6 global FAQs → scope: "global" (Tracking And Shipping group)`);
const gheeProducts = products.filter(p => (p.categoryId || p.cat || '').toLowerCase() === 'ghee');
for (const gp of gheeProducts) {
  console.log(`  🧈 5 product-specific FAQs → scope: "${gp.id}" (Product Information group)`);
}

// ── Site Settings ─────────────────────────────────────────────────────────────
heading('Site Settings (siteSettings/main)');
console.log('  Will CREATE with these defaults:');
console.log('    announcementBarText : "Get 12% Off Permanently with Vivaan Membership"');
console.log('    logoText            : "VIVAAN"');
console.log('    logoSubText         : "ORGANIC FARMS"');
console.log('    supportEmail        : "support@varahifarms.com"  ← kept until you confirm vivaanfarms.com mailbox');
console.log('    supportPhone        : "+91 92174 28737"');

// ── Products needing content ──────────────────────────────────────────────────
heading('Non-Ghee Products — Need Content Filled In Admin');
for (const p of needsContent) {
  console.log(`  📋 [${p.id}] "${p.name}" (${p.cat}) — all new section fields left EMPTY`);
}
console.log('\n  ℹ  These products will simply hide their empty sections on the storefront.');
console.log('  ℹ  Admin must use the Product Editor to fill content per product.');

// ── Variant Price Bug ─────────────────────────────────────────────────────────
heading('🐛 Variant Price Bug Analysis');
let bugFound = false;
for (const p of products) {
  if (!Array.isArray(p.vars)) continue;
  for (let i = 0; i < p.vars.length; i++) {
    const v = p.vars[i];
    if ((Number(v.p) <= 0 || v.p === undefined) && (Number(v.price) <= 0 || v.price === undefined)) {
      console.log(`  ❌ [${p.id}] variant "${v.s}": p=${v.p}, price=${v.price} — BOTH zero/missing`);
      bugFound = true;
    } else if (Number(v.p) <= 0 && Number(v.price) > 0) {
      console.log(`  ⚠  [${p.id}] variant "${v.s}": v.p=${v.p} but v.price=${v.price} — stored in wrong field`);
      bugFound = true;
    }
  }
}
if (!bugFound) {
  console.log('  ✅ No price=0 bugs found in backup data.');
  console.log('  ℹ  Root cause was: ProductPurchasePane fallback to VIVAAN_BUFFALO_VARIANTS when product.vars');
  console.log('     had p=0 for some variants. Fix: migration sets correct price in new variants[].price field,');
  console.log('     and storefront reads variants[].price (not legacy v.p).');
}

// ── Summary ───────────────────────────────────────────────────────────────────
heading('SUMMARY');
console.log(`  Products to update   : ${products.length} (${gheeCount} ghee, ${otherCount} other)`);
console.log(`  Ghee content migrated: ${gheeCount} product(s) — highlights, tabs, safe&pure, comparison, journey`);
console.log(`  Empty new fields     : ${otherCount} non-ghee product(s) — sections will auto-hide`);
console.log(`  Global FAQs          : 6 (Tracking And Shipping)`);
console.log(`  Ghee product FAQs    : ${gheeProducts.length * 5} (Product Information, 5 per ghee product)`);
console.log(`  siteSettings created : 1 (main document)`);
console.log('\n  ✅ DRY RUN COMPLETE. No writes were made.');
console.log('  To run the real migration, the admin needs to set GOOGLE_APPLICATION_CREDENTIALS');
console.log('  or use the Firebase Console import tool with the migration data.\n');
