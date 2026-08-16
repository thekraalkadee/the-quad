"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import getDb from "./db";
import {
  hashPassword,
  verifyPassword,
  setSessionCookie,
  clearSessionCookie,
  getCurrentUser,
  isValidSchoolEmail,
  schoolDomainFromEmail,
} from "./auth";

function str(formData, key) {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

// ---------- Auth ----------

export async function registerUser(formData) {
  const email = str(formData, "email").toLowerCase();
  const password = str(formData, "password");
  const name = str(formData, "name");
  const role = str(formData, "role");

  if (!email || !password || !name || !role) {
    redirect("/signup?error=" + encodeURIComponent("All fields are required."));
  }
  if (!isValidSchoolEmail(email)) {
    redirect(
      "/signup?error=" +
        encodeURIComponent("Please use your school email address, not a personal one.")
    );
  }
  if (password.length < 8) {
    redirect(
      "/signup?error=" + encodeURIComponent("Password must be at least 8 characters.")
    );
  }
  if (!["student", "professor", "org"].includes(role)) {
    redirect("/signup?error=" + encodeURIComponent("Pick a valid account type."));
  }

  const db = getDb();
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    redirect(
      "/signup?error=" + encodeURIComponent("An account with that email already exists.")
    );
  }

  const school_domain = schoolDomainFromEmail(email);
  const password_hash = hashPassword(password);

  const major = str(formData, "major") || null;
  const minor = str(formData, "minor") || null;
  const class_year = str(formData, "class_year") || null;
  const department = str(formData, "department") || null;
  const interests = str(formData, "interests") || null;
  const org_name = str(formData, "org_name") || null;
  const org_category = str(formData, "org_category") || null;

  const result = db
    .prepare(
      `INSERT INTO users
        (email, password_hash, name, role, school_domain, major, minor, class_year, department, interests, org_name, org_category)
       VALUES (@email, @password_hash, @name, @role, @school_domain, @major, @minor, @class_year, @department, @interests, @org_name, @org_category)`
    )
    .run({
      email,
      password_hash,
      name,
      role,
      school_domain,
      major,
      minor,
      class_year: class_year ? Number(class_year) : null,
      department,
      interests,
      org_name,
      org_category,
    });

  await setSessionCookie(Number(result.lastInsertRowid));
  redirect("/");
}

export async function loginUser(formData) {
  const email = str(formData, "email").toLowerCase();
  const password = str(formData, "password");

  const db = getDb();
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user || !verifyPassword(password, user.password_hash)) {
    redirect("/login?error=" + encodeURIComponent("Incorrect email or password."));
  }

  await setSessionCookie(user.id);
  redirect("/");
}

export async function logoutUser() {
  await clearSessionCookie();
  redirect("/");
}

// ---------- Plan Explorer ----------

export async function createPlan(formData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "student") {
    redirect("/plans?error=" + encodeURIComponent("Only student accounts can post a plan."));
  }

  const db = getDb();
  const title = str(formData, "title");
  const majors = str(formData, "majors");
  const minors = str(formData, "minors");
  const entry_credit = str(formData, "entry_credit");
  const path_type = str(formData, "path_type");
  const class_year = str(formData, "class_year");
  const visibility = str(formData, "visibility") || "public";
  const summary = str(formData, "summary");
  const terms_json = str(formData, "terms_json") || "[]";

  if (!title || !majors || !path_type) {
    redirect("/plans/new?error=" + encodeURIComponent("Title, major(s), and path type are required."));
  }

  db.prepare(
    `INSERT INTO plans (user_id, school_domain, title, majors, minors, entry_credit, path_type, class_year, visibility, summary, terms_json)
     VALUES (@user_id, @school_domain, @title, @majors, @minors, @entry_credit, @path_type, @class_year, @visibility, @summary, @terms_json)`
  ).run({
    user_id: user.id,
    school_domain: user.school_domain,
    title,
    majors,
    minors: minors || null,
    entry_credit: entry_credit || null,
    path_type,
    class_year: class_year ? Number(class_year) : null,
    visibility,
    summary: summary || null,
    terms_json,
  });

  revalidatePath("/plans");
  redirect("/plans");
}

