interface PostHeader {
  title: string;
  date: string;
  author: string;
  summary: string;
  filename: string;
}

interface PostsManifest {
  latest: string;
  posts: string[];
}

// ── Fetching ──────────────────────────────────────────────────────────────────

async function fetchManifest(): Promise<PostsManifest> {
  const res = await fetch("posts/posts.json");
  if (!res.ok) throw new Error(`Could not load posts/posts.json (${res.status})`);
  return res.json();
}

async function fetchPostHeader(filename: string): Promise<PostHeader | null> {
  const res = await fetch(`posts/${filename}`);
  if (!res.ok) return null;

  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, "text/html");
  const header = doc.querySelector(".post-header");
  if (!header) return null;

  const title = header.querySelector(".post-title")?.textContent?.trim() ?? "";
  if (!title) return null;

  return {
    title,
    date:     header.querySelector(".post-date")?.textContent?.trim()   ?? "",
    author:   header.querySelector(".post-author")?.textContent?.trim() ?? "",
    summary:  header.querySelector(".post-summary")?.textContent?.trim() ?? "",
    filename,
  };
}

// ── Date helpers ──────────────────────────────────────────────────────────────

function toTimestamp(dateStr: string): number {
  const t = new Date(dateStr).getTime();
  return isNaN(t) ? 0 : t;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

// ── DOM builders ──────────────────────────────────────────────────────────────

function buildPostCard(post: PostHeader): HTMLElement {
  const article = document.createElement("article");
  article.className = "post-card";

  const baseDiv = document.createElement("div");
  baseDiv.className = "card-base";

  const link = document.createElement("a");
  link.href = `posts/${post.filename}`;
  link.className = "card-link";

  const meta = document.createElement("div");
  meta.className = "card-meta";

  const dateEl = document.createElement("time");
  dateEl.className = "card-date";
  dateEl.dateTime = post.date;
  dateEl.textContent = formatDate(post.date);

  const authorEl = document.createElement("span");
  authorEl.className = "card-author";
  authorEl.textContent = post.author;

  meta.append(dateEl, authorEl);

  const titleEl = document.createElement("h2");
  titleEl.className = "card-title";
  titleEl.textContent = post.title;

  const summaryEl = document.createElement("p");
  summaryEl.className = "card-summary";
  summaryEl.textContent = post.summary;

  const cta = document.createElement("span");
  cta.className = "card-cta";
  cta.textContent = "Read Devlog ";

  const arrow = document.createElement("span");
  arrow.className = "card-arrow";
  arrow.textContent = "→";
  cta.appendChild(arrow);

  baseDiv.append(meta, titleEl, summaryEl, cta);
  link.appendChild(baseDiv)
  article.appendChild(link);
  return article;
}

function setStatus(container: HTMLElement, className: string, message: string): void {
  container.innerHTML = "";
  const p = document.createElement("p");
  p.className = className;
  p.textContent = message;
  container.appendChild(p);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function loadPosts(): Promise<void> {
  
  const container = document.getElementById("posts-container");
  const countEl   = document.querySelector<HTMLElement>(".post-count");
  if (!container) return;

  setStatus(container, "posts-loading", "Loading posts…");

  let manifest: PostsManifest;
  try {
    manifest = await fetchManifest();
  } catch (err) {
    setStatus(container, "posts-error", "Could not load post list. Make sure posts/posts.json exists.");
    console.error(err);
    return;
  }

  const results = await Promise.all(
    manifest.posts.map(filename => fetchPostHeader(filename))
  );

  const posts = results
    .filter((p): p is PostHeader => p !== null)
    .sort((a, b) => toTimestamp(b.date) - toTimestamp(a.date));

  container.innerHTML = "";

  if (posts.length === 0) {
    setStatus(container, "posts-empty", "No posts found. Add HTML files to posts/ and update posts.json.");
    return;
  }

  if (countEl) {
    countEl.textContent = `${posts.length} Devlog${posts.length !== 1 ? "s" : ""}`;
  }

  for (const post of posts) {
    container.appendChild(buildPostCard(post));
  }
}

async function loadLatestPost(): Promise<void> {
  
  const container = document.getElementById("posts-container-latest");
  const countEl   = document.querySelector<HTMLElement>(".post-count");
  if (!container) return;

  setStatus(container, "posts-loading", "Loading posts…");

  let manifest: PostsManifest;
  try {
    manifest = await fetchManifest();
  } catch (err) {
    setStatus(container, "posts-error", "Could not load post list. Make sure posts/posts.json exists.");
    console.error(err);
    return;
  }

  const results = await Promise.all(
    [manifest.latest].map(filename => fetchPostHeader(filename))
  );

  const posts = results
    .filter((p): p is PostHeader => p !== null)
    .sort((a, b) => toTimestamp(b.date) - toTimestamp(a.date));

  container.innerHTML = "";

  if (posts.length === 0) {
    setStatus(container, "posts-empty", "No posts found. Add HTML files to posts/ and update posts.json.");
    return;
  }

  for (const post of posts) {
    container.appendChild(buildPostCard(post));
  }
}

document.addEventListener("DOMContentLoaded", loadLatestPost);
document.addEventListener("DOMContentLoaded", loadPosts);