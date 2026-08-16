// Seeds fictional demo data — no real student, faculty, or institutional
// records are used, per the Pathfinders Challenge rules (Section 8).
import bcrypt from "bcryptjs";
import getDb from "../src/lib/db.js";

const db = getDb();

console.log("Clearing existing data...");
db.exec(`
  DELETE FROM listing_messages;
  DELETE FROM listings;
  DELETE FROM plan_questions;
  DELETE FROM plans;
  DELETE FROM opportunities;
  DELETE FROM users;
  DELETE FROM sqlite_sequence;
`);

const PASSWORD_HASH = bcrypt.hashSync("password123", 10);

function insertUser(u) {
  const result = db
    .prepare(
      `INSERT INTO users (email, password_hash, name, role, school_domain, major, minor, class_year, department, interests, org_name, org_category)
       VALUES (@email, @password_hash, @name, @role, @school_domain, @major, @minor, @class_year, @department, @interests, @org_name, @org_category)`
    )
    .run({
      password_hash: PASSWORD_HASH,
      major: null,
      minor: null,
      class_year: null,
      department: null,
      interests: null,
      org_name: null,
      org_category: null,
      ...u,
    });
  return Number(result.lastInsertRowid);
}

const DOMAIN = "u.northwestern.edu";

console.log("Seeding users...");
const maya = insertUser({
  email: "maya.chen@u.northwestern.edu",
  name: "Maya Chen",
  role: "student",
  school_domain: DOMAIN,
  major: "Computer Science",
  minor: "Statistics",
  class_year: 2027,
});

const diego = insertUser({
  email: "diego.ramirez@u.northwestern.edu",
  name: "Diego Ramirez",
  role: "student",
  school_domain: DOMAIN,
  major: "Economics",
  class_year: 2026,
});

const amara = insertUser({
  email: "amara.okafor@u.northwestern.edu",
  name: "Amara Okafor",
  role: "student",
  school_domain: DOMAIN,
  major: "Biology (Pre-Med)",
  class_year: 2028,
});

const priya = insertUser({
  email: "priya.patel@u.northwestern.edu",
  name: "Priya Patel",
  role: "student",
  school_domain: DOMAIN,
  major: "Computer Science",
  minor: "Economics",
  class_year: 2027,
});

const lindholm = insertUser({
  email: "s-lindholm@u.northwestern.edu",
  name: "Dr. Sarah Lindholm",
  role: "professor",
  school_domain: DOMAIN,
  department: "Computer Science",
  interests: "Human-Computer Interaction, AI Ethics",
});

const dsClub = insertUser({
  email: "board@u.northwestern.edu",
  name: "Jordan Lee",
  role: "org",
  school_domain: DOMAIN,
  org_name: "Northwestern Data Science Club",
  org_category: "Academic",
});

// A student at a different campus, to prove scoping — should never show up
// in a u.northwestern.edu account's Plan Explorer, Opportunity Board, or Exchange.
insertUser({
  email: "jamie.fox@sample.edu",
  name: "Jamie Fox",
  role: "student",
  school_domain: "sample.edu",
  major: "Mechanical Engineering",
  class_year: 2027,
});

console.log("Seeding plans...");
const insertPlan = db.prepare(
  `INSERT INTO plans (user_id, school_domain, title, majors, minors, entry_credit, path_type, class_year, visibility, summary, terms_json)
   VALUES (@user_id, @school_domain, @title, @majors, @minors, @entry_credit, @path_type, @class_year, @visibility, @summary, @terms_json)`
);

insertPlan.run({
  user_id: maya,
  school_domain: DOMAIN,
  title: "CS + Stats minor, no prior credit",
  majors: "Computer Science",
  minors: "Statistics",
  entry_credit: "None — started from scratch freshman fall",
  path_type: "traditional",
  class_year: 2027,
  visibility: "public",
  summary:
    "Didn't come in with AP credit, so I front-loaded intro CS + math freshman year to leave room for the stats minor later without an overload term.",
  terms_json: JSON.stringify([
    {
      name: "Fall 2023",
      courses: "COMP_SCI 111, MATH 220, WCAS First-Year Seminar",
      note: "Took COMP_SCI 111 before declaring anything — glad I did, confirmed the major early.",
    },
    {
      name: "Winter 2024",
      courses: "COMP_SCI 211, MATH 224, STAT 202",
      note: "STAT 202 counts toward both the CS requirement and the stats minor — don't skip it.",
    },
    {
      name: "Fall 2024",
      courses: "COMP_SCI 214, COMP_SCI 336, STAT 210",
      note: "COMP_SCI 336 is a lighter workload with Prof. Lindholm than the other sections — ask around before picking a section.",
    },
  ]),
});