export async function askPlanQuestion(planId, formData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const body = str(formData, "body");
  if (!body) return;

  const db = getDb();
  db.prepare(
    `INSERT INTO plan_questions (plan_id, user_id, body) VALUES (?, ?, ?)`
  ).run(planId, user.id, body);

  revalidatePath(`/plans/${planId}`);
}

// ---------- Opportunity Board ----------

export async function createOpportunity(formData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "professor" && user.role !== "org") {
    redirect(
      "/opportunities?error=" +
        encodeURIComponent("Only professor or student org accounts can post opportunities.")
    );
  }

  const db = getDb();
  const title = str(formData, "title");
  const type = str(formData, "type");
  const category = str(formData, "category");
  const target_majors = str(formData, "target_majors");
  const level = str(formData, "level") || "no_prereq";
  const event_date = str(formData, "event_date");
  const deadline = str(formData, "deadline");
  const apply_link = str(formData, "apply_link");
  const apply_instructions = str(formData, "apply_instructions");
  const contact = str(formData, "contact");
  const description = str(formData, "description");

  if (!title || !type) {
    redirect("/opportunities/new?error=" + encodeURIComponent("Title and type are required."));
  }
  if (!apply_link && !apply_instructions) {
    redirect(
      "/opportunities/new?error=" +
        encodeURIComponent("Provide an application link, or instructions for how to apply.")
    );
  }

  db.prepare(
    `INSERT INTO opportunities
      (user_id, school_domain, title, type, category, target_majors, level, event_date, deadline, apply_link, apply_instructions, contact, description)
     VALUES (@user_id, @school_domain, @title, @type, @category, @target_majors, @level, @event_date, @deadline, @apply_link, @apply_instructions, @contact, @description)`
  ).run({
    user_id: user.id,
    school_domain: user.school_domain,
    title,
    type,
    category: category || null,
    target_majors: target_majors || null,
    level,
    event_date: event_date || null,
    deadline: deadline || null,
    apply_link: apply_link || null,
    apply_instructions: apply_instructions || null,
    contact: contact || null,
    description: description || null,
  });

  revalidatePath("/opportunities");
  redirect("/opportunities");
}

// ---------- The Exchange ----------

export async function createListing(formData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const db = getDb();
  const kind = str(formData, "kind") || "item";
  const title = str(formData, "title");
  const category = str(formData, "category");
  const price = str(formData, "price");
  const condition = str(formData, "condition");
  const description = str(formData, "description");
  const pickup_area = str(formData, "pickup_area");
  const date_range = str(formData, "date_range");
  const room_type = str(formData, "room_type");
  const amenities = str(formData, "amenities");

  if (!title) {
    redirect("/exchange/new?error=" + encodeURIComponent("Title is required."));
  }

  db.prepare(
    `INSERT INTO listings
      (user_id, school_domain, kind, title, category, price, condition, description, pickup_area, date_range, room_type, amenities)
     VALUES (@user_id, @school_domain, @kind, @title, @category, @price, @condition, @description, @pickup_area, @date_range, @room_type, @amenities)`
  ).run({
    user_id: user.id,
    school_domain: user.school_domain,
    kind,
    title,
    category: category || null,
    price: price || null,
    condition: condition || null,
    description: description || null,
    pickup_area: pickup_area || null,
    date_range: date_range || null,
    room_type: room_type || null,
    amenities: amenities || null,
  });

  revalidatePath("/exchange");
  redirect("/exchange");
}

export async function sendListingMessage(listingId, formData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const body = str(formData, "body");
  if (!body) return;

  const db = getDb();
  db.prepare(
    `INSERT INTO listing_messages (listing_id, user_id, body) VALUES (?, ?, ?)`
  ).run(listingId, user.id, body);

  revalidatePath(`/exchange/${listingId}`);
}
