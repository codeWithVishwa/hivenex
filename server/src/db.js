import mongoose from "mongoose";
import dns from "dns";
import Service from "./models/Service.js";

// Some local networks can't resolve MongoDB Atlas SRV records with their default
// DNS. Public resolvers fix that locally. On Vercel the platform DNS already
// works, and overriding it can break things — so only do this off-platform.
if (!process.env.VERCEL) {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  } catch {
    /* ignore */
  }
}
import Post from "./models/Post.js";
import Project from "./models/Project.js";
import FaqItem from "./models/FaqItem.js";
import Stat from "./models/Stat.js";
import User from "./models/User.js";

const seedServices = [
  {
    title: "Web / App Development",
    desc: "Fast, scalable websites and mobile apps engineered for performance and built to convert.",
    tags: ["React", "Next.js", "React Native"],
  },
  {
    title: "Software Solutions",
    desc: "Custom platforms, dashboards and automation tailored to how your business actually runs.",
    tags: ["SaaS", "APIs", "Automation"],
  },
  {
    title: "Digital Marketing",
    desc: "Performance campaigns, SEO and social strategy that put your brand in front of the right people.",
    tags: ["SEO", "Ads", "Social"],
  },
  {
    title: "Content & Product Shoots",
    desc: "Scroll-stopping product photography, content shoots and creative direction for every channel.",
    tags: ["Photography", "Video", "Direction"],
  },
];

const lorem = (title) =>
  `${title}\n\nEvery great product starts with a clear point of view. In this piece we break down the thinking, the trade-offs, and the concrete steps our team takes on real client work.\n\nWe cover what actually moves the needle, the mistakes to avoid, and a simple framework you can apply this week. The goal isn't theory — it's results you can measure.\n\nIf you'd like us to apply this to your project, register your interest and we'll set up a discovery call.`;

const seedPosts = [
  {
    category: "Development",
    title: "Why your website speed is costing you customers",
    excerpt:
      "A breakdown of Core Web Vitals and the small fixes that turn bounce rates into conversions.",
    content: lorem("Speed is a feature — and a revenue lever."),
    date: "Jun 12, 2026",
    read: "6 min read",
    featured: true,
  },
  {
    category: "Marketing",
    title: "The content shoot checklist we use for every product launch",
    excerpt: "From mood boards to final cut — our exact pre-production workflow.",
    content: lorem("Great content is planned, not lucky."),
    date: "Jun 04, 2026",
    read: "4 min read",
  },
  {
    category: "Software",
    title: "Build vs. buy: choosing the right software stack",
    excerpt: "When custom software pays off, and when off-the-shelf wins.",
    content: lorem("The build-vs-buy decision, demystified."),
    date: "May 28, 2026",
    read: "5 min read",
  },
  {
    category: "Strategy",
    title: "Turning followers into a funnel that actually sells",
    excerpt: "A simple framework for content that drives real revenue.",
    content: lorem("From audience to pipeline."),
    date: "May 19, 2026",
    read: "7 min read",
  },
];

const seedProjects = [
  { name: "Lumen Finance", category: "Fintech · Brand + Web", year: "2025", accent: "#ff5e7a", order: 0 },
  { name: "Atlas Studios", category: "Media · Identity", year: "2025", accent: "#d63f9d", order: 1 },
  { name: "Nova Health", category: "Product · App Design", year: "2024", accent: "#a34dd9", order: 2 },
  { name: "Form & Field", category: "E-commerce · Development", year: "2024", accent: "#7c3aed", order: 3 },
];

const seedFaqs = [
  {
    question: "What services does Hivenex offer?",
    answer:
      "We're a full-stack studio covering web & app development, custom software solutions, digital marketing, and content & product shoots — from the first sketch to the final deploy.",
    order: 0,
  },
  {
    question: "How much does a project cost?",
    answer:
      "Every project is scoped individually. Small sites start in the low thousands, while full product builds are quoted after a discovery call. Tell us your budget and we'll shape the best possible solution around it.",
    order: 1,
  },
  {
    question: "How long does a typical project take?",
    answer:
      "A focused landing page can ship in 1–2 weeks. Brand systems and multi-page sites usually run 4–8 weeks, and full software products are phased over a few months with regular checkpoints.",
    order: 2,
  },
  {
    question: "Do you work with clients remotely?",
    answer:
      "Yes — we're remote-first and collaborate with teams worldwide. You'll get a shared workspace, clear timelines, and direct access to the makers.",
    order: 3,
  },
  {
    question: "Do you offer support after launch?",
    answer:
      "Absolutely. We stick around to measure, refine, and grow what we've built. Ongoing retainers and care plans are available.",
    order: 4,
  },
  {
    question: "How do we get started?",
    answer:
      "Register your interest through the form on the site or email us directly. We'll set up a short discovery call and send over a tailored proposal.",
    order: 5,
  },
];

const seedStats = [
  { value: 120, suffix: "+", label: "Projects shipped", order: 0 },
  { value: 38, suffix: "+", label: "Global clients", order: 1 },
  { value: 14, suffix: "", label: "Design awards", order: 2 },
  { value: 9, suffix: "yr", label: "In the game", order: 3 },
];

export async function seedIfEmpty() {
  if ((await Service.estimatedDocumentCount()) === 0) {
    await Service.insertMany(seedServices);
    console.log("🌱 Seeded default services");
  }
  if ((await Post.estimatedDocumentCount()) === 0) {
    await Post.insertMany(seedPosts);
    console.log("🌱 Seeded default posts");
  }
  if ((await Project.estimatedDocumentCount()) === 0) {
    await Project.insertMany(seedProjects);
    console.log("🌱 Seeded default projects");
  }
  if ((await FaqItem.estimatedDocumentCount()) === 0) {
    await FaqItem.insertMany(seedFaqs);
    console.log("🌱 Seeded default FAQs");
  }
  if ((await Stat.estimatedDocumentCount()) === 0) {
    await Stat.insertMany(seedStats);
    console.log("🌱 Seeded default stats");
  }
  // Seed the super admin account if there are no users yet
  if ((await User.estimatedDocumentCount()) === 0) {
    const username = (
      process.env.SUPER_ADMIN_USERNAME || "superadmin"
    ).toLowerCase();
    const password =
      process.env.SUPER_ADMIN_PASSWORD ||
      process.env.ADMIN_PASSWORD ||
      "admin123";
    await User.create({
      username,
      passwordHash: await User.hashPassword(password),
      role: "super_admin",
    });
    console.log(`🌱 Seeded super admin "${username}"`);
  }
}

export async function connectDB(uri) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  console.log("✅ MongoDB connected");
  await seedIfEmpty();
}

// Connect once and reuse the cached connection. The promise means we never open
// a second connection or re-run seeding, and routes can lazily await it.
let readyPromise;
export function ensureDB() {
  if (!readyPromise) {
    readyPromise = connectDB(process.env.MONGODB_URI).catch((err) => {
      // allow a retry on the next request if the first attempt failed
      readyPromise = undefined;
      throw err;
    });
  }
  return readyPromise;
}