insertPlan.run({
  user_id: diego,
  school_domain: DOMAIN,
  title: "Transferred in junior year with 42 credits",
  majors: "Economics",
  minors: null,
  entry_credit: "42 transfer credits from a community college, econ core mostly waived",
  path_type: "transfer",
  class_year: 2026,
  visibility: "public",
  summary:
    "Advising had no template for a junior-year transfer — most of what I figured out came from asking other transfer students directly.",
  terms_json: JSON.stringify([
    {
      name: "Fall 2024 (first term on campus)",
      courses: "ECON 310, ECON 311, POLI_SCI 220",
      note: "Petitioned to waive ECON 201/202 with transfer credit — took 6 weeks, start that paperwork on day one.",
    },
    {
      name: "Winter 2025",
      courses: "ECON 315, ECON 350, ECON 398",
      note: "ECON 398 (independent study) let me finish a requirement that only ran in a term I couldn't take it.",
    },
  ]),
});

insertPlan.run({
  user_id: amara,
  school_domain: DOMAIN,
  title: "Pre-med Biology, still finding the right course order",
  majors: "Biology (Pre-Med)",
  minors: null,
  entry_credit: "8 AP credits (Bio, Chem) — didn't use them for placement",
  path_type: "pre_med",
  class_year: 2028,
  visibility: "anonymous",
  summary:
    "Posting anonymously since pre-med timelines get compared a lot, but happy to answer questions about MCAT timing vs. coursework.",
  terms_json: JSON.stringify([
    {
      name: "Fall 2024",
      courses: "BIOL_SCI 215, CHEM 131, MATH 220",
      note: "Didn't use AP credit for gen chem placement — wanted the review before organic chem.",
    },
    {
      name: "Winter 2025",
      courses: "BIOL_SCI 216, CHEM 132, PSYC 110",
      note: "Took PSYC 110 early since it's on the MCAT and I wanted it while gen chem was still fresh.",
    },
  ]),
});

insertPlan.run({
  user_id: priya,
  school_domain: DOMAIN,
  title: "CS + Econ double major in 4 years",
  majors: "Computer Science, Economics",
  minors: null,
  entry_credit: "12 AP credits (CS A, Calc BC) applied toward CS elective + math requirement",
  path_type: "double_major",
  class_year: 2027,
  visibility: "public",
  summary:
    "The two majors share almost no overlap in requirements, so the trick was using summer + a slightly heavier junior fall instead of overloading every term.",
  terms_json: JSON.stringify([
    {
      name: "Fall 2023",
      courses: "COMP_SCI 111 (waived via AP), ECON 201, MATH 224",
      note: "AP CS credit let me skip straight to COMP_SCI 211 — confirm your AP score actually waives it before you rely on this.",
    },
    {
      name: "Summer 2025",
      courses: "ECON 281 (online)",
      note: "One summer online econ elective was the difference between a 5-class and a 4-class junior fall.",
    },
  ]),
});

console.log("Seeding opportunities...");
const insertOpp = db.prepare(
  `INSERT INTO opportunities (user_id, school_domain, title, type, category, target_majors, level, event_date, deadline, apply_link, apply_instructions, contact, description)
   VALUES (@user_id, @school_domain, @title, @type, @category, @target_majors, @level, @event_date, @deadline, @apply_link, @apply_instructions, @contact, @description)`
);

insertOpp.run({
  user_id: dsClub,
  school_domain: DOMAIN,
  title: "Women in Data Science Case Competition",
  type: "competition",
  category: "Case Competition",
  target_majors: "Computer Science, Data Science, Economics, Statistics",
  level: "intermediate",
  event_date: "Oct 18, 2026",
  deadline: "Oct 3, 2026",
  apply_link: "https://forms.example.com/wids-case-comp",
  apply_instructions: null,
  contact: null,
  description:
    "Weekend case competition on a real dataset, judged by industry partners. Teams of 3-4, no prior case comp experience required.",
});

