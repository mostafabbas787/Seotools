# SEO Tools Hub

A comprehensive collection of **50+ SEO tools** (27 fully active, more coming soon) built with vanilla HTML, CSS, and JavaScript. Analyze, optimize, and boost your website's search engine performance — all from a single, fast, client-side application.

## ✨ Features

- **27 Fully Functional Tools** — ready to use in the browser with no backend required
- **Dark Mode** — toggle between light and dark themes, with preference saved in local storage
- **Category Filtering** — quickly find tools by category (Text & Content, Keywords & Meta, Links & URLs, Images & Media, Technical SEO, Social & Schema)
- **Search** — instant search across all tool names and descriptions
- **Responsive Design** — works on desktop, tablet, and mobile devices
- **Accessible** — keyboard navigation, ARIA labels, and screen-reader support

## 🛠️ Available Tools

### Text & Content
| Tool | Status |
|------|--------|
| Word Counter | ✅ Active |
| Keyword Density Checker | ✅ Active |
| Readability Analyzer | ✅ Active |
| Text Case Converter | ✅ Active |
| Lorem Ipsum Generator | ✅ Active |
| HTML Encoder/Decoder | ✅ Active |
| SEO Title Generator | ✅ Active |
| Meta Description Generator | ✅ Active |
| Plagiarism Checker | 🚧 Coming Soon |
| Grammar Checker | 🚧 Coming Soon |
| Article Rewriter | 🚧 Coming Soon |

### Keywords & Meta
| Tool | Status |
|------|--------|
| Meta Tags Generator | ✅ Active |
| Robots.txt Generator | ✅ Active |
| XML Sitemap Generator | ✅ Active |
| .htaccess Generator | ✅ Active |
| Canonical Tag Generator | ✅ Active |
| Hreflang Tag Generator | ✅ Active |
| Keyword Research Tool | 🚧 Coming Soon |
| Keyword Position Checker | 🚧 Coming Soon |
| Keyword Difficulty Checker | 🚧 Coming Soon |
| Long Tail Keyword Finder | 🚧 Coming Soon |

### Links & URLs
| Tool | Status |
|------|--------|
| URL Encoder/Decoder | ✅ Active |
| URL Rewriter | ✅ Active |
| QR Code Generator | ✅ Active |
| Backlink Checker | 🚧 Coming Soon |
| Broken Link Checker | 🚧 Coming Soon |
| Redirect Checker | 🚧 Coming Soon |
| Domain Authority Checker | 🚧 Coming Soon |
| WWW Redirect Checker | 🚧 Coming Soon |
| Link Analyzer | 🚧 Coming Soon |
| Anchor Text Analyzer | 🚧 Coming Soon |
| Nofollow Link Checker | 🚧 Coming Soon |

### Images & Media
| Tool | Status |
|------|--------|
| Image Alt Text Generator | ✅ Active |
| Lazy Load Generator | ✅ Active |
| Image Optimizer | 🚧 Coming Soon |
| Favicon Generator | 🚧 Coming Soon |
| Open Graph Image Generator | 🚧 Coming Soon |

### Technical SEO
| Tool | Status |
|------|--------|
| CSS Minifier | ✅ Active |
| JavaScript Minifier | ✅ Active |
| JSON Formatter | ✅ Active |
| Base64 Encoder/Decoder | ✅ Active |
| Page Speed Analyzer | 🚧 Coming Soon |
| Mobile-Friendly Test | 🚧 Coming Soon |
| SSL Certificate Checker | 🚧 Coming Soon |
| Structured Data Validator | 🚧 Coming Soon |
| Server Status Checker | 🚧 Coming Soon |
| DNS Lookup Tool | 🚧 Coming Soon |
| WHOIS Lookup | 🚧 Coming Soon |
| IP Location Finder | 🚧 Coming Soon |
| HTTP Headers Checker | 🚧 Coming Soon |

### Social & Schema
| Tool | Status |
|------|--------|
| Twitter Card Generator | ✅ Active |
| Facebook Open Graph Generator | ✅ Active |
| Schema Markup Generator | ✅ Active |
| Breadcrumb Schema Generator | ✅ Active |
| Rich Snippets Tester | 🚧 Coming Soon |

## 🚀 Getting Started

### Prerequisites

No build tools or package managers are required. The project runs entirely in the browser.

### Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mostafabbas787/Seotools.git
   cd Seotools
   ```

2. **Open `index.html` in your browser:**
   - Double-click the file, **or**
   - Use a local development server:
     ```bash
     # Python 3
     python -m http.server 8000

     # Node.js (npx)
     npx serve .
     ```

3. **Visit** `http://localhost:8000` in your browser.

## 📁 Project Structure

```
Seotools/
├── index.html    # Main HTML page with all tool cards and layout
├── styles.css    # Complete styling including dark mode and responsive design
├── script.js     # Tool logic, modal handling, search, filters, and utilities
└── README.md     # Project documentation
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/new-tool`)
3. **Commit** your changes (`git commit -m 'Add new tool'`)
4. **Push** to the branch (`git push origin feature/new-tool`)
5. **Open** a Pull Request

### Adding a New Tool

1. Add a tool card in `index.html` inside the `#toolsGrid` container
2. Add the tool interface HTML in the `getToolInterface()` function in `script.js`
3. Implement the tool logic as a new function in `script.js`
4. Update the active tool count in the `updateActiveToolCount()` function

## 📄 License

This project is open source and available for free use.
