"""SEO Tools - A professional web application for SEO utilities."""

import re
import string
from collections import Counter
from urllib.parse import urlparse
from xml.etree.ElementTree import Element, SubElement, tostring

from flask import Flask, render_template, request, jsonify

import requests
from bs4 import BeautifulSoup

app = Flask(__name__)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _fetch_url(url: str, timeout: int = 10) -> requests.Response:
    """Fetch a URL with a reasonable timeout and user-agent."""
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (compatible; SEOToolsBot/1.0; "
            "+https://github.com/mostafabbas787/Seotools)"
        )
    }
    return requests.get(url, headers=headers, timeout=timeout)


def _normalize_url(url: str) -> str:
    """Ensure a URL has a scheme."""
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    return url


# ---------------------------------------------------------------------------
# Pages
# ---------------------------------------------------------------------------

@app.route("/")
def home():
    return render_template("home.html")


@app.route("/about")
def about():
    return render_template("about.html")


# ---------------------------------------------------------------------------
# Tool 1 – Meta Tag Analyzer
# ---------------------------------------------------------------------------

@app.route("/meta-analyzer", methods=["GET", "POST"])
def meta_analyzer():
    result = None
    error = None
    url = ""

    if request.method == "POST":
        url = request.form.get("url", "").strip()
        if not url:
            error = "Please enter a URL."
        else:
            url = _normalize_url(url)
            try:
                resp = _fetch_url(url)
                soup = BeautifulSoup(resp.text, "lxml")
                result = _extract_meta(soup, url)
            except requests.RequestException as exc:
                error = f"Could not fetch the URL: {exc}"

    return render_template("meta_analyzer.html", result=result, error=error, url=url)


def _extract_meta(soup: BeautifulSoup, url: str) -> dict:
    """Extract SEO-relevant meta information from parsed HTML."""
    title_tag = soup.find("title")
    title = title_tag.get_text(strip=True) if title_tag else ""

    meta_desc = ""
    tag = soup.find("meta", attrs={"name": re.compile(r"^description$", re.I)})
    if tag:
        meta_desc = tag.get("content", "")

    meta_keywords = ""
    tag = soup.find("meta", attrs={"name": re.compile(r"^keywords$", re.I)})
    if tag:
        meta_keywords = tag.get("content", "")

    canonical = ""
    link = soup.find("link", attrs={"rel": "canonical"})
    if link:
        canonical = link.get("href", "")

    og_tags = {}
    for tag in soup.find_all("meta", attrs={"property": re.compile(r"^og:", re.I)}):
        og_tags[tag.get("property", "")] = tag.get("content", "")

    twitter_tags = {}
    for tag in soup.find_all("meta", attrs={"name": re.compile(r"^twitter:", re.I)}):
        twitter_tags[tag.get("name", "")] = tag.get("content", "")

    h1_tags = [h.get_text(strip=True) for h in soup.find_all("h1")]
    h2_tags = [h.get_text(strip=True) for h in soup.find_all("h2")]

    img_no_alt = sum(1 for img in soup.find_all("img") if not img.get("alt"))
    img_total = len(soup.find_all("img"))

    viewport = ""
    tag = soup.find("meta", attrs={"name": re.compile(r"^viewport$", re.I)})
    if tag:
        viewport = tag.get("content", "")

    charset = ""
    tag = soup.find("meta", attrs={"charset": True})
    if tag:
        charset = tag.get("charset", "")

    issues = _check_issues(title, meta_desc, meta_keywords, canonical, h1_tags,
                           viewport, img_no_alt, img_total)

    return {
        "url": url,
        "title": title,
        "title_length": len(title),
        "meta_description": meta_desc,
        "meta_description_length": len(meta_desc),
        "meta_keywords": meta_keywords,
        "canonical": canonical,
        "og_tags": og_tags,
        "twitter_tags": twitter_tags,
        "h1_tags": h1_tags,
        "h2_tags": h2_tags,
        "img_total": img_total,
        "img_no_alt": img_no_alt,
        "viewport": viewport,
        "charset": charset,
        "issues": issues,
    }


def _check_issues(title, desc, keywords, canonical, h1s, viewport,
                   img_no_alt, img_total) -> list[dict]:
    """Return a list of SEO issues with severity."""
    issues: list[dict] = []

    if not title:
        issues.append({"severity": "error", "message": "Missing <title> tag."})
    elif len(title) > 60:
        issues.append({"severity": "warning",
                        "message": f"Title is {len(title)} characters (recommended ≤ 60)."})

    if not desc:
        issues.append({"severity": "error", "message": "Missing meta description."})
    elif len(desc) > 160:
        issues.append({"severity": "warning",
                        "message": f"Meta description is {len(desc)} chars (recommended ≤ 160)."})

    if not canonical:
        issues.append({"severity": "info",
                        "message": "No canonical link found."})

    if len(h1s) == 0:
        issues.append({"severity": "warning", "message": "No <h1> tag found."})
    elif len(h1s) > 1:
        issues.append({"severity": "warning",
                        "message": f"Multiple <h1> tags found ({len(h1s)})."})

    if not viewport:
        issues.append({"severity": "warning",
                        "message": "No viewport meta tag (may affect mobile)."})

    if img_no_alt:
        issues.append({"severity": "warning",
                        "message": f"{img_no_alt}/{img_total} images missing alt text."})

    return issues