insertOpp.run({
  user_id: lindholm,
  school_domain: DOMAIN,
  title: "AI Ethics Reading Group",
  type: "session",
  category: "Reading Group",
  target_majors: "",
  level: "no_prereq",
  event_date: "Weekly, Thursdays 5pm",
  deadline: null,
  apply_link: null,
  apply_instructions:
    "No application needed — email Dr. Lindholm to be added to the weekly reading list and meeting invite.",
  contact: "s-lindholm@u.northwestern.edu",
  description:
    "Open discussion group on AI ethics papers, open to all majors and class years. New members welcome any week.",
});

insertOpp.run({
  user_id: lindholm,
  school_domain: DOMAIN,
  title: "Undergraduate Research Assistant — HCI Lab",
  type: "research",
  category: "Research",
  target_majors: "Computer Science",
  level: "advanced",
  event_date: null,
  deadline: "Rolling",
  apply_link: null,
  apply_instructions:
    "Email a resume and one paragraph on why you're interested. Prior coursework in HCI or a strong portfolio project preferred.",
  contact: "s-lindholm@u.northwestern.edu",
  description:
    "Paid research assistant position for the HCI Lab, working on accessibility-focused interface research.",
});

insertOpp.run({
  user_id: dsClub,
  school_domain: DOMAIN,
  title: "Fall Case Competition Info Session",
  type: "meeting",
  category: "Info Session",
  target_majors: "",
  level: "no_prereq",
  event_date: "Sep 22, 2026",
  deadline: null,
  apply_link: "https://forms.example.com/wids-info-session-rsvp",
  apply_instructions: null,
  contact: null,
  description: "Learn what the case competition involves and find a team before the deadline.",
});

console.log("Seeding exchange listings...");
const insertListing = db.prepare(
  `INSERT INTO listings (user_id, school_domain, kind, title, category, price, condition, description, pickup_area, date_range, room_type, amenities)
   VALUES (@user_id, @school_domain, @kind, @title, @category, @price, @condition, @description, @pickup_area, @date_range, @room_type, @amenities)`
);

insertListing.run({
  user_id: maya,
  school_domain: DOMAIN,
  kind: "item",
  title: "IKEA desk, barely used",
  category: "furniture",
  price: "$25",
  condition: "Like new",
  description: "Moving out of the dorm and don't have room in the car. White IKEA Micke desk.",
  pickup_area: "Near South Campus dorms",
  date_range: null,
  room_type: null,
  amenities: null,
});

insertListing.run({
  user_id: diego,
  school_domain: DOMAIN,
  kind: "sublet",
  title: "Private room sublet, fall quarter",
  category: null,
  price: "$850/mo",
  condition: null,
  description: "Subletting my room while I'm on a fall co-op. 5 minute walk to campus.",
  pickup_area: "Off-campus, near downtown Evanston",
  date_range: "Sep-Dec 2026",
  room_type: "Private room in 2BR apartment",
  amenities: "In-unit laundry, dishwasher",
});

insertListing.run({
  user_id: amara,
  school_domain: DOMAIN,
  kind: "item",
  title: "Mini fridge — free",
  category: "free",
  price: "Free",
  condition: "Works fine, a little scratched",
  description: "Graduating, needs to go by end of the week. First come first served.",
  pickup_area: "Near South Campus dorms",
  date_range: null,
  room_type: null,
  amenities: null,
});

insertListing.run({
  user_id: priya,
  school_domain: DOMAIN,
  kind: "item",
  title: "Intro econ + CS textbook bundle",
  category: "textbooks",
  price: "$40 for all",
  condition: "Good, some highlighting",
  description: "ECON 201/202 and COMP_SCI 211 textbooks. Saved me a ton — passing it on.",
  pickup_area: "General area near campus, will message exact spot",
  date_range: null,
  room_type: null,
  amenities: null,
});

console.log("Done. Demo login for any seeded student/professor/org account: password123");
