import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import getDb from "./db";

const SECRET = process.env.SESSION_SECRET || "dev-only-insecure-secret-change-me";
const COOKIE_NAME = "campus_hub_session";

// Personal email providers aren't campus emails, so we reject the obvious
// ones. Everything else is accepted and the domain after "@" becomes the
// user's "campus" for scoping Plans / Opportunities / Exchange listings.
const BLOCKED_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
]);

export function schoolDomainFromEmail(email) {
  const domain = email.split("@")[1]?.toLowerCase().trim();
  return domain || null;
}

export function isValidSchoolEmail(email) {
  const domain = schoolDomainFromEmail(email);
  if (!domain || !domain.includes(".")) return false;
  if (BLOCKED_DOMAINS.has(domain)) return false;
  return true;
}

export function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

export function signSession(userId) {
  return jwt.sign({ uid: userId }, SECRET, { expiresIn: "30d" });
}

export async function setSessionCookie(userId) {
  const store = await cookies();
  store.set(COOKIE_NAME, signSession(userId), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getCurrentUser() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { uid } = jwt.verify(token, SECRET);
    const db = getDb();
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(uid);
    return user || null;
  } catch {
    return null;
  }
}

export function publicUser(user) {
  if (!user) return null;
  const { password_hash, ...rest } = user;
  return rest;
}
