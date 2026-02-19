"""Tests for the SEO Tools web application."""

import pytest

from app import (
    app,
    _build_meta_html,
    _build_robots,
    _build_sitemap,
    _check_issues,
    _esc,
    _keyword_density,
    _normalize_url,
    _slugify,
    _word_count,
)


@pytest.fixture()
def client():
    app.config["TESTING"] = True
    with app.test_client() as c:
        yield c


# ---------------------------------------------------------------------------
# Helper unit tests
# ---------------------------------------------------------------------------

class TestEsc:
    def test_escapes_html_special_chars(self):
        assert _esc('a & b < c > d "e"') == 'a &amp; b &lt; c &gt; d &quot;e&quot;'

    def test_plain_text_unchanged(self):
        assert _esc("hello world") == "hello world"


class TestNormalizeUrl:
    def test_adds_https(self):
        assert _normalize_url("example.com") == "https://example.com"

    def test_keeps_existing_http(self):
        assert _normalize_url("http://example.com") == "http://example.com"

    def test_keeps_existing_https(self):
        assert _normalize_url("https://example.com") == "https://example.com"


class TestSlugify:
    def test_basic(self):
        assert _slugify("Hello World") == "hello-world"

    def test_special_chars(self):
        assert _slugify("My Blog Post! #1") == "my-blog-post-1"

    def test_extra_spaces(self):
        assert _slugify("  lots   of   spaces  ") == "lots-of-spaces"

    def test_empty_string(self):
        assert _slugify("") == ""


class TestWordCount:
    def test_basic_text(self):
        result = _word_count("Hello world. How are you?")
        assert result["words"] == 5
        assert result["characters"] == 25
        assert result["sentences"] == 2

    def test_empty(self):
        result = _word_count("")
        assert result["words"] == 0
        assert result["reading_time_min"] == 0.0

    def test_paragraphs(self):
        result = _word_count("First paragraph.\n\nSecond paragraph.")
        assert result["paragraphs"] == 2


class TestKeywordDensity:
    def test_empty_text(self):
        result = _keyword_density("")
        assert result["total_words"] == 0
        assert result["single"] == []

    def test_counts_keywords(self):
        text = "python python python java java ruby"
        result = _keyword_density(text)
        assert result["total_words"] == 6
        top = result["single"][0]
        assert top["word"] == "python"
        assert top["count"] == 3

    def test_filters_stopwords(self):
        result = _keyword_density("the the the the code code")
        # "the" is a stopword, so "code" should be top
        assert result["single"][0]["word"] == "code"


class TestCheckIssues:
    def test_missing_title(self):
        issues = _check_issues("", "desc", "", "", ["H1"], "width=device-width", 0, 5)
        msgs = [i["message"] for i in issues]
        assert any("Missing <title>" in m for m in msgs)

    def test_long_title(self):
        issues = _check_issues("x" * 65, "desc", "", "canonical", ["H1"], "vp", 0, 0)
        msgs = [i["message"] for i in issues]
        assert any("65 characters" in m for m in msgs)

    def test_missing_description(self):
        issues = _check_issues("Title", "", "", "", ["H1"], "vp", 0, 0)
        msgs = [i["message"] for i in issues]
        assert any("Missing meta description" in m for m in msgs)

    def test_no_h1(self):
        issues = _check_issues("Title", "Desc", "", "", [], "vp", 0, 0)
        msgs = [i["message"] for i in issues]
        assert any("No <h1>" in m for m in msgs)

    def test_images_missing_alt(self):
        issues = _check_issues("Title", "Desc", "", "", ["H1"], "vp", 3, 5)
        msgs = [i["message"] for i in issues]
        assert any("3/5" in m for m in msgs)


