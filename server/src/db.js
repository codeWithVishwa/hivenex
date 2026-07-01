import mongoose from "mongoose";
import Service from "./models/Service.js";
import Post from "./models/Post.js";

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

const seedPosts = [
  {
    category: "Development",
    title: "Why your website speed is costing you customers",
    excerpt:
      "A breakdown of Core Web Vitals and the small fixes that turn bounce rates into conversions.",
    date: "Jun 12, 2026",
    read: "6 min read",
    featured: true,
  },
  {
    category: "Marketing",
    title: "The content shoot checklist we use for every product launch",
    excerpt: "From mood boards to final cut — our exact pre-production workflow.",
    date: "Jun 04, 2026",
    read: "4 min read",
  },
  {
    category: "Software",
    title: "Build vs. buy: choosing the right software stack",
    excerpt: "When custom software pays off, and when off-the-shelf wins.",
    date: "May 28, 2026",
    read: "5 min read",
  },
  {
    category: "Strategy",
    title: "Turning followers into a funnel that actually sells",
    excerpt: "A simple framework for content that drives real revenue.",
    date: "May 19, 2026",
    read: "7 min read",
  },
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
}

export async function connectDB(uri) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  console.log("✅ MongoDB connected");
  await seedIfEmpty();
}
