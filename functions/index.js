const { onSchedule } = require("firebase-functions/v2/scheduler");
const { logger } = require("firebase-functions");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

initializeApp();

const PUBLIC_DEMO_CLASS_CODE = "PUBLIC-DEMO";

exports.resetPublicDemo = onSchedule({
  schedule: "0 0 * * *",
  timeZone: "Asia/Shanghai",
  region: "asia-east1",
  retryCount: 1,
  timeoutSeconds: 540
}, async () => {
  const db = getFirestore();
  const demoClassRef = db.collection("classes").doc(PUBLIC_DEMO_CLASS_CODE);

  logger.info("Resetting the shared public demo class.");
  await db.recursiveDelete(demoClassRef);
  await demoClassRef.set({
    name: "Today’s public demo",
    teacherUid: PUBLIC_DEMO_CLASS_CODE,
    isPublicDemo: true,
    createdAt: FieldValue.serverTimestamp(),
    resetAt: FieldValue.serverTimestamp()
  });
  logger.info("Shared public demo reset complete.");
});