# ---------------------------------------------------------------------------
# Tool 2 – Meta Tag Generator
# ---------------------------------------------------------------------------

@app.route("/meta-generator", methods=["GET", "POST"])
def meta_generator():
    generated = None
    if request.method == "POST":
        title = request.form.get("title", "").strip()
        description = request.form.get("description", "").strip()
        keywords = request.form.get("keywords", "").strip()
        author = request.form.get("author", "").strip()
        robots = request.form.get("robots", "index, follow").strip()
        og_title = request.form.get("og_title", "").strip() or title
        og_desc = request.form.get("og_description", "").strip() or description
        og_url = request.form.get("og_url", "").strip()
        og_image = request.form.get("og_image", "").strip()
        twitter_card = request.form.get("twitter_card", "summary").strip()

        generated = _build_meta_html(
            title=title, description=description, keywords=keywords,
            author=author, robots=robots, og_title=og_title,
            og_desc=og_desc, og_url=og_url, og_image=og_image,
            twitter_card=twitter_card,
        )

    return render_template("meta_generator.html", generated=generated)


def _build_meta_html(*, title, description, keywords, author, robots,
                     og_title, og_desc, og_url, og_image, twitter_card) -> str:
    lines: list[str] = []
    if title:
        lines.append(f"<title>{_esc(title)}</title>")
    if description:
        lines.append(f'<meta name="description" content="{_esc(description)}">')
    if keywords:
        lines.append(f'<meta name="keywords" content="{_esc(keywords)}">')
    if author:
        lines.append(f'<meta name="author" content="{_esc(author)}">')
    if robots:
        lines.append(f'<meta name="robots" content="{_esc(robots)}">')
    if og_title:
        lines.append(f'<meta property="og:title" content="{_esc(og_title)}">')
    if og_desc:
        lines.append(f'<meta property="og:description" content="{_esc(og_desc)}">')
    if og_url:
        lines.append(f'<meta property="og:url" content="{_esc(og_url)}">')
    if og_image:
        lines.append(f'<meta property="og:image" content="{_esc(og_image)}">')
    if twitter_card:
        lines.append(f'<meta name="twitter:card" content="{_esc(twitter_card)}">')
    return "\n".join(lines)


def _esc(text: str) -> str:
    """Escape HTML special characters for attribute values."""
    return (text.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace('"', "&quot;"))


# ---------------------------------------------------------------------------
# Tool 3 – Keyword Density Checker
# ---------------------------------------------------------------------------

@app.route("/keyword-density", methods=["GET", "POST"])
def keyword_density():
    result = None
    if request.method == "POST":
        text = request.form.get("text", "")
        result = _keyword_density(text)
    return render_template("keyword_density.html", result=result)


def _keyword_density(text: str) -> dict:
    """Compute single-word and two-word keyword densities."""
    words = re.findall(r"[a-zA-Z\u00C0-\u024F]+", text.lower())
    total = len(words)
    if total == 0:
        return {"total_words": 0, "single": [], "bigrams": []}

    stop = _stopwords()
    filtered = [w for w in words if w not in stop and len(w) > 1]

    single = Counter(filtered).most_common(20)
    single_out = [{"word": w, "count": c, "density": round(c / total * 100, 2)}
                  for w, c in single]

    bigrams_list = [f"{filtered[i]} {filtered[i+1]}" for i in range(len(filtered) - 1)]
    bigrams = Counter(bigrams_list).most_common(20)
    bigrams_out = [{"word": w, "count": c, "density": round(c / total * 100, 2)}
                   for w, c in bigrams]

    return {"total_words": total, "single": single_out, "bigrams": bigrams_out}


def _stopwords() -> set[str]:
    return {
        "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
        "of", "with", "by", "from", "is", "it", "as", "was", "are", "be",
        "this", "that", "these", "those", "has", "have", "had", "not", "no",
        "can", "will", "just", "do", "if", "my", "your", "we", "they", "he",
        "she", "its", "our", "their", "you", "me", "him", "her", "us", "them",
        "so", "than", "then", "also", "into", "up", "out", "about", "been",
        "would", "could", "should", "may", "might", "shall", "does", "did",
        "being", "having", "doing", "what", "which", "who", "whom", "how",
        "when", "where", "why", "all", "each", "every", "both", "few", "more",
        "most", "other", "some", "such", "only", "own", "same", "very",
    }


# ---------------------------------------------------------------------------
# Tool 4 – Word Counter
# ---------------------------------------------------------------------------

