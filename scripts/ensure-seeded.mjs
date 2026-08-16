// Runs on every boot before `next start`. Render's free tier resets the
// local filesystem on every restart/spin-down, so without this the demo
// would boot with an empty database. If data already exists (e.g. you're
// running this locally after already seeding), it's a no-op.
import { execSync } from "node:child_process";
import getDb from "../src/lib/db.js";

const db = getDb();
const { c } = db.prepare("SELECT count(*) AS c FROM users").get();

if (c === 0) {
  console.log("No data found — seeding demo data...");
  execSync("node scripts/seed.mjs", { stdio: "inherit" });
} else {
  console.log(`Found ${c} existing user(s) — skipping seed.`);
}