class TestBuildMetaHtml:
    def test_generates_title(self):
        html = _build_meta_html(
            title="Test", description="", keywords="", author="",
            robots="", og_title="", og_desc="", og_url="", og_image="",
            twitter_card="",
        )
        assert "<title>Test</title>" in html

    def test_generates_description(self):
        html = _build_meta_html(
            title="", description="A description", keywords="", author="",
            robots="", og_title="", og_desc="", og_url="", og_image="",
            twitter_card="",
        )
        assert 'name="description"' in html
        assert "A description" in html


class TestBuildRobots:
    def test_basic(self):
        result = _build_robots("*", "/public/", "/admin/", "", "")
        assert "User-agent: *" in result
        assert "Allow: /public/" in result
        assert "Disallow: /admin/" in result

    def test_with_sitemap(self):
        result = _build_robots("*", "", "", "https://example.com/sitemap.xml", "")
        assert "Sitemap: https://example.com/sitemap.xml" in result

    def test_with_crawl_delay(self):
        result = _build_robots("Googlebot", "", "", "", "10")
        assert "User-agent: Googlebot" in result
        assert "Crawl-delay: 10" in result


class TestBuildSitemap:
    def test_valid_xml(self):
        xml = _build_sitemap(["https://a.com", "https://b.com"], "daily", "0.9")
        assert '<?xml version="1.0"' in xml
        assert "<loc>https://a.com</loc>" in xml
        assert "<changefreq>daily</changefreq>" in xml
        assert "<priority>0.9</priority>" in xml


# ---------------------------------------------------------------------------
# Route smoke tests
# ---------------------------------------------------------------------------

class TestRoutes:
    def test_home(self, client):
        resp = client.get("/")
        assert resp.status_code == 200
        assert b"SEO Tools" in resp.data

    def test_about(self, client):
        resp = client.get("/about")
        assert resp.status_code == 200
        assert b"About" in resp.data

    def test_meta_analyzer_get(self, client):
        resp = client.get("/meta-analyzer")
        assert resp.status_code == 200

    def test_meta_generator_get(self, client):
        resp = client.get("/meta-generator")
        assert resp.status_code == 200

    def test_meta_generator_post(self, client):
        resp = client.post("/meta-generator", data={"title": "Test Page"})
        assert resp.status_code == 200
        assert b"&lt;title&gt;Test Page&lt;/title&gt;" in resp.data

    def test_keyword_density_get(self, client):
        resp = client.get("/keyword-density")
        assert resp.status_code == 200

    def test_keyword_density_post(self, client):
        resp = client.post("/keyword-density", data={"text": "python python java"})
        assert resp.status_code == 200
        assert b"python" in resp.data

    def test_word_counter_get(self, client):
        resp = client.get("/word-counter")
        assert resp.status_code == 200

    def test_word_counter_post(self, client):
        resp = client.post("/word-counter", data={"text": "one two three"})
        assert resp.status_code == 200

    def test_og_generator_get(self, client):
        resp = client.get("/og-generator")
        assert resp.status_code == 200

    def test_robots_generator_get(self, client):
        resp = client.get("/robots-generator")
        assert resp.status_code == 200

    def test_robots_generator_post(self, client):
        resp = client.post("/robots-generator", data={
            "user_agent": "*", "allow": "", "disallow": "/admin/",
            "sitemap": "", "crawl_delay": "",
        })
        assert resp.status_code == 200
        assert b"Disallow: /admin/" in resp.data

    def test_sitemap_generator_get(self, client):
        resp = client.get("/sitemap-generator")
        assert resp.status_code == 200

    def test_sitemap_generator_post(self, client):
        resp = client.post("/sitemap-generator", data={
            "urls": "https://example.com\nhttps://example.com/about",
            "changefreq": "weekly", "priority": "0.8",
        })
        assert resp.status_code == 200

    def test_slug_generator_get(self, client):
        resp = client.get("/slug-generator")
        assert resp.status_code == 200

    def test_slug_generator_post(self, client):
        resp = client.post("/slug-generator", data={"text": "Hello World!"})
        assert resp.status_code == 200
        assert b"hello-world" in resp.data
