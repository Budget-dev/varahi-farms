/**
 * Vivaan Farms — Firestore Security Rules Real Emulator Unit Tests
 * =================================================================
 * Executed against the real Cloud Firestore Emulator using @firebase/rules-unit-testing.
 */

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { resolve } from 'path';

let testEnv: RulesTestEnvironment;

const PROJECT_ID = 'vivanfarms-test-env';
const ADMIN_EMAIL = 'vivanfarmsnatural@gmail.com';

export async function setup() {
  const hostPort = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080';
  const [host, portStr] = hostPort.split(':');
  const port = parseInt(portStr || '8080', 10);

  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync(resolve('firestore.rules'), 'utf8'),
      host,
      port,
    },
  });
}

export async function teardown() {
  if (testEnv) await testEnv.cleanup();
}

async function runTest(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    console.log(`  ✅ PASS: ${name}`);
    return true;
  } catch (err: any) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message || err}`);
    return false;
  }
}

export async function main() {
  console.log('\n════════════════════════════════════════════════════════════════');
  console.log('🧪 RUNNING FIRESTORE RULES TESTS AGAINST REAL FIRESTORE EMULATOR');
  console.log('════════════════════════════════════════════════════════════════\n');

  await setup();
  let passed = 0;
  let failed = 0;

  async function check(name: string, fn: () => Promise<void>) {
    const ok = await runTest(name, fn);
    if (ok) passed++;
    else failed++;
  }

  // 1. Products: public reads published only; drafts blocked; admin reads draft
  console.log('1. Products Read (Public vs Admin):');
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await db.collection('products').doc('prod-pub').set({ status: 'published', name: 'Desi Ghee' });
    await db.collection('products').doc('prod-draft').set({ status: 'draft', name: 'Honey Draft' });
  });

  const unauthDb = testEnv.unauthenticatedContext().firestore();
  await check('Public reads published product', async () => {
    await assertSucceeds(unauthDb.collection('products').doc('prod-pub').get());
  });
  await check('Public blocked from draft product', async () => {
    await assertFails(unauthDb.collection('products').doc('prod-draft').get());
  });
  await check('Admin reads draft product', async () => {
    const adminDb = testEnv.authenticatedContext('admin-uid', { email: ADMIN_EMAIL, email_verified: true }).firestore();
    await assertSucceeds(adminDb.collection('products').doc('prod-draft').get());
  });

  // 2. Reviews: public reads approved only
  console.log('\n2. Reviews Public Read:');
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await db.collection('reviews').doc('rev-approved').set({ status: 'approved', productId: 'p1', userId: 'user-a', helpfulCount: 0, helpfulUsers: [] });
    await db.collection('reviews').doc('rev-pending').set({ status: 'pending', productId: 'p1', userId: 'user-a', helpfulCount: 0, helpfulUsers: [] });
  });

  await check('Public reads approved review', async () => {
    await assertSucceeds(unauthDb.collection('reviews').doc('rev-approved').get());
  });
  await check('Public blocked from pending review', async () => {
    await assertFails(unauthDb.collection('reviews').doc('rev-pending').get());
  });

  // 3. Author reads own pending review; other user blocked
  console.log('\n3. Author Review Access:');
  const authorDb = testEnv.authenticatedContext('user-a').firestore();
  const otherDb = testEnv.authenticatedContext('user-b').firestore();
  await check('Author reads own pending review', async () => {
    await assertSucceeds(authorDb.collection('reviews').doc('rev-pending').get());
  });
  await check('Other customer blocked from reading pending review', async () => {
    await assertFails(otherDb.collection('reviews').doc('rev-pending').get());
  });

  // 4. Guest review creation blocked
  console.log('\n4. Guest Review Creation:');
  await check('Guest blocked from creating review', async () => {
    await assertFails(
      unauthDb.collection('reviews').doc('rev-new-guest').set({
        productId: 'p1',
        userId: 'anonymous',
        rating: 5,
        status: 'pending',
        isVerified: false,
        helpfulCount: 0,
      })
    );
  });

  // 5. Signed-in review creation validation
  console.log('\n5. Review Create Field Validation:');
  await check('Signed-in user creates valid pending review', async () => {
    await assertSucceeds(
      authorDb.collection('reviews').doc('rev-valid').set({
        productId: 'p1',
        userId: 'user-a',
        rating: 5,
        status: 'pending',
        isVerified: false,
        helpfulCount: 0,
      })
    );
  });
  await check('Cannot create review with status="approved"', async () => {
    await assertFails(
      authorDb.collection('reviews').doc('rev-bad-1').set({
        productId: 'p1',
        userId: 'user-a',
        rating: 5,
        status: 'approved',
        isVerified: false,
        helpfulCount: 0,
      })
    );
  });
  await check('Cannot create review with isVerified=true', async () => {
    await assertFails(
      authorDb.collection('reviews').doc('rev-bad-2').set({
        productId: 'p1',
        userId: 'user-a',
        rating: 5,
        status: 'pending',
        isVerified: true,
        helpfulCount: 0,
      })
    );
  });
  await check('Cannot create review with verifiedPurchase=true', async () => {
    await assertFails(
      authorDb.collection('reviews').doc('rev-bad-3').set({
        productId: 'p1',
        userId: 'user-a',
        rating: 5,
        status: 'pending',
        isVerified: false,
        verifiedPurchase: true,
        helpfulCount: 0,
      })
    );
  });
  await check('Cannot create review with adminReply', async () => {
    await assertFails(
      authorDb.collection('reviews').doc('rev-bad-4').set({
        productId: 'p1',
        userId: 'user-a',
        rating: 5,
        status: 'pending',
        isVerified: false,
        adminReply: 'Fake Reply',
        helpfulCount: 0,
      })
    );
  });
  await check('Cannot create review with rating=6', async () => {
    await assertFails(
      authorDb.collection('reviews').doc('rev-bad-5').set({
        productId: 'p1',
        userId: 'user-a',
        rating: 6,
        status: 'pending',
        isVerified: false,
        helpfulCount: 0,
      })
    );
  });

  // 6. Orders: Customer lists only own orders, cannot list all orders
  console.log('\n6. Orders Listing Protection:');
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await db.collection('orders').doc('ord-user-a').set({ userId: 'user-a', status: 'Delivered' });
    await db.collection('orders').doc('ord-user-b').set({ userId: 'user-b', status: 'Delivered' });
  });

  await check('Customer queries with own userId filter', async () => {
    await assertSucceeds(authorDb.collection('orders').where('userId', '==', 'user-a').get());
  });
  await check('Customer blocked from listing all orders (unfiltered)', async () => {
    await assertFails(authorDb.collection('orders').get());
  });
  await check('Customer blocked from querying other customer orders', async () => {
    await assertFails(authorDb.collection('orders').where('userId', '==', 'user-b').get());
  });
  await check('Admin can list all orders', async () => {
    const adminDb = testEnv.authenticatedContext('admin-uid', { email: ADMIN_EMAIL, email_verified: true }).firestore();
    await assertSucceeds(adminDb.collection('orders').get());
  });

  // 7. Non-admin write restrictions
  console.log('\n7. Non-Admin Write Restrictions:');
  await check('Customer blocked from writing products', async () => {
    await assertFails(authorDb.collection('products').doc('p-new').set({ name: 'Hacked' }));
  });
  await check('Customer blocked from writing faqs', async () => {
    await assertFails(authorDb.collection('faqs').doc('faq-new').set({ question: 'Hacked?' }));
  });
  await check('Customer blocked from writing siteSettings', async () => {
    await assertFails(authorDb.collection('siteSettings').doc('main').set({ logoText: 'Hacked' }));
  });

  // 8. Admin permissions
  console.log('\n8. Master Admin Permissions:');
  const adminDb = testEnv.authenticatedContext('admin-uid', {
    email: ADMIN_EMAIL,
    email_verified: true,
  }).firestore();
  const unverifiedAdminDb = testEnv.authenticatedContext('admin-uid-unverified', {
    email: ADMIN_EMAIL,
    email_verified: false,
  }).firestore();

  await check('Verified admin can write products', async () => {
    await assertSucceeds(adminDb.collection('products').doc('p-admin').set({ name: 'Admin Ghee', status: 'draft' }));
  });
  await check('Verified admin can write faqs', async () => {
    await assertSucceeds(adminDb.collection('faqs').doc('faq-admin').set({ question: 'Admin FAQ' }));
  });
  await check('Verified admin can write siteSettings', async () => {
    await assertSucceeds(adminDb.collection('siteSettings').doc('main').set({ logoText: 'VIVAAN' }));
  });
  await check('Unverified admin email is REJECTED', async () => {
    await assertFails(unverifiedAdminDb.collection('products').doc('p-hacked').set({ name: 'Hacked' }));
  });

  // 9. Review updates & helpful votes
  console.log('\n9. Review Updates & Helpful Votes:');
  await check('Author edits comment while keeping status pending', async () => {
    await assertSucceeds(
      authorDb.collection('reviews').doc('rev-valid').update({
        comment: 'Updated review note',
        status: 'pending',
      })
    );
  });
  await check('Author blocked from self-approving review (status="approved")', async () => {
    await assertFails(
      authorDb.collection('reviews').doc('rev-valid').update({
        status: 'approved',
      })
    );
  });
  await check('Author blocked from setting isVerified=true', async () => {
    await assertFails(
      authorDb.collection('reviews').doc('rev-valid').update({
        isVerified: true,
      })
    );
  });

  const voterDb = testEnv.authenticatedContext('voter-1').firestore();
  await check('Voter increments helpfulCount by exactly 1 and adds self', async () => {
    await assertSucceeds(
      voterDb.collection('reviews').doc('rev-approved').update({
        helpfulCount: 1,
        helpfulUsers: ['voter-1'],
      })
    );
  });
  await check('Voter blocked from incrementing helpfulCount by 2', async () => {
    await assertFails(
      voterDb.collection('reviews').doc('rev-approved').update({
        helpfulCount: 3,
        helpfulUsers: ['voter-1'],
      })
    );
  });
  await check('Voter blocked from voting twice', async () => {
    await assertFails(
      voterDb.collection('reviews').doc('rev-approved').update({
        helpfulCount: 2,
        helpfulUsers: ['voter-1'],
      })
    );
  });

  console.log('\n════════════════════════════════════════════════════════════════');
  console.log(`REAL EMULATOR SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('════════════════════════════════════════════════════════════════\n');

  await teardown();
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