@app.route("/word-counter", methods=["GET", "POST"])
def word_counter():
    result = None
    if request.method == "POST":
        text = request.form.get("text", "")
        result = _word_count(text)
    return render_template("word_counter.html", result=result)


def _word_count(text: str) -> dict:
    words = text.split()
    chars = len(text)
    chars_no_space = len(text.replace(" ", ""))
    sentences = len(re.findall(r"[.!?]+", text))
    paragraphs = len([p for p in text.split("\n") if p.strip()])
    avg_word_len = round(sum(len(w) for w in words) / max(len(words), 1), 1)
    reading_time = round(len(words) / 200, 1)  # ~200 wpm

    return {
        "words": len(words),
        "characters": chars,
        "characters_no_spaces": chars_no_space,
        "sentences": sentences,
        "paragraphs": paragraphs,
        "avg_word_length": avg_word_len,
        "reading_time_min": reading_time,
    }


# ---------------------------------------------------------------------------
# Tool 5 – Open Graph Tag Generator
# ---------------------------------------------------------------------------

@app.route("/og-generator", methods=["GET", "POST"])
def og_generator():
    generated = None
    if request.method == "POST":
        og_type = request.form.get("og_type", "website").strip()
        title = request.form.get("title", "").strip()
        description = request.form.get("description", "").strip()
        url = request.form.get("url", "").strip()
        image = request.form.get("image", "").strip()
        site_name = request.form.get("site_name", "").strip()
        locale = request.form.get("locale", "en_US").strip()

        lines: list[str] = []
        if og_type:
            lines.append(f'<meta property="og:type" content="{_esc(og_type)}">')
        if title:
            lines.append(f'<meta property="og:title" content="{_esc(title)}">')
        if description:
            lines.append(f'<meta property="og:description" content="{_esc(description)}">')
        if url:
            lines.append(f'<meta property="og:url" content="{_esc(url)}">')
        if image:
            lines.append(f'<meta property="og:image" content="{_esc(image)}">')
        if site_name:
            lines.append(f'<meta property="og:site_name" content="{_esc(site_name)}">')
        if locale:
            lines.append(f'<meta property="og:locale" content="{_esc(locale)}">')
        generated = "\n".join(lines)

    return render_template("og_generator.html", generated=generated)


# ---------------------------------------------------------------------------
# Tool 6 – Robots.txt Generator
# ---------------------------------------------------------------------------

@app.route("/robots-generator", methods=["GET", "POST"])
def robots_generator():
    generated = None
    if request.method == "POST":
        user_agent = request.form.get("user_agent", "*").strip()
        allow = request.form.get("allow", "").strip()
        disallow = request.form.get("disallow", "").strip()
        sitemap = request.form.get("sitemap", "").strip()
        crawl_delay = request.form.get("crawl_delay", "").strip()

        generated = _build_robots(user_agent, allow, disallow, sitemap, crawl_delay)

    return render_template("robots_generator.html", generated=generated)


def _build_robots(user_agent, allow, disallow, sitemap, crawl_delay) -> str:
    lines: list[str] = [f"User-agent: {user_agent}"]

    for path in allow.splitlines():
        path = path.strip()
        if path:
            lines.append(f"Allow: {path}")

    for path in disallow.splitlines():
        path = path.strip()
        if path:
            lines.append(f"Disallow: {path}")

    if crawl_delay:
        lines.append(f"Crawl-delay: {crawl_delay}")

    if sitemap.strip():
        lines.append("")
        lines.append(f"Sitemap: {sitemap.strip()}")

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Tool 7 – Sitemap XML Generator
# ---------------------------------------------------------------------------

@app.route("/sitemap-generator", methods=["GET", "POST"])
def sitemap_generator():
    generated = None
    if request.method == "POST":
        urls_text = request.form.get("urls", "").strip()
        changefreq = request.form.get("changefreq", "weekly").strip()
        priority = request.form.get("priority", "0.8").strip()

        urls = [u.strip() for u in urls_text.splitlines() if u.strip()]
        if urls:
            generated = _build_sitemap(urls, changefreq, priority)

    return render_template("sitemap_generator.html", generated=generated)


def _build_sitemap(urls: list[str], changefreq: str, priority: str) -> str:
    root = Element("urlset")
    root.set("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")
    for u in urls:
        url_el = SubElement(root, "url")
        loc = SubElement(url_el, "loc")
        loc.text = u
        cf = SubElement(url_el, "changefreq")
        cf.text = changefreq
        pr = SubElement(url_el, "priority")
        pr.text = priority

    xml_bytes = tostring(root, encoding="unicode")
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + xml_bytes


# ---------------------------------------------------------------------------
# Tool 8 – Slug Generator (API endpoint)
# ---------------------------------------------------------------------------

@app.route("/slug-generator", methods=["GET", "POST"])
def slug_generator():
    result = None
    if request.method == "POST":
        text = request.form.get("text", "")
        result = _slugify(text)
    return render_template("slug_generator.html", result=result)


def _slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-")


# ---------------------------------------------------------------------------
# Run
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True)
