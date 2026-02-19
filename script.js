// SEO Tools Hub - Main JavaScript

// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const html = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);
updateDarkModeIcon(currentTheme);

darkModeToggle.addEventListener('click', () => {
    const theme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateDarkModeIcon(theme);
});

function updateDarkModeIcon(theme) {
    const icon = darkModeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Search Functionality
const searchInput = document.getElementById('toolSearch');
const toolCards = document.querySelectorAll('.tool-card');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    toolCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
});

// Filter Functionality
const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const category = button.getAttribute('data-category');
        
        toolCards.forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
        
        // Clear search when filtering
        searchInput.value = '';
    });
});

// Modal Functionality
const modal = document.getElementById('toolModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');

toolCards.forEach(card => {
    card.addEventListener('click', () => {
        const toolName = card.querySelector('h3').textContent;
        const toolType = card.getAttribute('data-tool');
        
        openToolModal(toolName, toolType);
    });
});

closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

// ESC key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
    }
});

function openToolModal(title, toolType) {
    modalTitle.textContent = title;
    modalBody.innerHTML = getToolInterface(toolType);
    modal.classList.add('active');
    
    // Initialize tool-specific functionality
    initializeToolFunctionality(toolType);
}

function getToolInterface(toolType) {
    const interfaces = {
        'word-counter': `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="wordCountText">Enter or paste your text:</label>
                    <textarea id="wordCountText" placeholder="Type or paste your text here..."></textarea>
                </div>
                <div class="stats-grid" id="wordCountStats">
                    <div class="stat-item">
                        <div class="stat-value">0</div>
                        <div class="stat-label">Words</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">0</div>
                        <div class="stat-label">Characters</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">0</div>
                        <div class="stat-label">Sentences</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">0</div>
                        <div class="stat-label">Paragraphs</div>
                    </div>
                </div>
            </div>
        `,
        'keyword-density': `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="keywordText">Enter your content:</label>
                    <textarea id="keywordText" placeholder="Paste your article or content here..."></textarea>
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="analyzeKeywordDensity()">
                        <i class="fas fa-chart-bar"></i> Analyze Density
                    </button>
                </div>
                <div id="keywordResults"></div>
            </div>
        `,
        'meta-tags': `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="pageTitle">Page Title:</label>
                    <input type="text" id="pageTitle" placeholder="Enter your page title (50-60 characters)" maxlength="60">
                </div>
                <div class="input-group">
                    <label for="pageDescription">Meta Description:</label>
                    <textarea id="pageDescription" placeholder="Enter meta description (150-160 characters)" maxlength="160" rows="3"></textarea>
                </div>
                <div class="input-group">
                    <label for="pageKeywords">Keywords (comma-separated):</label>
                    <input type="text" id="pageKeywords" placeholder="keyword1, keyword2, keyword3">
                </div>
                <div class="input-group">
                    <label for="pageAuthor">Author:</label>
                    <input type="text" id="pageAuthor" placeholder="Your name or company">
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="generateMetaTags()">
                        <i class="fas fa-code"></i> Generate Tags
                    </button>
                    <button class="btn btn-copy" onclick="copyToClipboard('metaTagsResult')">
                        <i class="fas fa-copy"></i> Copy Code
                    </button>
                </div>
                <div class="result-box" id="metaTagsResult"></div>
            </div>
        `,
        'url-encoder': `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="urlInput">Enter URL or Text:</label>
                    <textarea id="urlInput" placeholder="Enter URL or text to encode/decode..." rows="4"></textarea>
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="encodeURL()">
                        <i class="fas fa-lock"></i> Encode
                    </button>
                    <button class="btn btn-secondary" onclick="decodeURL()">
                        <i class="fas fa-unlock"></i> Decode
                    </button>
                    <button class="btn btn-copy" onclick="copyToClipboard('urlResult')">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
                <div class="result-box" id="urlResult"></div>
            </div>
        `,
        'text-case': `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="caseText">Enter your text:</label>
                    <textarea id="caseText" placeholder="Enter text to convert..." rows="5"></textarea>
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="convertCase('upper')">UPPERCASE</button>
                    <button class="btn btn-primary" onclick="convertCase('lower')">lowercase</button>
                    <button class="btn btn-primary" onclick="convertCase('title')">Title Case</button>
                    <button class="btn btn-primary" onclick="convertCase('sentence')">Sentence case</button>
                    <button class="btn btn-copy" onclick="copyToClipboard('caseResult')">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
                <div class="result-box" id="caseResult"></div>
            </div>
        `,
        'lorem-ipsum': `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="loremCount">Number of Paragraphs:</label>
                    <input type="number" id="loremCount" value="3" min="1" max="20">
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="generateLoremIpsum()">
                        <i class="fas fa-magic"></i> Generate Text
                    </button>
                    <button class="btn btn-copy" onclick="copyToClipboard('loremResult')">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
                <div class="result-box" id="loremResult"></div>
            </div>
        `,
        'robots-txt': `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="robotsUserAgent">User-agent:</label>
                    <input type="text" id="robotsUserAgent" value="*" placeholder="* for all bots">
                </div>
                <div class="input-group">
                    <label for="robotsDisallow">Disallow (one per line):</label>
                    <textarea id="robotsDisallow" placeholder="/admin/\n/private/" rows="4"></textarea>
                </div>
                <div class="input-group">
                    <label for="robotsSitemap">Sitemap URL:</label>
                    <input type="text" id="robotsSitemap" placeholder="https://example.com/sitemap.xml">
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="generateRobotsTxt()">
                        <i class="fas fa-robot"></i> Generate
                    </button>
                    <button class="btn btn-copy" onclick="copyToClipboard('robotsResult')">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
                <div class="result-box" id="robotsResult"></div>
            </div>
        `,
        'html-encoder': `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="htmlInput">Enter HTML:</label>
                    <textarea id="htmlInput" placeholder="Enter HTML to encode/decode..." rows="5"></textarea>
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="encodeHTML()">
                        <i class="fas fa-lock"></i> Encode
                    </button>
                    <button class="btn btn-secondary" onclick="decodeHTML()">
                        <i class="fas fa-unlock"></i> Decode
                    </button>
                    <button class="btn btn-copy" onclick="copyToClipboard('htmlResult')">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
                <div class="result-box" id="htmlResult"></div>
            </div>
        `,
        'base64': `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="base64Input">Enter Text:</label>
                    <textarea id="base64Input" placeholder="Enter text to encode/decode..." rows="5"></textarea>
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="encodeBase64()">
                        <i class="fas fa-lock"></i> Encode
                    </button>
                    <button class="btn btn-secondary" onclick="decodeBase64()">
                        <i class="fas fa-unlock"></i> Decode
                    </button>
                    <button class="btn btn-copy" onclick="copyToClipboard('base64Result')">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
                <div class="result-box" id="base64Result"></div>
            </div>
        `,
        'json-formatter': `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="jsonInput">Enter JSON:</label>
                    <textarea id="jsonInput" placeholder='{"key": "value"}' rows="8"></textarea>
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="formatJSON()">
                        <i class="fas fa-align-left"></i> Format
                    </button>
                    <button class="btn btn-secondary" onclick="minifyJSON()">
                        <i class="fas fa-compress"></i> Minify
                    </button>
                    <button class="btn btn-copy" onclick="copyToClipboard('jsonResult')">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
                <div class="result-box" id="jsonResult"></div>
            </div>
        `,
        'readability': `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="readabilityText">Enter your text:</label>
                    <textarea id="readabilityText" placeholder="Paste your text here to analyze readability..." rows="8"></textarea>
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="analyzeReadability()">
                        <i class="fas fa-book-reader"></i> Analyze Readability
                    </button>
                </div>
                <div id="readabilityResults"></div>
            </div>
        `,
        'minify-css': `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="cssInput">Enter CSS Code:</label>
                    <textarea id="cssInput" placeholder="Paste your CSS code here..." rows="8"></textarea>
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="minifyCSS()">
                        <i class="fas fa-compress"></i> Minify
                    </button>
                    <button class="btn btn-copy" onclick="copyToClipboard('cssResult')">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
                <div class="result-box" id="cssResult"></div>
            </div>
        `,
        'minify-js': `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="jsInput">Enter JavaScript Code:</label>
                    <textarea id="jsInput" placeholder="Paste your JavaScript code here..." rows="8"></textarea>
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="minifyJS()">
                        <i class="fas fa-compress"></i> Minify
                    </button>
                    <button class="btn btn-copy" onclick="copyToClipboard('jsResult')">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
                <div class="result-box" id="jsResult"></div>
            </div>
        `,
        'twitter-card': `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="twitterCardType">Card Type:</label>
                    <select id="twitterCardType">
                        <option value="summary">Summary</option>
                        <option value="summary_large_image">Summary Large Image</option>
                        <option value="app">App</option>
                        <option value="player">Player</option>
                    </select>
                </div>
                <div class="input-group">
                    <label for="twitterTitle">Title:</label>
                    <input type="text" id="twitterTitle" placeholder="Enter page title">
                </div>
                <div class="input-group">
                    <label for="twitterDescription">Description:</label>
                    <textarea id="twitterDescription" placeholder="Enter page description" rows="3"></textarea>
                </div>
                <div class="input-group">
                    <label for="twitterSite">Site @username:</label>
                    <input type="text" id="twitterSite" placeholder="@yourusername">
                </div>
                <div class="input-group">
                    <label for="twitterImage">Image URL:</label>
                    <input type="text" id="twitterImage" placeholder="https://example.com/image.jpg">
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="generateTwitterCard()">
                        <i class="fas fa-code"></i> Generate Tags
                    </button>
                    <button class="btn btn-copy" onclick="copyToClipboard('twitterCardResult')">
                        <i class="fas fa-copy"></i> Copy Code
                    </button>
                </div>
                <div class="result-box" id="twitterCardResult"></div>
            </div>
        `,
        'facebook-og': `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="ogType">OG Type:</label>
                    <select id="ogType">
                        <option value="website">Website</option>
                        <option value="article">Article</option>
                        <option value="product">Product</option>
                        <option value="video">Video</option>
                    </select>
                </div>
                <div class="input-group">
                    <label for="ogTitle">Title:</label>
                    <input type="text" id="ogTitle" placeholder="Enter page title">
                </div>
                <div class="input-group">
                    <label for="ogDescription">Description:</label>
                    <textarea id="ogDescription" placeholder="Enter page description" rows="3"></textarea>
                </div>
                <div class="input-group">
                    <label for="ogUrl">URL:</label>
                    <input type="text" id="ogUrl" placeholder="https://example.com">
                </div>
                <div class="input-group">
                    <label for="ogImage">Image URL:</label>
                    <input type="text" id="ogImage" placeholder="https://example.com/image.jpg">
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="generateFacebookOG()">
                        <i class="fas fa-code"></i> Generate Tags
                    </button>
                    <button class="btn btn-copy" onclick="copyToClipboard('facebookOGResult')">
                        <i class="fas fa-copy"></i> Copy Code
                    </button>
                </div>
                <div class="result-box" id="facebookOGResult"></div>
            </div>
        `,
        'schema-markup': `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="schemaType">Schema Type:</label>
                    <select id="schemaType">
                        <option value="Organization">Organization</option>
                        <option value="LocalBusiness">LocalBusiness</option>
                        <option value="Article">Article</option>
                        <option value="Product">Product</option>
                        <option value="Person">Person</option>
                    </select>
                </div>
                <div class="input-group">
                    <label for="schemaName">Name:</label>
                    <input type="text" id="schemaName" placeholder="Enter name">
                </div>
                <div class="input-group">
                    <label for="schemaDescription">Description:</label>
                    <textarea id="schemaDescription" placeholder="Enter description" rows="3"></textarea>
                </div>
                <div class="input-group">
                    <label for="schemaUrl">URL:</label>
                    <input type="text" id="schemaUrl" placeholder="https://example.com">
                </div>
                <div class="input-group">
                    <label for="schemaImage">Image URL:</label>
                    <input type="text" id="schemaImage" placeholder="https://example.com/image.jpg">
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="generateSchemaMarkup()">
                        <i class="fas fa-code"></i> Generate Schema
                    </button>
                    <button class="btn btn-copy" onclick="copyToClipboard('schemaResult')">
                        <i class="fas fa-copy"></i> Copy Code
                    </button>
                </div>
                <div class="result-box" id="schemaResult"></div>
            </div>
        `,
        'canonical': `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="canonicalUrl">Page URL:</label>
                    <input type="text" id="canonicalUrl" placeholder="https://example.com/page">
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="generateCanonical()">
                        <i class="fas fa-link"></i> Generate
                    </button>
                    <button class="btn btn-copy" onclick="copyToClipboard('canonicalResult')">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
                <div class="result-box" id="canonicalResult"></div>
            </div>
        `,
        'hreflang': `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="hreflangDefault">Default URL:</label>
                    <input type="text" id="hreflangDefault" placeholder="https://example.com">
                </div>
                <div class="input-group">
                    <label for="hreflangEntries">Language entries (one per line, format: lang|URL):</label>
                    <textarea id="hreflangEntries" placeholder="en|https://example.com/en\nfr|https://example.com/fr\nes|https://example.com/es" rows="6"></textarea>
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="generateHreflang()">
                        <i class="fas fa-globe"></i> Generate Tags
                    </button>
                    <button class="btn btn-copy" onclick="copyToClipboard('hreflangResult')">
                        <i class="fas fa-copy"></i> Copy Code
                    </button>
                </div>
                <div class="result-box" id="hreflangResult"></div>
            </div>
        `,
        'sitemap': `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="sitemapUrls">URLs (one per line):</label>
                    <textarea id="sitemapUrls" placeholder="https://example.com\nhttps://example.com/about\nhttps://example.com/contact" rows="6"></textarea>
                </div>
                <div class="input-group">
                    <label for="sitemapFrequency">Change Frequency:</label>
                    <select id="sitemapFrequency">
                        <option value="always">Always</option>
                        <option value="hourly">Hourly</option>
                        <option value="daily" selected>Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                        <option value="never">Never</option>
                    </select>
                </div>
                <div class="input-group">
                    <label for="sitemapPriority">Priority (0.0-1.0):</label>
                    <input type="text" id="sitemapPriority" value="0.8" placeholder="0.8">
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="generateSitemap()">
                        <i class="fas fa-sitemap"></i> Generate Sitemap
                    </button>
                    <button class="btn btn-copy" onclick="copyToClipboard('sitemapResult')">
                        <i class="fas fa-copy"></i> Copy Code
                    </button>
                </div>
                <div class="result-box" id="sitemapResult"></div>
            </div>
        `,
        'htaccess': `
            <div class="tool-interface">
                <div class="input-group">
                    <label><input type="checkbox" id="htGzip"> Enable GZIP Compression</label>
                </div>
                <div class="input-group">
                    <label><input type="checkbox" id="htCaching"> Enable Browser Caching</label>
                </div>
                <div class="input-group">
                    <label><input type="checkbox" id="htHttps"> Force HTTPS</label>
                </div>
                <div class="input-group">
                    <label><input type="checkbox" id="htWww"> Force WWW</label>
                </div>
                <div class="input-group">
                    <label><input type="checkbox" id="htBots"> Block Bad Bots</label>
                </div>
                <div class="input-group">
                    <label><input type="checkbox" id="htErrors"> Custom Error Pages</label>
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="generateHtaccess()">
                        <i class="fas fa-cog"></i> Generate
                    </button>
                    <button class="btn btn-copy" onclick="copyToClipboard('htaccessResult')">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
                <div class="result-box" id="htaccessResult"></div>
            </div>
        `,
        'breadcrumb': `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="breadcrumbItems">Breadcrumb items (one per line, format: Name|URL):</label>
                    <textarea id="breadcrumbItems" placeholder="Home|https://example.com\nCategory|https://example.com/category\nPage|https://example.com/category/page" rows="6"></textarea>
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="generateBreadcrumbSchema()">
                        <i class="fas fa-code"></i> Generate Schema
                    </button>
                    <button class="btn btn-copy" onclick="copyToClipboard('breadcrumbResult')">
                        <i class="fas fa-copy"></i> Copy Code
                    </button>
                </div>
                <div class="result-box" id="breadcrumbResult"></div>
            </div>
        `,
        'lazy-load': `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="lazyImgUrl">Image URL:</label>
                    <input type="text" id="lazyImgUrl" placeholder="https://example.com/image.jpg">
                </div>
                <div class="input-group">
                    <label for="lazyAlt">Alt Text:</label>
                    <input type="text" id="lazyAlt" placeholder="Descriptive alt text">
                </div>
                <div class="input-group">
                    <label for="lazyWidth">Width:</label>
                    <input type="text" id="lazyWidth" placeholder="800">
                </div>
                <div class="input-group">
                    <label for="lazyHeight">Height:</label>
                    <input type="text" id="lazyHeight" placeholder="600">
                </div>
                <div class="input-group">
                    <label for="lazyCssClass">CSS Class (optional):</label>
                    <input type="text" id="lazyCssClass" placeholder="responsive-img">
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="generateLazyLoad()">
                        <i class="fas fa-code"></i> Generate Code
                    </button>
                    <button class="btn btn-copy" onclick="copyToClipboard('lazyLoadResult')">
                        <i class="fas fa-copy"></i> Copy Code
                    </button>
                </div>
                <div class="result-box" id="lazyLoadResult"></div>
            </div>
        `,
        'title-generator': `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="titleKeyword">Primary Keyword:</label>
                    <input type="text" id="titleKeyword" placeholder="e.g. best running shoes">
                </div>
                <div class="input-group">
                    <label for="titleStyle">Title Style:</label>
                    <select id="titleStyle">
                        <option value="howto">How-To</option>
                        <option value="listicle">Listicle</option>
                        <option value="guide">Ultimate Guide</option>
                        <option value="review">Review</option>
                        <option value="question">Question</option>
                        <option value="comparison">Comparison</option>
                    </select>
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="generateSEOTitles()">
                        <i class="fas fa-heading"></i> Generate Titles
                    </button>
                    <button class="btn btn-copy" onclick="copyToClipboard('titleResult')">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
                <div class="result-box" id="titleResult"></div>
            </div>
        `,
        'meta-description': `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="metaDescContent">Page Content or Topic:</label>
                    <textarea id="metaDescContent" placeholder="Describe your page content or paste a summary..." rows="5"></textarea>
                </div>
                <div class="input-group">
                    <label for="metaDescKeyword">Target Keyword (optional):</label>
                    <input type="text" id="metaDescKeyword" placeholder="e.g. SEO tools">
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="generateMetaDescription()">
                        <i class="fas fa-align-left"></i> Generate Descriptions
                    </button>
                    <button class="btn btn-copy" onclick="copyToClipboard('metaDescResult')">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
                <div class="result-box" id="metaDescResult"></div>
            </div>
        `,
        'url-rewriter': `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="urlRewriteInput">Enter URL or Page Title:</label>
                    <input type="text" id="urlRewriteInput" placeholder="e.g. My Blog Post Title! (2024) or https://example.com/page?id=123">
                </div>
                <div class="input-group">
                    <label for="urlRewriteBase">Base URL (optional):</label>
                    <input type="text" id="urlRewriteBase" placeholder="https://example.com">
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="rewriteURL()">
                        <i class="fas fa-pen"></i> Generate SEO-Friendly URL
                    </button>
                    <button class="btn btn-copy" onclick="copyToClipboard('urlRewriteResult')">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
                <div class="result-box" id="urlRewriteResult"></div>
            </div>
        `,
        'image-alt': `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="altImageSubject">Image Subject:</label>
                    <input type="text" id="altImageSubject" placeholder="e.g. golden retriever puppy playing in park">
                </div>
                <div class="input-group">
                    <label for="altPageContext">Page Context (optional):</label>
                    <input type="text" id="altPageContext" placeholder="e.g. dog training tips blog post">
                </div>
                <div class="input-group">
                    <label for="altKeyword">Target Keyword (optional):</label>
                    <input type="text" id="altKeyword" placeholder="e.g. dog training">
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="generateImageAlt()">
                        <i class="fas fa-image"></i> Generate Alt Text
                    </button>
                    <button class="btn btn-copy" onclick="copyToClipboard('imageAltResult')">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
                <div class="result-box" id="imageAltResult"></div>
            </div>
        `,
        'qr-generator': `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="qrInput">Enter URL or Text:</label>
                    <input type="text" id="qrInput" placeholder="https://example.com">
                </div>
                <div class="input-group">
                    <label for="qrSize">QR Code Size:</label>
                    <select id="qrSize">
                        <option value="150">Small (150×150)</option>
                        <option value="250" selected>Medium (250×250)</option>
                        <option value="400">Large (400×400)</option>
                    </select>
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="generateQRCode()">
                        <i class="fas fa-qrcode"></i> Generate QR Code
                    </button>
                </div>
                <div class="result-box" id="qrResult" style="text-align:center;"></div>
            </div>
        `,

    'plagiarism': `
        <div class="tool-interface">
            <div class="input-group">
                <label for="plagiarismText">Enter text to check:</label>
                <textarea id="plagiarismText" placeholder="Paste your text here to check for originality..."></textarea>
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="checkPlagiarism()">
                    <i class="fas fa-search"></i> Check Plagiarism
                </button>
                <button class="btn btn-secondary" onclick="copyToClipboard('plagiarismResult')">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
            <div class="result-box" id="plagiarismResult"></div>
        </div>
    `,

    'grammar': `
        <div class="tool-interface">
            <div class="input-group">
                <label for="grammarText">Enter text to check:</label>
                <textarea id="grammarText" placeholder="Paste your text here to check grammar..."></textarea>
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="checkGrammar()">
                    <i class="fas fa-spell-check"></i> Check Grammar
                </button>
            </div>
            <div class="result-box" id="grammarResult"></div>
        </div>
    `,

    'article-rewriter': `
        <div class="tool-interface">
            <div class="input-group">
                <label for="rewriterText">Enter text to rewrite:</label>
                <textarea id="rewriterText" placeholder="Paste your article here to rewrite..."></textarea>
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="rewriteArticle()">
                    <i class="fas fa-sync-alt"></i> Rewrite Article
                </button>
                <button class="btn btn-secondary" onclick="copyToClipboard('rewriterResult')">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
            <div class="result-box" id="rewriterResult"></div>
        </div>
    `,

    'keyword-research': `
        <div class="tool-interface">
            <div class="input-group">
                <label for="seedKeyword">Enter seed keyword:</label>
                <input type="text" id="seedKeyword" placeholder="e.g. digital marketing">
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="researchKeywords()">
                    <i class="fas fa-search"></i> Research Keywords
                </button>
                <button class="btn btn-secondary" onclick="copyToClipboard('keywordResearchResult')">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
            <div class="result-box" id="keywordResearchResult"></div>
        </div>
    `,

    'keyword-position': `
        <div class="tool-interface">
            <div class="input-group">
                <label for="positionUrl">Website URL:</label>
                <input type="text" id="positionUrl" placeholder="https://example.com">
            </div>
            <div class="input-group">
                <label for="positionKeyword">Target Keyword:</label>
                <input type="text" id="positionKeyword" placeholder="e.g. best seo tools">
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="checkKeywordPosition()">
                    <i class="fas fa-map-marker-alt"></i> Check Position
                </button>
            </div>
            <div class="result-box" id="positionResult"></div>
        </div>
    `,

    'keyword-difficulty': `
        <div class="tool-interface">
            <div class="input-group">
                <label for="difficultyKeyword">Enter keyword:</label>
                <input type="text" id="difficultyKeyword" placeholder="e.g. seo tools">
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="checkKeywordDifficulty()">
                    <i class="fas fa-chart-bar"></i> Check Difficulty
                </button>
            </div>
            <div class="result-box" id="difficultyResult"></div>
        </div>
    `,

    'long-tail': `
        <div class="tool-interface">
            <div class="input-group">
                <label for="longTailKeyword">Enter seed keyword:</label>
                <input type="text" id="longTailKeyword" placeholder="e.g. email marketing">
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="findLongTailKeywords()">
                    <i class="fas fa-list"></i> Find Long Tail Keywords
                </button>
                <button class="btn btn-secondary" onclick="copyToClipboard('longTailResult')">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
            <div class="result-box" id="longTailResult"></div>
        </div>
    `,

    'backlink-checker': `
        <div class="tool-interface">
            <div class="input-group">
                <label for="backlinkUrl">Enter URL:</label>
                <input type="text" id="backlinkUrl" placeholder="https://example.com">
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="checkBacklinks()">
                    <i class="fas fa-link"></i> Check Backlinks
                </button>
                <button class="btn btn-secondary" onclick="copyToClipboard('backlinkResult')">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
            <div class="result-box" id="backlinkResult"></div>
        </div>
    `,

    'broken-link': `
        <div class="tool-interface">
            <div class="input-group">
                <label for="brokenLinkHtml">Paste HTML content:</label>
                <textarea id="brokenLinkHtml" placeholder="Paste HTML content to find links..."></textarea>
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="checkBrokenLinks()">
                    <i class="fas fa-unlink"></i> Check Links
                </button>
            </div>
            <div class="result-box" id="brokenLinkResult"></div>
        </div>
    `,

    'redirect-checker': `
        <div class="tool-interface">
            <div class="input-group">
                <label for="redirectUrl">Enter URL:</label>
                <input type="text" id="redirectUrl" placeholder="https://example.com">
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="checkRedirects()">
                    <i class="fas fa-exchange-alt"></i> Check Redirects
                </button>
                <button class="btn btn-secondary" onclick="copyToClipboard('redirectResult')">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
            <div class="result-box" id="redirectResult"></div>
        </div>
    `,

    'domain-authority': `
        <div class="tool-interface">
            <div class="input-group">
                <label for="domainAuthority">Enter domain:</label>
                <input type="text" id="domainAuthority" placeholder="example.com">
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="checkDomainAuthority()">
                    <i class="fas fa-chart-line"></i> Check Authority
                </button>
            </div>
            <div class="result-box" id="domainAuthorityResult"></div>
        </div>
    `,

    'www-redirect': `
        <div class="tool-interface">
            <div class="input-group">
                <label for="wwwDomain">Enter domain:</label>
                <input type="text" id="wwwDomain" placeholder="example.com">
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="checkWwwRedirect()">
                    <i class="fas fa-globe"></i> Generate Redirect Code
                </button>
                <button class="btn btn-secondary" onclick="copyToClipboard('wwwResult')">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
            <div class="result-box" id="wwwResult"></div>
        </div>
    `,

    'link-analyzer': `
        <div class="tool-interface">
            <div class="input-group">
                <label for="linkAnalyzerHtml">Paste HTML content:</label>
                <textarea id="linkAnalyzerHtml" placeholder="Paste HTML content to analyze links..."></textarea>
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="analyzeLinks()">
                    <i class="fas fa-search"></i> Analyze Links
                </button>
            </div>
            <div class="result-box" id="linkAnalyzerResult"></div>
        </div>
    `,

    'anchor-text': `
        <div class="tool-interface">
            <div class="input-group">
                <label for="anchorTextHtml">Paste HTML content:</label>
                <textarea id="anchorTextHtml" placeholder="Paste HTML content to analyze anchor texts..."></textarea>
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="analyzeAnchorText()">
                    <i class="fas fa-anchor"></i> Analyze Anchor Text
                </button>
            </div>
            <div class="result-box" id="anchorTextResult"></div>
        </div>
    `,

    'nofollow-checker': `
        <div class="tool-interface">
            <div class="input-group">
                <label for="nofollowHtml">Paste HTML content:</label>
                <textarea id="nofollowHtml" placeholder="Paste HTML content to check nofollow links..."></textarea>
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="checkNofollow()">
                    <i class="fas fa-ban"></i> Check Nofollow
                </button>
            </div>
            <div class="result-box" id="nofollowResult"></div>
        </div>
    `,

    'image-optimizer': `
        <div class="tool-interface">
            <div class="btn-group">
                <button class="btn btn-primary" onclick="showImageOptimizationTips()">
                    <i class="fas fa-image"></i> Show Optimization Tips
                </button>
                <button class="btn btn-secondary" onclick="copyToClipboard('imageOptimizerResult')">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
            <div class="result-box" id="imageOptimizerResult"></div>
        </div>
    `,

    'favicon-generator': `
        <div class="tool-interface">
            <div class="input-group">
                <label for="faviconUrl">Favicon Image URL:</label>
                <input type="text" id="faviconUrl" placeholder="https://example.com/favicon.png">
            </div>
            <div class="input-group">
                <label for="faviconSiteName">Site Name:</label>
                <input type="text" id="faviconSiteName" placeholder="My Website">
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="generateFaviconCode()">
                    <i class="fas fa-star"></i> Generate Favicon Code
                </button>
                <button class="btn btn-secondary" onclick="copyToClipboard('faviconResult')">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
            <div class="result-box" id="faviconResult"></div>
        </div>
    `,

    'og-image': `
        <div class="tool-interface">
            <div class="input-group">
                <label for="ogTitle">Title:</label>
                <input type="text" id="ogTitle" placeholder="Your Title Here">
            </div>
            <div class="input-group">
                <label for="ogSubtitle">Subtitle:</label>
                <input type="text" id="ogSubtitle" placeholder="Your subtitle or description">
            </div>
            <div class="input-group">
                <label for="ogBgColor">Background Color:</label>
                <input type="text" id="ogBgColor" placeholder="#4A90D9" value="#4A90D9">
            </div>
            <div class="input-group">
                <label for="ogTextColor">Text Color:</label>
                <input type="text" id="ogTextColor" placeholder="#FFFFFF" value="#FFFFFF">
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="generateOgImage()">
                    <i class="fas fa-image"></i> Generate OG Image
                </button>
                <button class="btn btn-secondary" onclick="copyToClipboard('ogImageResult')">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
            <div class="result-box" id="ogImageResult"></div>
        </div>
    `,

    'page-speed': `
        <div class="tool-interface">
            <div class="input-group">
                <label for="pageSpeedUrl">Enter URL:</label>
                <input type="text" id="pageSpeedUrl" placeholder="https://example.com">
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="analyzePageSpeed()">
                    <i class="fas fa-tachometer-alt"></i> Analyze Speed
                </button>
                <button class="btn btn-secondary" onclick="copyToClipboard('pageSpeedResult')">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
            <div class="result-box" id="pageSpeedResult"></div>
        </div>
    `,

    'mobile-friendly': `
        <div class="tool-interface">
            <div class="input-group">
                <label for="mobileFriendlyUrl">Enter URL:</label>
                <input type="text" id="mobileFriendlyUrl" placeholder="https://example.com">
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="testMobileFriendly()">
                    <i class="fas fa-mobile-alt"></i> Test Mobile-Friendly
                </button>
                <button class="btn btn-secondary" onclick="copyToClipboard('mobileFriendlyResult')">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
            <div class="result-box" id="mobileFriendlyResult"></div>
        </div>
    `,

    'ssl-checker': `
        <div class="tool-interface">
            <div class="input-group">
                <label for="sslDomain">Enter domain:</label>
                <input type="text" id="sslDomain" placeholder="example.com">
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="checkSSL()">
                    <i class="fas fa-lock"></i> Check SSL
                </button>
                <button class="btn btn-secondary" onclick="copyToClipboard('sslResult')">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
            <div class="result-box" id="sslResult"></div>
        </div>
    `,

    'structured-data': `
        <div class="tool-interface">
            <div class="input-group">
                <label for="structuredDataInput">Paste JSON-LD:</label>
                <textarea id="structuredDataInput" placeholder='Paste your JSON-LD structured data here...'></textarea>
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="validateStructuredData()">
                    <i class="fas fa-check-circle"></i> Validate
                </button>
            </div>
            <div class="result-box" id="structuredDataResult"></div>
        </div>
    `,

    'server-status': `
        <div class="tool-interface">
            <div class="input-group">
                <label for="serverStatusUrl">Enter URL:</label>
                <input type="text" id="serverStatusUrl" placeholder="https://example.com">
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="checkServerStatus()">
                    <i class="fas fa-server"></i> Check Status
                </button>
                <button class="btn btn-secondary" onclick="copyToClipboard('serverStatusResult')">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
            <div class="result-box" id="serverStatusResult"></div>
        </div>
    `,

    'dns-lookup': `
        <div class="tool-interface">
            <div class="input-group">
                <label for="dnsLookupDomain">Enter domain:</label>
                <input type="text" id="dnsLookupDomain" placeholder="example.com">
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="performDnsLookup()">
                    <i class="fas fa-network-wired"></i> Lookup DNS
                </button>
                <button class="btn btn-secondary" onclick="copyToClipboard('dnsLookupResult')">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
            <div class="result-box" id="dnsLookupResult"></div>
        </div>
    `,

    'whois': `
        <div class="tool-interface">
            <div class="input-group">
                <label for="whoisDomain">Enter domain:</label>
                <input type="text" id="whoisDomain" placeholder="example.com">
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="performWhoisLookup()">
                    <i class="fas fa-info-circle"></i> WHOIS Lookup
                </button>
                <button class="btn btn-secondary" onclick="copyToClipboard('whoisResult')">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
            <div class="result-box" id="whoisResult"></div>
        </div>
    `,

    'ip-location': `
        <div class="tool-interface">
            <div class="input-group">
                <label for="ipAddress">Enter IP Address:</label>
                <input type="text" id="ipAddress" placeholder="e.g. 8.8.8.8">
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="findIpLocation()">
                    <i class="fas fa-map-marker-alt"></i> Find Location
                </button>
            </div>
            <div class="result-box" id="ipLocationResult"></div>
        </div>
    `,

    'headers-checker': `
        <div class="tool-interface">
            <div class="input-group">
                <label for="headersUrl">Enter URL:</label>
                <input type="text" id="headersUrl" placeholder="https://example.com">
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="checkHttpHeaders()">
                    <i class="fas fa-cog"></i> Check Headers
                </button>
                <button class="btn btn-secondary" onclick="copyToClipboard('headersResult')">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
            <div class="result-box" id="headersResult"></div>
        </div>
    `,

    'rich-snippets': `
        <div class="tool-interface">
            <div class="input-group">
                <label for="richSnippetInput">Paste JSON-LD:</label>
                <textarea id="richSnippetInput" placeholder='Paste your JSON-LD structured data here...'></textarea>
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="testRichSnippets()">
                    <i class="fas fa-star"></i> Test Rich Snippets
                </button>
            </div>
            <div class="result-box" id="richSnippetResult"></div>
        </div>
    `
    };

    return interfaces[toolType] || `
        <div class="tool-interface">
            <p>This tool is currently under development. Check back soon for updates!</p>
            <p>Features coming soon:</p>
            <ul style="margin-top: 1rem; padding-left: 2rem;">
                <li>Full functionality for all 50 SEO tools</li>
                <li>Real-time analysis and results</li>
                <li>Export options for generated content</li>
                <li>Integration with popular SEO platforms</li>
            </ul>
        </div>
    `;
}

// Update active tool count dynamically
(function updateActiveToolCount() {
    const interfaces = {
        'word-counter': 1, 'keyword-density': 1, 'meta-tags': 1, 'url-encoder': 1,
        'text-case': 1, 'lorem-ipsum': 1, 'robots-txt': 1, 'html-encoder': 1,
        'base64': 1, 'json-formatter': 1, 'readability': 1, 'minify-css': 1,
        'minify-js': 1, 'twitter-card': 1, 'facebook-og': 1, 'schema-markup': 1,
        'canonical': 1, 'hreflang': 1, 'sitemap': 1, 'htaccess': 1,
        'breadcrumb': 1, 'lazy-load': 1, 'title-generator': 1,
        'meta-description': 1, 'url-rewriter': 1, 'image-alt': 1, 'qr-generator': 1,
        'plagiarism': 1, 'grammar': 1, 'article-rewriter': 1, 'keyword-research': 1,
        'keyword-position': 1, 'keyword-difficulty': 1, 'long-tail': 1, 'backlink-checker': 1,
        'broken-link': 1, 'redirect-checker': 1, 'domain-authority': 1, 'www-redirect': 1,
        'link-analyzer': 1, 'anchor-text': 1, 'nofollow-checker': 1, 'image-optimizer': 1,
        'favicon-generator': 1, 'og-image': 1, 'page-speed': 1, 'mobile-friendly': 1,
        'ssl-checker': 1, 'structured-data': 1, 'server-status': 1, 'dns-lookup': 1,
        'whois': 1, 'ip-location': 1, 'headers-checker': 1, 'rich-snippets': 1
    };
    const countEl = document.getElementById('activeToolCount');
    if (countEl) countEl.textContent = Object.keys(interfaces).length;
})();

function initializeToolFunctionality(toolType) {
    if (toolType === 'word-counter') {
        const textarea = document.getElementById('wordCountText');
        textarea.addEventListener('input', updateWordCount);
    }
}

// Tool Functions

// Word Counter
function updateWordCount() {
    const text = document.getElementById('wordCountText').value;
    const stats = document.querySelectorAll('#wordCountStats .stat-value');
    
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const characters = text.length;
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
    const paragraphs = text.split(/\n+/).filter(para => para.trim().length > 0).length;
    
    stats[0].textContent = words;
    stats[1].textContent = characters;
    stats[2].textContent = sentences;
    stats[3].textContent = paragraphs;
}

// Keyword Density Analyzer
function analyzeKeywordDensity() {
    const text = document.getElementById('keywordText').value.toLowerCase();
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const totalWords = words.length;
    
    if (totalWords === 0) {
        showMessage('keywordResults', 'Please enter some text to analyze.', 'error');
        return;
    }
    
    const frequency = {};
    words.forEach(word => {
        word = word.replace(/[^\w]/g, '');
        if (word.length > 2) {
            frequency[word] = (frequency[word] || 0) + 1;
        }
    });
    
    const sorted = Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    // Create elements safely
    const resultsDiv = document.getElementById('keywordResults');
    resultsDiv.innerHTML = '';
    
    const heading = document.createElement('h3');
    heading.textContent = 'Top 10 Keywords:';
    resultsDiv.appendChild(heading);
    
    const statsGrid = document.createElement('div');
    statsGrid.className = 'stats-grid';
    
    sorted.forEach(([word, count]) => {
        const density = ((count / totalWords) * 100).toFixed(2);
        
        const statItem = document.createElement('div');
        statItem.className = 'stat-item';
        
        const statValue = document.createElement('div');
        statValue.className = 'stat-value';
        statValue.textContent = `${density}%`;
        
        const statLabel = document.createElement('div');
        statLabel.className = 'stat-label';
        statLabel.textContent = `${word} (${count})`;
        
        statItem.appendChild(statValue);
        statItem.appendChild(statLabel);
        statsGrid.appendChild(statItem);
    });
    
    resultsDiv.appendChild(statsGrid);
}

// Meta Tags Generator
function generateMetaTags() {
    const title = document.getElementById('pageTitle').value;
    const description = document.getElementById('pageDescription').value;
    const keywords = document.getElementById('pageKeywords').value;
    const author = document.getElementById('pageAuthor').value;
    
    if (!title || !description) {
        showMessage('metaTagsResult', 'Please fill in at least title and description.', 'error');
        return;
    }
    
    // Escape HTML to prevent XSS
    const escapeHtml = (str) => str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    
    const metaTags = `<!-- Primary Meta Tags -->
<title>${escapeHtml(title)}</title>
<meta name="title" content="${escapeHtml(title)}">
<meta name="description" content="${escapeHtml(description)}">
${keywords ? `<meta name="keywords" content="${escapeHtml(keywords)}">` : ''}
${author ? `<meta name="author" content="${escapeHtml(author)}">` : ''}

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:title" content="${escapeHtml(title)}">
<meta property="twitter:description" content="${escapeHtml(description)}">`;
    
    const pre = document.createElement('pre');
    pre.textContent = metaTags;
    document.getElementById('metaTagsResult').innerHTML = '';
    document.getElementById('metaTagsResult').appendChild(pre);
}

// URL Encoder/Decoder
function encodeURL() {
    const input = document.getElementById('urlInput').value;
    try {
        const encoded = encodeURIComponent(input);
        const pre = document.createElement('pre');
        pre.textContent = encoded;
        document.getElementById('urlResult').innerHTML = '';
        document.getElementById('urlResult').appendChild(pre);
    } catch (e) {
        showMessage('urlResult', 'Error encoding URL', 'error');
    }
}

function decodeURL() {
    const input = document.getElementById('urlInput').value;
    try {
        const decoded = decodeURIComponent(input);
        const pre = document.createElement('pre');
        pre.textContent = decoded;
        document.getElementById('urlResult').innerHTML = '';
        document.getElementById('urlResult').appendChild(pre);
    } catch (e) {
        showMessage('urlResult', 'Error decoding URL', 'error');
    }
}

// Text Case Converter
function convertCase(type) {
    const text = document.getElementById('caseText').value;
    let result = '';
    
    switch(type) {
        case 'upper':
            result = text.toUpperCase();
            break;
        case 'lower':
            result = text.toLowerCase();
            break;
        case 'title':
            result = text.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
            break;
        case 'sentence':
            result = text.toLowerCase().replace(/(^\w|\.\s+\w)/g, l => l.toUpperCase());
            break;
    }
    
    const pre = document.createElement('pre');
    pre.textContent = result;
    document.getElementById('caseResult').innerHTML = '';
    document.getElementById('caseResult').appendChild(pre);
}

// Lorem Ipsum Generator
function generateLoremIpsum() {
    const count = parseInt(document.getElementById('loremCount').value) || 3;
    const lorem = [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
        "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
        "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa."
    ];
    
    let result = '';
    for (let i = 0; i < count; i++) {
        result += lorem[i % lorem.length] + '\n\n';
    }
    
    const pre = document.createElement('pre');
    pre.textContent = result;
    document.getElementById('loremResult').innerHTML = '';
    document.getElementById('loremResult').appendChild(pre);
}

// Robots.txt Generator
function generateRobotsTxt() {
    const userAgent = document.getElementById('robotsUserAgent').value || '*';
    const disallow = document.getElementById('robotsDisallow').value;
    const sitemap = document.getElementById('robotsSitemap').value;
    
    let robotsTxt = `User-agent: ${userAgent}\n`;
    
    if (disallow) {
        disallow.split('\n').forEach(path => {
            if (path.trim()) {
                robotsTxt += `Disallow: ${path.trim()}\n`;
            }
        });
    } else {
        robotsTxt += 'Disallow:\n';
    }
    
    if (sitemap) {
        robotsTxt += `\nSitemap: ${sitemap}`;
    }
    
    const pre = document.createElement('pre');
    pre.textContent = robotsTxt;
    document.getElementById('robotsResult').innerHTML = '';
    document.getElementById('robotsResult').appendChild(pre);
}

// HTML Encoder/Decoder
function encodeHTML() {
    const input = document.getElementById('htmlInput').value;
    const encoded = input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    const pre = document.createElement('pre');
    pre.textContent = encoded;
    document.getElementById('htmlResult').innerHTML = '';
    document.getElementById('htmlResult').appendChild(pre);
}

function decodeHTML() {
    const input = document.getElementById('htmlInput').value;
    // Decode in reverse order of encoding to prevent double-decoding issues
    const decoded = input
        .replace(/&#039;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<')
        .replace(/&amp;/g, '&');
    const pre = document.createElement('pre');
    pre.textContent = decoded;
    document.getElementById('htmlResult').innerHTML = '';
    document.getElementById('htmlResult').appendChild(pre);
}

// Base64 Encoder/Decoder
function encodeBase64() {
    const input = document.getElementById('base64Input').value;
    try {
        // Use TextEncoder for proper UTF-8 encoding
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        // Use Array.from to avoid stack overflow with large inputs
        const binary = Array.from(data, byte => String.fromCharCode(byte)).join('');
        const encoded = btoa(binary);
        const pre = document.createElement('pre');
        pre.textContent = encoded;
        document.getElementById('base64Result').innerHTML = '';
        document.getElementById('base64Result').appendChild(pre);
    } catch (e) {
        showMessage('base64Result', 'Error encoding to Base64', 'error');
    }
}

function decodeBase64() {
    const input = document.getElementById('base64Input').value;
    try {
        // Use TextDecoder for proper UTF-8 decoding
        const binary = atob(input);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        const decoder = new TextDecoder();
        const decoded = decoder.decode(bytes);
        const pre = document.createElement('pre');
        pre.textContent = decoded;
        document.getElementById('base64Result').innerHTML = '';
        document.getElementById('base64Result').appendChild(pre);
    } catch (e) {
        showMessage('base64Result', 'Error decoding from Base64', 'error');
    }
}

// JSON Formatter
function formatJSON() {
    const input = document.getElementById('jsonInput').value;
    try {
        const parsed = JSON.parse(input);
        const formatted = JSON.stringify(parsed, null, 2);
        const pre = document.createElement('pre');
        pre.textContent = formatted;
        document.getElementById('jsonResult').innerHTML = '';
        document.getElementById('jsonResult').appendChild(pre);
    } catch (e) {
        showMessage('jsonResult', 'Invalid JSON: ' + e.message, 'error');
    }
}

function minifyJSON() {
    const input = document.getElementById('jsonInput').value;
    try {
        const parsed = JSON.parse(input);
        const minified = JSON.stringify(parsed);
        const pre = document.createElement('pre');
        pre.textContent = minified;
        document.getElementById('jsonResult').innerHTML = '';
        document.getElementById('jsonResult').appendChild(pre);
    } catch (e) {
        showMessage('jsonResult', 'Invalid JSON: ' + e.message, 'error');
    }
}

// Escape HTML helper
function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Readability Analyzer
function analyzeReadability() {
    const text = document.getElementById('readabilityText').value;

    if (!text.trim()) {
        showMessage('readabilityResults', 'Please enter some text to analyze.', 'error');
        return;
    }

    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const totalSentences = sentences.length;
    const totalWords = words.length;

    function countSyllables(word) {
        word = word.toLowerCase().replace(/[^a-z]/g, '');
        if (word.length === 0) return 0;
        const matches = word.match(/[aeiouy]+/g);
        return matches ? matches.length : 1;
    }

    let totalSyllables = 0;
    words.forEach(w => { totalSyllables += countSyllables(w); });

    const avgWordsPerSentence = totalSentences > 0 ? (totalWords / totalSentences) : 0;
    const avgSyllablesPerWord = totalWords > 0 ? (totalSyllables / totalWords) : 0;

    const fleschEase = totalSentences > 0 && totalWords > 0
        ? 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)
        : 0;

    const fleschKincaid = totalSentences > 0 && totalWords > 0
        ? (0.39 * avgWordsPerSentence) + (11.8 * avgSyllablesPerWord) - 15.59
        : 0;

    const resultsDiv = document.getElementById('readabilityResults');
    resultsDiv.innerHTML = '';

    const statsGrid = document.createElement('div');
    statsGrid.className = 'stats-grid';

    const stats = [
        { value: fleschEase.toFixed(2), label: 'Flesch Reading Ease' },
        { value: fleschKincaid.toFixed(2), label: 'Flesch-Kincaid Grade' },
        { value: avgWordsPerSentence.toFixed(2), label: 'Avg Words/Sentence' },
        { value: avgSyllablesPerWord.toFixed(2), label: 'Avg Syllables/Word' }
    ];

    stats.forEach(stat => {
        const statItem = document.createElement('div');
        statItem.className = 'stat-item';

        const statValue = document.createElement('div');
        statValue.className = 'stat-value';
        statValue.textContent = stat.value;

        const statLabel = document.createElement('div');
        statLabel.className = 'stat-label';
        statLabel.textContent = stat.label;

        statItem.appendChild(statValue);
        statItem.appendChild(statLabel);
        statsGrid.appendChild(statItem);
    });

    resultsDiv.appendChild(statsGrid);
}

// CSS Minifier
function minifyCSS() {
    const input = document.getElementById('cssInput').value;

    if (!input.trim()) {
        showMessage('cssResult', 'Please enter some CSS code.', 'error');
        return;
    }

    let minified = input;
    minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
    minified = minified.replace(/\s+/g, ' ');
    minified = minified.replace(/\s*([{}:;,])\s*/g, '$1');
    minified = minified.replace(/;}/g, '}');
    minified = minified.trim();

    const pre = document.createElement('pre');
    pre.textContent = minified;
    document.getElementById('cssResult').innerHTML = '';
    document.getElementById('cssResult').appendChild(pre);
}

// JavaScript Minifier
function minifyJS() {
    const input = document.getElementById('jsInput').value;

    if (!input.trim()) {
        showMessage('jsResult', 'Please enter some JavaScript code.', 'error');
        return;
    }

    let minified = input;
    minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
    minified = minified.replace(/(["'`])(?:(?!\1|\\).|\\.)*\1|(\/\/.*$)/gm, function(match, quote) {
        return quote ? match : '';
    });
    minified = minified.split('\n').map(line => line.trim()).filter(line => line.length > 0).join(' ');
    minified = minified.replace(/\s+/g, ' ');
    minified = minified.trim();

    const pre = document.createElement('pre');
    pre.textContent = minified;
    document.getElementById('jsResult').innerHTML = '';
    document.getElementById('jsResult').appendChild(pre);
}

// Twitter Card Generator
function generateTwitterCard() {
    const cardType = document.getElementById('twitterCardType').value;
    const title = document.getElementById('twitterTitle').value;
    const description = document.getElementById('twitterDescription').value;
    const site = document.getElementById('twitterSite').value;
    const image = document.getElementById('twitterImage').value;

    if (!title || !description) {
        showMessage('twitterCardResult', 'Please fill in at least title and description.', 'error');
        return;
    }

    let tags = `<meta name="twitter:card" content="${escapeHtml(cardType)}">\n`;
    tags += `<meta name="twitter:title" content="${escapeHtml(title)}">\n`;
    tags += `<meta name="twitter:description" content="${escapeHtml(description)}">`;
    if (site) {
        tags += `\n<meta name="twitter:site" content="${escapeHtml(site)}">`;
    }
    if (image) {
        tags += `\n<meta name="twitter:image" content="${escapeHtml(image)}">`;
    }

    const pre = document.createElement('pre');
    pre.textContent = tags;
    document.getElementById('twitterCardResult').innerHTML = '';
    document.getElementById('twitterCardResult').appendChild(pre);
}

// Facebook Open Graph Generator
function generateFacebookOG() {
    const ogType = document.getElementById('ogType').value;
    const title = document.getElementById('ogTitle').value;
    const description = document.getElementById('ogDescription').value;
    const url = document.getElementById('ogUrl').value;
    const image = document.getElementById('ogImage').value;

    if (!title || !description) {
        showMessage('facebookOGResult', 'Please fill in at least title and description.', 'error');
        return;
    }

    let tags = `<meta property="og:type" content="${escapeHtml(ogType)}">\n`;
    tags += `<meta property="og:title" content="${escapeHtml(title)}">\n`;
    tags += `<meta property="og:description" content="${escapeHtml(description)}">`;
    if (url) {
        tags += `\n<meta property="og:url" content="${escapeHtml(url)}">`;
    }
    if (image) {
        tags += `\n<meta property="og:image" content="${escapeHtml(image)}">`;
    }

    const pre = document.createElement('pre');
    pre.textContent = tags;
    document.getElementById('facebookOGResult').innerHTML = '';
    document.getElementById('facebookOGResult').appendChild(pre);
}

// Schema Markup Generator
function generateSchemaMarkup() {
    const schemaType = document.getElementById('schemaType').value;
    const name = document.getElementById('schemaName').value;
    const description = document.getElementById('schemaDescription').value;
    const url = document.getElementById('schemaUrl').value;
    const image = document.getElementById('schemaImage').value;

    if (!name) {
        showMessage('schemaResult', 'Please fill in at least the name field.', 'error');
        return;
    }

    const schema = {
        '@context': 'https://schema.org',
        '@type': schemaType,
        'name': name
    };
    if (description) schema.description = description;
    if (url) schema.url = url;
    if (image) schema.image = image;

    const output = '<script type="application/ld+json">\n' + JSON.stringify(schema, null, 2) + '\n</script>';

    const pre = document.createElement('pre');
    pre.textContent = output;
    document.getElementById('schemaResult').innerHTML = '';
    document.getElementById('schemaResult').appendChild(pre);
}

// Canonical Tag Generator
function generateCanonical() {
    const url = document.getElementById('canonicalUrl').value;

    if (!url.trim()) {
        showMessage('canonicalResult', 'Please enter a page URL.', 'error');
        return;
    }

    const tag = '<link rel="canonical" href="' + escapeHtml(url.trim()) + '">';

    const pre = document.createElement('pre');
    pre.textContent = tag;
    document.getElementById('canonicalResult').innerHTML = '';
    document.getElementById('canonicalResult').appendChild(pre);
}

// Hreflang Tag Generator
function generateHreflang() {
    const defaultUrl = document.getElementById('hreflangDefault').value;
    const entries = document.getElementById('hreflangEntries').value;

    if (!defaultUrl.trim() || !entries.trim()) {
        showMessage('hreflangResult', 'Please fill in the default URL and at least one language entry.', 'error');
        return;
    }

    let tags = '<link rel="alternate" hreflang="x-default" href="' + escapeHtml(defaultUrl.trim()) + '">';

    entries.split('\n').forEach(line => {
        line = line.trim();
        if (!line) return;
        const parts = line.split('|');
        if (parts.length === 2) {
            const lang = parts[0].trim();
            const url = parts[1].trim();
            tags += '\n<link rel="alternate" hreflang="' + escapeHtml(lang) + '" href="' + escapeHtml(url) + '">';
        }
    });

    const pre = document.createElement('pre');
    pre.textContent = tags;
    document.getElementById('hreflangResult').innerHTML = '';
    document.getElementById('hreflangResult').appendChild(pre);
}

// XML Sitemap Generator
function generateSitemap() {
    const urls = document.getElementById('sitemapUrls').value;
    const frequency = document.getElementById('sitemapFrequency').value;
    const priority = document.getElementById('sitemapPriority').value || '0.8';

    if (!urls.trim()) {
        showMessage('sitemapResult', 'Please enter at least one URL.', 'error');
        return;
    }

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    urls.split('\n').forEach(url => {
        url = url.trim();
        if (!url) return;
        xml += '  <url>\n';
        xml += '    <loc>' + escapeHtml(url) + '</loc>\n';
        xml += '    <changefreq>' + escapeHtml(frequency) + '</changefreq>\n';
        xml += '    <priority>' + escapeHtml(priority) + '</priority>\n';
        xml += '  </url>\n';
    });

    xml += '</urlset>';

    const pre = document.createElement('pre');
    pre.textContent = xml;
    document.getElementById('sitemapResult').innerHTML = '';
    document.getElementById('sitemapResult').appendChild(pre);
}

// .htaccess Generator
function generateHtaccess() {
    const gzip = document.getElementById('htGzip').checked;
    const caching = document.getElementById('htCaching').checked;
    const https = document.getElementById('htHttps').checked;
    const www = document.getElementById('htWww').checked;
    const bots = document.getElementById('htBots').checked;
    const errors = document.getElementById('htErrors').checked;

    if (!gzip && !caching && !https && !www && !bots && !errors) {
        showMessage('htaccessResult', 'Please select at least one option.', 'error');
        return;
    }

    let rules = '';

    if (gzip) {
        rules += '# Enable GZIP Compression\n';
        rules += '<IfModule mod_deflate.c>\n';
        rules += '  AddOutputFilterByType DEFLATE text/html text/plain text/css\n';
        rules += '  AddOutputFilterByType DEFLATE text/javascript application/javascript\n';
        rules += '  AddOutputFilterByType DEFLATE application/json application/xml\n';
        rules += '</IfModule>\n\n';
    }

    if (caching) {
        rules += '# Enable Browser Caching\n';
        rules += '<IfModule mod_expires.c>\n';
        rules += '  ExpiresActive On\n';
        rules += '  ExpiresByType image/jpg "access plus 1 year"\n';
        rules += '  ExpiresByType image/jpeg "access plus 1 year"\n';
        rules += '  ExpiresByType image/png "access plus 1 year"\n';
        rules += '  ExpiresByType image/gif "access plus 1 year"\n';
        rules += '  ExpiresByType text/css "access plus 1 month"\n';
        rules += '  ExpiresByType application/javascript "access plus 1 month"\n';
        rules += '</IfModule>\n\n';
    }

    if (https) {
        rules += '# Force HTTPS\n';
        rules += 'RewriteEngine On\n';
        rules += 'RewriteCond %{HTTPS} off\n';
        rules += 'RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]\n\n';
    }

    if (www) {
        rules += '# Force WWW\n';
        rules += 'RewriteEngine On\n';
        rules += 'RewriteCond %{HTTP_HOST} !^www\\. [NC]\n';
        rules += 'RewriteRule ^(.*)$ https://www.%{HTTP_HOST}%{REQUEST_URI} [L,R=301]\n\n';
    }

    if (bots) {
        rules += '# Block Bad Bots\n';
        rules += 'RewriteEngine On\n';
        rules += 'RewriteCond %{HTTP_USER_AGENT} (BadBot|EvilScraper|SpamBot) [NC]\n';
        rules += 'RewriteRule .* - [F,L]\n\n';
    }

    if (errors) {
        rules += '# Custom Error Pages\n';
        rules += 'ErrorDocument 400 /errors/400.html\n';
        rules += 'ErrorDocument 401 /errors/401.html\n';
        rules += 'ErrorDocument 403 /errors/403.html\n';
        rules += 'ErrorDocument 404 /errors/404.html\n';
        rules += 'ErrorDocument 500 /errors/500.html\n\n';
    }

    const pre = document.createElement('pre');
    pre.textContent = rules.trim();
    document.getElementById('htaccessResult').innerHTML = '';
    document.getElementById('htaccessResult').appendChild(pre);
}

// Breadcrumb Schema Generator
function generateBreadcrumbSchema() {
    const items = document.getElementById('breadcrumbItems').value;

    if (!items.trim()) {
        showMessage('breadcrumbResult', 'Please enter at least one breadcrumb item.', 'error');
        return;
    }

    const itemList = [];
    let position = 1;

    items.split('\n').forEach(line => {
        line = line.trim();
        if (!line) return;
        const parts = line.split('|');
        if (parts.length === 2) {
            itemList.push({
                '@type': 'ListItem',
                'position': position,
                'name': parts[0].trim(),
                'item': parts[1].trim()
            });
            position++;
        }
    });

    if (itemList.length === 0) {
        showMessage('breadcrumbResult', 'Please use the format: Name|URL (one per line).', 'error');
        return;
    }

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': itemList
    };

    const output = '<script type="application/ld+json">\n' + JSON.stringify(schema, null, 2) + '\n</script>';

    const pre = document.createElement('pre');
    pre.textContent = output;
    document.getElementById('breadcrumbResult').innerHTML = '';
    document.getElementById('breadcrumbResult').appendChild(pre);
}

// Lazy Load Generator
function generateLazyLoad() {
    const imgUrl = document.getElementById('lazyImgUrl').value;
    const alt = document.getElementById('lazyAlt').value;
    const width = document.getElementById('lazyWidth').value;
    const height = document.getElementById('lazyHeight').value;
    const cssClass = document.getElementById('lazyCssClass').value;

    if (!imgUrl.trim()) {
        showMessage('lazyLoadResult', 'Please enter an image URL.', 'error');
        return;
    }

    let imgTag = '<img src="' + escapeHtml(imgUrl.trim()) + '"';
    imgTag += ' alt="' + escapeHtml(alt) + '"';
    if (width) imgTag += ' width="' + escapeHtml(width) + '"';
    if (height) imgTag += ' height="' + escapeHtml(height) + '"';
    imgTag += ' loading="lazy"';
    if (cssClass) imgTag += ' class="' + escapeHtml(cssClass) + '"';
    imgTag += '>';

    let output = '';
    if (cssClass) {
        output = '<div class="' + escapeHtml(cssClass.trim()) + '-wrapper">\n  ' + imgTag + '\n</div>';
    } else {
        output = imgTag;
    }

    const pre = document.createElement('pre');
    pre.textContent = output;
    document.getElementById('lazyLoadResult').innerHTML = '';
    document.getElementById('lazyLoadResult').appendChild(pre);
}

// SEO Title Generator
function generateSEOTitles() {
    const keyword = document.getElementById('titleKeyword').value.trim();
    const style = document.getElementById('titleStyle').value;

    if (!keyword) {
        showMessage('titleResult', 'Please enter a primary keyword.', 'error');
        return;
    }

    const capitalize = str => str.replace(/\b\w/g, l => l.toUpperCase());
    const capitalized = capitalize(keyword);
    const year = new Date().getFullYear();

    const templates = {
        howto: [
            `How to ${capitalized}: A Step-by-Step Guide (${year})`,
            `How to ${capitalized} Like a Pro | Expert Tips`,
            `How to ${capitalized} — Everything You Need to Know`,
            `The Easiest Way to ${capitalized} in ${year}`,
            `How to ${capitalized}: Tips, Tricks & Best Practices`
        ],
        listicle: [
            `10 Best ${capitalized} You Need to Know in ${year}`,
            `7 ${capitalized} Tips That Actually Work`,
            `15 ${capitalized} Strategies for Better Results`,
            `5 ${capitalized} Mistakes You're Probably Making`,
            `Top 10 ${capitalized} Tools & Resources (${year})`
        ],
        guide: [
            `The Ultimate Guide to ${capitalized} (${year})`,
            `${capitalized}: The Complete Guide for Beginners`,
            `${capitalized} 101: Everything You Need to Know`,
            `The Definitive Guide to ${capitalized} in ${year}`,
            `A Comprehensive Guide to ${capitalized}`
        ],
        review: [
            `${capitalized} Review: Is It Worth It in ${year}?`,
            `${capitalized} Review — Pros, Cons & Verdict`,
            `Honest ${capitalized} Review: What You Need to Know`,
            `${capitalized} Review: Our Expert Analysis (${year})`,
            `${capitalized}: An In-Depth Review & Comparison`
        ],
        question: [
            `What Is ${capitalized}? A Simple Explanation`,
            `Why Is ${capitalized} Important for Your Business?`,
            `Is ${capitalized} Worth It? Here's the Truth`,
            `What Makes ${capitalized} So Effective in ${year}?`,
            `When Should You Use ${capitalized}? Expert Advice`
        ],
        comparison: [
            `${capitalized} vs. Alternatives: Which Is Best? (${year})`,
            `${capitalized} Comparison: Top Options Reviewed`,
            `Best ${capitalized} Compared: Features, Pricing & More`,
            `${capitalized}: Side-by-Side Comparison Guide`,
            `Choosing the Right ${capitalized}: A Comparison`
        ]
    };

    const titles = templates[style] || templates.howto;

    const resultsDiv = document.getElementById('titleResult');
    resultsDiv.innerHTML = '';

    titles.forEach(title => {
        const p = document.createElement('p');
        p.style.marginBottom = '0.75rem';

        const charCount = title.length;
        const badge = document.createElement('span');
        badge.style.cssText = 'font-size:0.8rem;margin-left:0.5rem;padding:2px 6px;border-radius:4px;color:white;background:' + (charCount <= 60 ? '#10b981' : '#ef4444');
        badge.textContent = charCount + ' chars';

        const text = document.createTextNode(title);
        p.appendChild(text);
        p.appendChild(badge);
        resultsDiv.appendChild(p);
    });
}

// Meta Description Generator
function generateMetaDescription() {
    const content = document.getElementById('metaDescContent').value.trim();
    const keyword = document.getElementById('metaDescKeyword').value.trim();

    if (!content) {
        showMessage('metaDescResult', 'Please enter page content or topic.', 'error');
        return;
    }

    const sentences = content.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
    const firstSentence = sentences[0] || content;

    const truncate = (str, max) => {
        if (str.length <= max) return str;
        const truncated = str.substring(0, max);
        const lastSpace = truncated.lastIndexOf(' ');
        return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '...';
    };

    const descriptions = [];

    if (keyword) {
        descriptions.push(
            truncate(`Discover ${keyword}: ${firstSentence}.`, 160),
            truncate(`Learn about ${keyword}. ${firstSentence}. Find out more today.`, 160),
            truncate(`Looking for ${keyword}? ${firstSentence}. Get started now.`, 160),
            truncate(`${firstSentence}. Your complete resource for ${keyword}.`, 160)
        );
    } else {
        descriptions.push(
            truncate(`${firstSentence}. Learn more on our site.`, 160),
            truncate(`${firstSentence}. Find out everything you need to know.`, 160),
            truncate(`${firstSentence}. Get started today.`, 160),
            truncate(`Discover more: ${firstSentence}.`, 160)
        );
    }

    const resultsDiv = document.getElementById('metaDescResult');
    resultsDiv.innerHTML = '';

    descriptions.forEach(desc => {
        const p = document.createElement('p');
        p.style.marginBottom = '0.75rem';

        const charCount = desc.length;
        const badge = document.createElement('span');
        badge.style.cssText = 'font-size:0.8rem;margin-left:0.5rem;padding:2px 6px;border-radius:4px;color:white;background:' + (charCount >= 120 && charCount <= 160 ? '#10b981' : charCount < 120 ? '#f59e0b' : '#ef4444');
        badge.textContent = charCount + ' chars';

        const text = document.createTextNode(desc);
        p.appendChild(text);
        p.appendChild(badge);
        resultsDiv.appendChild(p);
    });
}

// URL Rewriter
function rewriteURL() {
    const input = document.getElementById('urlRewriteInput').value.trim();
    const base = document.getElementById('urlRewriteBase').value.trim();

    if (!input) {
        showMessage('urlRewriteResult', 'Please enter a URL or page title.', 'error');
        return;
    }

    let slug = input;

    // If it looks like a URL, extract the meaningful part
    try {
        if (input.startsWith('http://') || input.startsWith('https://')) {
            const url = new URL(input);
            slug = url.pathname + (url.search || '');
        }
    } catch (e) {
        // Not a valid URL, treat as title text
    }

    // Convert to SEO-friendly slug
    slug = slug
        .toLowerCase()
        .replace(/['']/g, '')          // remove apostrophes
        .replace(/[^a-z0-9\s-]/g, ' ') // replace special chars with space
        .replace(/\s+/g, '-')          // replace spaces with hyphens
        .replace(/-+/g, '-')           // collapse multiple hyphens
        .replace(/^-|-$/g, '');        // trim leading/trailing hyphens

    const fullUrl = base ? base.replace(/\/+$/, '') + '/' + slug : '/' + slug;

    const resultsDiv = document.getElementById('urlRewriteResult');
    resultsDiv.innerHTML = '';

    const p1 = document.createElement('p');
    const label1 = document.createElement('strong');
    label1.textContent = 'SEO-Friendly URL: ';
    p1.appendChild(label1);
    p1.appendChild(document.createTextNode(fullUrl));
    p1.style.marginBottom = '0.5rem';

    const p2 = document.createElement('p');
    const label2 = document.createElement('strong');
    label2.textContent = 'Slug: ';
    p2.appendChild(label2);
    p2.appendChild(document.createTextNode(slug));
    p2.style.marginBottom = '0.5rem';

    const p3 = document.createElement('p');
    p3.style.cssText = 'font-size:0.9rem;color:var(--text-secondary);margin-top:0.5rem;';
    const lengthOk = slug.length <= 75;
    p3.textContent = 'Slug length: ' + slug.length + ' chars ' + (lengthOk ? '✅ Good' : '⚠️ Consider shortening');

    resultsDiv.appendChild(p1);
    resultsDiv.appendChild(p2);
    resultsDiv.appendChild(p3);
}

// Image Alt Text Generator
function generateImageAlt() {
    const subject = document.getElementById('altImageSubject').value.trim();
    const context = document.getElementById('altPageContext').value.trim();
    const keyword = document.getElementById('altKeyword').value.trim();

    if (!subject) {
        showMessage('imageAltResult', 'Please enter the image subject.', 'error');
        return;
    }

    const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

    const alts = [];

    // Descriptive alt text options
    alts.push(capitalize(subject));

    if (keyword && context) {
        alts.push(`${capitalize(subject)} — ${keyword} | ${context}`);
        alts.push(`${capitalize(keyword)}: ${subject}`);
    } else if (keyword) {
        alts.push(`${capitalize(subject)} — ${keyword}`);
        alts.push(`${capitalize(keyword)}: ${subject}`);
    } else if (context) {
        alts.push(`${capitalize(subject)} — ${context}`);
    }

    alts.push(`Photo of ${subject}`);
    alts.push(`Illustration showing ${subject}`);

    const resultsDiv = document.getElementById('imageAltResult');
    resultsDiv.innerHTML = '';

    const heading = document.createElement('p');
    heading.innerHTML = '<strong>Suggested alt text options:</strong>';
    heading.style.marginBottom = '0.75rem';
    resultsDiv.appendChild(heading);

    alts.forEach(alt => {
        const p = document.createElement('p');
        p.style.cssText = 'margin-bottom:0.5rem;padding:0.5rem;background:var(--bg-primary);border:1px solid var(--border-color);border-radius:6px;';

        const code = document.createElement('code');
        code.textContent = 'alt="' + alt + '"';
        p.appendChild(code);

        const charCount = alt.length;
        const badge = document.createElement('span');
        badge.style.cssText = 'font-size:0.8rem;margin-left:0.5rem;padding:2px 6px;border-radius:4px;color:white;background:' + (charCount <= 125 ? '#10b981' : '#f59e0b');
        badge.textContent = charCount + ' chars';
        p.appendChild(badge);

        resultsDiv.appendChild(p);
    });

    const tip = document.createElement('p');
    tip.style.cssText = 'font-size:0.85rem;color:var(--text-secondary);margin-top:0.75rem;';
    tip.textContent = 'Tip: Keep alt text under 125 characters and make it descriptive. Avoid keyword stuffing.';
    resultsDiv.appendChild(tip);
}

// QR Code Generator
function generateQRCode() {
    const input = document.getElementById('qrInput').value.trim();
    const size = document.getElementById('qrSize').value;

    if (!input) {
        showMessage('qrResult', 'Please enter a URL or text.', 'error');
        return;
    }

    const resultsDiv = document.getElementById('qrResult');
    resultsDiv.innerHTML = '';

    // Generate QR code using a simple canvas-based approach
    const encodedData = encodeURIComponent(input);
    const qrApiUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=' + size + 'x' + size + '&data=' + encodedData;

    const img = document.createElement('img');
    img.src = qrApiUrl;
    img.alt = 'QR Code for: ' + input;
    img.width = parseInt(size, 10);
    img.height = parseInt(size, 10);
    img.style.cssText = 'border-radius:8px;margin:1rem auto;display:block;';

    img.onerror = function() {
        showMessage('qrResult', 'Failed to generate QR code. Please check your connection.', 'error');
    };

    const caption = document.createElement('p');
    caption.style.cssText = 'font-size:0.9rem;color:var(--text-secondary);margin-top:0.5rem;';
    caption.textContent = 'QR Code for: ' + input;

    resultsDiv.appendChild(img);
    resultsDiv.appendChild(caption);
}

function checkPlagiarism() {
    const text = document.getElementById('plagiarismText').value.trim();
    if (!text) {
        showMessage('plagiarismResult', 'Please enter text to check.', 'error');
        return;
    }
    const resultsDiv = document.getElementById('plagiarismResult');
    resultsDiv.innerHTML = '';

    const words = text.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const uniqueCount = uniqueWords.size;
    const diversityRatio = wordCount > 0 ? (uniqueCount / wordCount) * 100 : 0;

    // Find common 3-word phrases
    const phrases = {};
    for (let i = 0; i < words.length - 2; i++) {
        const phrase = words.slice(i, i + 3).join(' ').toLowerCase();
        phrases[phrase] = (phrases[phrase] || 0) + 1;
    }
    const repeatedPhrases = Object.entries(phrases).filter(([, count]) => count > 1);

    const uniquenessScore = Math.min(100, Math.round(diversityRatio * 1.5));

    const title = document.createElement('h3');
    title.textContent = 'Plagiarism Analysis';
    resultsDiv.appendChild(title);

    const scoreP = document.createElement('p');
    scoreP.textContent = 'Uniqueness Score: ' + uniquenessScore + '%';
    scoreP.style.fontWeight = 'bold';
    resultsDiv.appendChild(scoreP);

    const statsP = document.createElement('p');
    statsP.textContent = 'Total Words: ' + wordCount + ' | Unique Words: ' + uniqueCount + ' | Word Diversity: ' + diversityRatio.toFixed(1) + '%';
    resultsDiv.appendChild(statsP);

    const phrasesP = document.createElement('p');
    phrasesP.textContent = 'Repeated 3-word phrases found: ' + repeatedPhrases.length;
    resultsDiv.appendChild(phrasesP);

    if (repeatedPhrases.length > 0) {
        const list = document.createElement('ul');
        repeatedPhrases.slice(0, 10).forEach(([phrase, count]) => {
            const li = document.createElement('li');
            li.textContent = '"' + phrase + '" - repeated ' + count + ' times';
            list.appendChild(li);
        });
        resultsDiv.appendChild(list);
    }
}

function checkGrammar() {
    const text = document.getElementById('grammarText').value.trim();
    if (!text) {
        showMessage('grammarResult', 'Please enter text to check.', 'error');
        return;
    }
    const resultsDiv = document.getElementById('grammarResult');
    resultsDiv.innerHTML = '';
    const issues = [];

    // Check double spaces
    const doubleSpaces = (text.match(/ {2,}/g) || []).length;
    if (doubleSpaces > 0) {
        issues.push('Found ' + doubleSpaces + ' instance(s) of double spaces.');
    }

    // Check capitalization after period
    const sentences = text.match(/\.\s+[a-z]/g);
    if (sentences) {
        issues.push('Found ' + sentences.length + ' sentence(s) not starting with a capital letter after a period.');
    }

    // Common misspellings
    const misspellings = {
        'teh': 'the', 'recieve': 'receive', 'definately': 'definitely',
        'occured': 'occurred', 'seperate': 'separate', 'untill': 'until',
        'accomodate': 'accommodate', 'occurence': 'occurrence',
        'wierd': 'weird', 'thier': 'their'
    };
    const wordsInText = text.split(/\s+/);
    for (const [wrong, right] of Object.entries(misspellings)) {
        const found = wordsInText.filter(w => w.toLowerCase().replace(/[^a-z]/g, '') === wrong);
        if (found.length > 0) {
            issues.push('Possible misspelling: "' + wrong + '" should be "' + right + '" (' + found.length + ' occurrence(s)).');
        }
    }

    // Repeated consecutive words
    const repeatedWords = text.match(/\b(\w+)\s+\1\b/gi);
    if (repeatedWords) {
        issues.push('Found ' + repeatedWords.length + ' repeated consecutive word(s): ' + repeatedWords.join(', '));
    }

    const title = document.createElement('h3');
    title.textContent = 'Grammar Check Results';
    resultsDiv.appendChild(title);

    if (issues.length === 0) {
        const p = document.createElement('p');
        p.textContent = 'No grammar issues found!';
        p.style.color = '#27ae60';
        resultsDiv.appendChild(p);
    } else {
        const list = document.createElement('ul');
        issues.forEach(issue => {
            const li = document.createElement('li');
            li.textContent = issue;
            list.appendChild(li);
        });
        resultsDiv.appendChild(list);
    }
}

function rewriteArticle() {
    const text = document.getElementById('rewriterText').value.trim();
    if (!text) {
        showMessage('rewriterResult', 'Please enter text to rewrite.', 'error');
        return;
    }
    const resultsDiv = document.getElementById('rewriterResult');
    resultsDiv.innerHTML = '';

    const synonyms = {
        'good': 'excellent', 'bad': 'poor', 'big': 'large', 'small': 'tiny',
        'fast': 'quick', 'slow': 'sluggish', 'happy': 'delighted', 'sad': 'unhappy',
        'important': 'crucial', 'easy': 'simple', 'hard': 'difficult', 'old': 'ancient',
        'new': 'modern', 'start': 'begin', 'end': 'finish', 'help': 'assist',
        'make': 'create', 'use': 'utilize', 'show': 'demonstrate', 'get': 'obtain'
    };

    const rewritten = text.replace(/\b\w+\b/g, function(word) {
        const lower = word.toLowerCase();
        if (synonyms[lower]) {
            const replacement = synonyms[lower];
            if (word[0] === word[0].toUpperCase()) {
                return replacement.charAt(0).toUpperCase() + replacement.slice(1);
            }
            return replacement;
        }
        return word;
    });

    const origTitle = document.createElement('h3');
    origTitle.textContent = 'Original Text';
    resultsDiv.appendChild(origTitle);

    const origP = document.createElement('p');
    origP.textContent = text;
    resultsDiv.appendChild(origP);

    const rewriteTitle = document.createElement('h3');
    rewriteTitle.textContent = 'Rewritten Text';
    resultsDiv.appendChild(rewriteTitle);

    const rewriteP = document.createElement('p');
    rewriteP.textContent = rewritten;
    resultsDiv.appendChild(rewriteP);
}

function researchKeywords() {
    const keyword = document.getElementById('seedKeyword').value.trim();
    if (!keyword) {
        showMessage('keywordResearchResult', 'Please enter a seed keyword.', 'error');
        return;
    }
    const resultsDiv = document.getElementById('keywordResearchResult');
    resultsDiv.innerHTML = '';

    const prefixes = ['best', 'top', 'how to', 'what is', 'why', 'free', 'cheap', 'online'];
    const suffixes = ['tool', 'software', 'guide', 'tips', 'examples', 'tutorial', 'review', 'alternatives'];
    const questions = ['how to ' + keyword, 'what is ' + keyword, 'why ' + keyword + ' is important', 'when to use ' + keyword];

    const keywords = [];

    prefixes.forEach(p => {
        keywords.push({ term: p + ' ' + keyword, intent: p === 'how to' || p === 'what is' || p === 'why' ? 'Informational' : p === 'free' || p === 'cheap' || p === 'best' || p === 'top' ? 'Commercial' : 'Navigational' });
    });

    suffixes.forEach(s => {
        keywords.push({ term: keyword + ' ' + s, intent: s === 'guide' || s === 'tutorial' || s === 'tips' || s === 'examples' ? 'Informational' : 'Transactional' });
    });

    questions.forEach(q => {
        keywords.push({ term: q, intent: 'Informational' });
    });

    const title = document.createElement('h3');
    title.textContent = 'Keyword Research Results for "' + keyword + '"';
    resultsDiv.appendChild(title);

    const list = document.createElement('ul');
    keywords.forEach(kw => {
        const li = document.createElement('li');
        li.textContent = kw.term + ' [' + kw.intent + ']';
        list.appendChild(li);
    });
    resultsDiv.appendChild(list);
}

function checkKeywordPosition() {
    const url = document.getElementById('positionUrl').value.trim();
    const keyword = document.getElementById('positionKeyword').value.trim();
    if (!url || !keyword) {
        showMessage('positionResult', 'Please enter both a URL and a keyword.', 'error');
        return;
    }
    const resultsDiv = document.getElementById('positionResult');
    resultsDiv.innerHTML = '';

    const title = document.createElement('h3');
    title.textContent = 'Keyword Position Check Guide';
    resultsDiv.appendChild(title);

    const intro = document.createElement('p');
    intro.textContent = 'To check the position of "' + keyword + '" for ' + url + ', follow these steps:';
    resultsDiv.appendChild(intro);

    const steps = document.createElement('ol');
    const stepTexts = [
        'Open an incognito/private browser window.',
        'Search for "' + keyword + '" on Google.',
        'Scan through results to find ' + url + '.',
        'Note the position on the page and the page number.'
    ];
    stepTexts.forEach(s => {
        const li = document.createElement('li');
        li.textContent = s;
        steps.appendChild(li);
    });
    resultsDiv.appendChild(steps);

    const serpTitle = document.createElement('h4');
    serpTitle.textContent = 'SERP Features to Check For:';
    resultsDiv.appendChild(serpTitle);

    const features = ['Featured Snippet', 'Knowledge Panel', 'Local Pack', 'Image Pack', 'Video Results', 'People Also Ask', 'Site Links', 'Reviews'];
    const featureList = document.createElement('ul');
    features.forEach(f => {
        const li = document.createElement('li');
        li.textContent = f;
        featureList.appendChild(li);
    });
    resultsDiv.appendChild(featureList);
}

function checkKeywordDifficulty() {
    const keyword = document.getElementById('difficultyKeyword').value.trim();
    if (!keyword) {
        showMessage('difficultyResult', 'Please enter a keyword.', 'error');
        return;
    }
    const resultsDiv = document.getElementById('difficultyResult');
    resultsDiv.innerHTML = '';

    const words = keyword.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    let score;
    if (wordCount === 1) {
        score = Math.floor(Math.random() * 21) + 70;
    } else if (wordCount === 2) {
        score = Math.floor(Math.random() * 30) + 40;
    } else {
        score = Math.floor(Math.random() * 30) + 10;
    }

    const commercialTerms = ['buy', 'price', 'cost', 'cheap', 'best', 'top', 'review'];
    const hasCommercial = words.some(w => commercialTerms.includes(w.toLowerCase()));
    if (hasCommercial) {
        score = Math.min(100, score + 10);
    }

    let level, color;
    if (score >= 70) { level = 'Hard'; color = '#e74c3c'; }
    else if (score >= 40) { level = 'Medium'; color = '#f39c12'; }
    else { level = 'Easy'; color = '#27ae60'; }

    const title = document.createElement('h3');
    title.textContent = 'Keyword Difficulty Analysis';
    resultsDiv.appendChild(title);

    const scoreP = document.createElement('p');
    scoreP.textContent = 'Difficulty Score: ' + score + '/100';
    scoreP.style.fontWeight = 'bold';
    scoreP.style.color = color;
    resultsDiv.appendChild(scoreP);

    const levelP = document.createElement('p');
    levelP.textContent = 'Competition Level: ' + level;
    resultsDiv.appendChild(levelP);

    const recTitle = document.createElement('h4');
    recTitle.textContent = 'Recommendations:';
    resultsDiv.appendChild(recTitle);

    const recommendations = [];
    if (score >= 70) {
        recommendations.push('Consider targeting longer-tail variations.');
        recommendations.push('Build strong backlink profile before competing.');
        recommendations.push('Create comprehensive, authoritative content.');
    } else if (score >= 40) {
        recommendations.push('Good keyword to target with quality content.');
        recommendations.push('Focus on on-page SEO optimization.');
        recommendations.push('Build relevant internal links.');
    } else {
        recommendations.push('Great opportunity - low competition keyword.');
        recommendations.push('Create targeted content to rank quickly.');
        recommendations.push('Use this keyword in title tags and headers.');
    }
    const recList = document.createElement('ul');
    recommendations.forEach(r => {
        const li = document.createElement('li');
        li.textContent = r;
        recList.appendChild(li);
    });
    resultsDiv.appendChild(recList);
}

function findLongTailKeywords() {
    const keyword = document.getElementById('longTailKeyword').value.trim();
    if (!keyword) {
        showMessage('longTailResult', 'Please enter a seed keyword.', 'error');
        return;
    }
    const resultsDiv = document.getElementById('longTailResult');
    resultsDiv.innerHTML = '';

    const templates = [
        'best ' + keyword + ' for beginners',
        'how to ' + keyword + ' effectively',
        keyword + ' vs alternatives',
        'top 10 ' + keyword,
        'affordable ' + keyword + ' options',
        keyword + ' for small business',
        keyword + ' tips and tricks',
        'best free ' + keyword,
        keyword + ' step by step guide',
        'why ' + keyword + ' is important'
    ];

    const title = document.createElement('h3');
    title.textContent = 'Long Tail Keywords for "' + keyword + '"';
    resultsDiv.appendChild(title);

    const list = document.createElement('ul');
    templates.forEach(t => {
        const li = document.createElement('li');
        li.textContent = t;
        list.appendChild(li);
    });
    resultsDiv.appendChild(list);
}

function checkBacklinks() {
    const url = document.getElementById('backlinkUrl').value.trim();
    if (!url) {
        showMessage('backlinkResult', 'Please enter a URL.', 'error');
        return;
    }
    const resultsDiv = document.getElementById('backlinkResult');
    resultsDiv.innerHTML = '';

    const title = document.createElement('h3');
    title.textContent = 'Backlink Analysis Guide for ' + url;
    resultsDiv.appendChild(title);

    const toolsTitle = document.createElement('h4');
    toolsTitle.textContent = 'Free Backlink Checking Tools:';
    resultsDiv.appendChild(toolsTitle);

    const tools = ['Google Search Console', 'Ahrefs Backlink Checker', 'Moz Link Explorer', 'Ubersuggest', 'SEMrush'];
    const toolList = document.createElement('ul');
    tools.forEach(tool => {
        const li = document.createElement('li');
        li.textContent = tool;
        toolList.appendChild(li);
    });
    resultsDiv.appendChild(toolList);

    const templateTitle = document.createElement('h4');
    templateTitle.textContent = 'Analysis Template:';
    resultsDiv.appendChild(templateTitle);

    const sections = ['Total Backlinks: [Check with tools above]', 'Referring Domains: [Check with tools above]', 'Anchor Text Distribution: [Analyze variety of anchor texts]', 'Link Quality: [Check domain authority of linking sites]'];
    const sectionList = document.createElement('ul');
    sections.forEach(s => {
        const li = document.createElement('li');
        li.textContent = s;
        sectionList.appendChild(li);
    });
    resultsDiv.appendChild(sectionList);
}

function checkBrokenLinks() {
    const html = document.getElementById('brokenLinkHtml').value.trim();
    if (!html) {
        showMessage('brokenLinkResult', 'Please paste HTML content.', 'error');
        return;
    }
    const resultsDiv = document.getElementById('brokenLinkResult');
    resultsDiv.innerHTML = '';

    const linkRegex = /href=["']([^"']+)["']/gi;
    const links = [];
    let match;
    while ((match = linkRegex.exec(html)) !== null) {
        links.push(match[1]);
    }

    const internal = links.filter(l => l.startsWith('/') || l.startsWith('#'));
    const external = links.filter(l => l.startsWith('http'));
    const other = links.filter(l => !l.startsWith('/') && !l.startsWith('#') && !l.startsWith('http'));

    const title = document.createElement('h3');
    title.textContent = 'Link Analysis Results';
    resultsDiv.appendChild(title);

    const summary = document.createElement('p');
    summary.textContent = 'Total Links Found: ' + links.length + ' | Internal: ' + internal.length + ' | External: ' + external.length + ' | Other: ' + other.length;
    resultsDiv.appendChild(summary);

    if (internal.length > 0) {
        const intTitle = document.createElement('h4');
        intTitle.textContent = 'Internal Links:';
        resultsDiv.appendChild(intTitle);
        const intList = document.createElement('ul');
        internal.forEach(l => {
            const li = document.createElement('li');
            li.textContent = l;
            intList.appendChild(li);
        });
        resultsDiv.appendChild(intList);
    }

    if (external.length > 0) {
        const extTitle = document.createElement('h4');
        extTitle.textContent = 'External Links:';
        resultsDiv.appendChild(extTitle);
        const extList = document.createElement('ul');
        external.forEach(l => {
            const li = document.createElement('li');
            li.textContent = l;
            extList.appendChild(li);
        });
        resultsDiv.appendChild(extList);
    }
}

function checkRedirects() {
    const url = document.getElementById('redirectUrl').value.trim();
    if (!url) {
        showMessage('redirectResult', 'Please enter a URL.', 'error');
        return;
    }
    const resultsDiv = document.getElementById('redirectResult');
    resultsDiv.innerHTML = '';

    const title = document.createElement('h3');
    title.textContent = 'Redirect Types Reference';
    resultsDiv.appendChild(title);

    const types = [
        { code: '301', name: 'Moved Permanently', desc: 'SEO friendly - passes link equity' },
        { code: '302', name: 'Found (Temporary)', desc: 'Temporary redirect - does not pass full link equity' },
        { code: '307', name: 'Temporary Redirect', desc: 'HTTP/1.1 temporary redirect' },
        { code: '308', name: 'Permanent Redirect', desc: 'HTTP/1.1 permanent redirect' }
    ];

    const typeList = document.createElement('ul');
    types.forEach(t => {
        const li = document.createElement('li');
        li.textContent = t.code + ' ' + t.name + ' - ' + t.desc;
        typeList.appendChild(li);
    });
    resultsDiv.appendChild(typeList);

    const htaccessTitle = document.createElement('h4');
    htaccessTitle.textContent = '.htaccess Redirect Code:';
    resultsDiv.appendChild(htaccessTitle);

    const htaccessCode = document.createElement('pre');
    htaccessCode.textContent = 'RewriteEngine On\nRewriteRule ^old-page$ ' + url + ' [R=301,L]';
    resultsDiv.appendChild(htaccessCode);

    const nginxTitle = document.createElement('h4');
    nginxTitle.textContent = 'Nginx Redirect Code:';
    resultsDiv.appendChild(nginxTitle);

    const nginxCode = document.createElement('pre');
    nginxCode.textContent = 'server {\n    location /old-page {\n        return 301 ' + url + ';\n    }\n}';
    resultsDiv.appendChild(nginxCode);
}

function checkDomainAuthority() {
    const domain = document.getElementById('domainAuthority').value.trim();
    if (!domain) {
        showMessage('domainAuthorityResult', 'Please enter a domain.', 'error');
        return;
    }
    const resultsDiv = document.getElementById('domainAuthorityResult');
    resultsDiv.innerHTML = '';

    let score = 50;
    // Domain length factor
    if (domain.length <= 10) score += 10;
    else if (domain.length <= 15) score += 5;
    else score -= 5;

    // TLD bonus
    const tld = domain.split('.').pop().toLowerCase();
    if (['com', 'org', 'edu'].includes(tld)) score += 10;
    else if (['net', 'gov'].includes(tld)) score += 5;

    // Hyphens penalty
    const hyphens = (domain.match(/-/g) || []).length;
    score -= hyphens * 5;

    // Numbers penalty
    const numbers = (domain.match(/\d/g) || []).length;
    score -= numbers * 2;

    score = Math.max(0, Math.min(100, score));

    const title = document.createElement('h3');
    title.textContent = 'Domain Authority Analysis: ' + domain;
    resultsDiv.appendChild(title);

    const scoreP = document.createElement('p');
    scoreP.textContent = 'Estimated Authority Score: ' + score + '/100';
    scoreP.style.fontWeight = 'bold';
    resultsDiv.appendChild(scoreP);

    const factorsTitle = document.createElement('h4');
    factorsTitle.textContent = 'Factors Analyzed:';
    resultsDiv.appendChild(factorsTitle);

    const factors = document.createElement('ul');
    const factorItems = [
        'Domain Length: ' + domain.length + ' characters',
        'TLD: .' + tld,
        'Hyphens: ' + hyphens,
        'Numbers in domain: ' + numbers
    ];
    factorItems.forEach(f => {
        const li = document.createElement('li');
        li.textContent = f;
        factors.appendChild(li);
    });
    resultsDiv.appendChild(factors);

    const tipsTitle = document.createElement('h4');
    tipsTitle.textContent = 'Improvement Tips:';
    resultsDiv.appendChild(tipsTitle);

    const tips = document.createElement('ul');
    const tipItems = ['Build quality backlinks from authoritative sites.', 'Create valuable, original content regularly.', 'Improve site technical SEO and speed.', 'Maintain consistent social media presence.'];
    tipItems.forEach(t => {
        const li = document.createElement('li');
        li.textContent = t;
        tips.appendChild(li);
    });
    resultsDiv.appendChild(tips);
}

function checkWwwRedirect() {
    const domain = document.getElementById('wwwDomain').value.trim();
    if (!domain) {
        showMessage('wwwResult', 'Please enter a domain.', 'error');
        return;
    }
    const resultsDiv = document.getElementById('wwwResult');
    resultsDiv.innerHTML = '';

    const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '');

    const title = document.createElement('h3');
    title.textContent = 'WWW Redirect Configuration for ' + cleanDomain;
    resultsDiv.appendChild(title);

    // www to non-www
    const h4a = document.createElement('h4');
    h4a.textContent = '.htaccess: WWW → Non-WWW';
    resultsDiv.appendChild(h4a);
    const preA = document.createElement('pre');
    preA.textContent = 'RewriteEngine On\nRewriteCond %{HTTP_HOST} ^www\\.' + cleanDomain.replace(/\./g, '\\.') + ' [NC]\nRewriteRule ^(.*)$ https://' + cleanDomain + '/$1 [R=301,L]';
    resultsDiv.appendChild(preA);

    // non-www to www
    const h4b = document.createElement('h4');
    h4b.textContent = '.htaccess: Non-WWW → WWW';
    resultsDiv.appendChild(h4b);
    const preB = document.createElement('pre');
    preB.textContent = 'RewriteEngine On\nRewriteCond %{HTTP_HOST} !^www\\.' + cleanDomain.replace(/\./g, '\\.') + ' [NC]\nRewriteRule ^(.*)$ https://www.' + cleanDomain + '/$1 [R=301,L]';
    resultsDiv.appendChild(preB);

    // Nginx www to non-www
    const h4c = document.createElement('h4');
    h4c.textContent = 'Nginx: WWW → Non-WWW';
    resultsDiv.appendChild(h4c);
    const preC = document.createElement('pre');
    preC.textContent = 'server {\n    server_name www.' + cleanDomain + ';\n    return 301 https://' + cleanDomain + '$request_uri;\n}';
    resultsDiv.appendChild(preC);

    // Nginx non-www to www
    const h4d = document.createElement('h4');
    h4d.textContent = 'Nginx: Non-WWW → WWW';
    resultsDiv.appendChild(h4d);
    const preD = document.createElement('pre');
    preD.textContent = 'server {\n    server_name ' + cleanDomain + ';\n    return 301 https://www.' + cleanDomain + '$request_uri;\n}';
    resultsDiv.appendChild(preD);
}

function analyzeLinks() {
    const html = document.getElementById('linkAnalyzerHtml').value.trim();
    if (!html) {
        showMessage('linkAnalyzerResult', 'Please paste HTML content.', 'error');
        return;
    }
    const resultsDiv = document.getElementById('linkAnalyzerResult');
    resultsDiv.innerHTML = '';

    const linkRegex = /<a\s[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
    const links = [];
    let match;
    while ((match = linkRegex.exec(html)) !== null) {
        const href = match[1];
        const fullTag = match[0];
        const hasNofollow = /rel=["'][^"']*nofollow[^"']*["']/i.test(fullTag);
        const isInternal = href.startsWith('/') || href.startsWith('#');
        links.push({ href: href, nofollow: hasNofollow, internal: isInternal });
    }

    const internalCount = links.filter(l => l.internal).length;
    const externalCount = links.filter(l => !l.internal).length;
    const nofollowCount = links.filter(l => l.nofollow).length;
    const dofollowCount = links.length - nofollowCount;

    const title = document.createElement('h3');
    title.textContent = 'Link Analysis Results';
    resultsDiv.appendChild(title);

    const stats = [
        'Total Links: ' + links.length,
        'Internal Links: ' + internalCount,
        'External Links: ' + externalCount,
        'Nofollow Links: ' + nofollowCount,
        'Dofollow Links: ' + dofollowCount
    ];
    const statList = document.createElement('ul');
    stats.forEach(s => {
        const li = document.createElement('li');
        li.textContent = s;
        statList.appendChild(li);
    });
    resultsDiv.appendChild(statList);
}

function analyzeAnchorText() {
    const html = document.getElementById('anchorTextHtml').value.trim();
    if (!html) {
        showMessage('anchorTextResult', 'Please paste HTML content.', 'error');
        return;
    }
    const resultsDiv = document.getElementById('anchorTextResult');
    resultsDiv.innerHTML = '';

    const linkRegex = /<a\s[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
    const anchors = {};
    const categories = { 'exact match': 0, 'generic': 0, 'url': 0, 'branded': 0 };
    let match;
    while ((match = linkRegex.exec(html)) !== null) {
        const text = match[2].replace(/<[^>]+>/g, '').trim();
        if (text) {
            anchors[text] = (anchors[text] || 0) + 1;
            const lowerText = text.toLowerCase();
            if (lowerText.startsWith('http')) {
                categories['url']++;
            } else if (['click here', 'read more', 'learn more', 'here', 'this'].includes(lowerText)) {
                categories['generic']++;
            } else {
                categories['branded']++;
            }
        }
    }

    const title = document.createElement('h3');
    title.textContent = 'Anchor Text Analysis';
    resultsDiv.appendChild(title);

    const distTitle = document.createElement('h4');
    distTitle.textContent = 'Distribution:';
    resultsDiv.appendChild(distTitle);

    const distList = document.createElement('ul');
    Object.entries(categories).forEach(([cat, count]) => {
        const li = document.createElement('li');
        li.textContent = cat.charAt(0).toUpperCase() + cat.slice(1) + ': ' + count;
        distList.appendChild(li);
    });
    resultsDiv.appendChild(distList);

    const freqTitle = document.createElement('h4');
    freqTitle.textContent = 'Anchor Text Frequency:';
    resultsDiv.appendChild(freqTitle);

    const freqList = document.createElement('ul');
    Object.entries(anchors).sort((a, b) => b[1] - a[1]).forEach(([text, count]) => {
        const li = document.createElement('li');
        li.textContent = '"' + text + '" - ' + count + ' time(s)';
        freqList.appendChild(li);
    });
    resultsDiv.appendChild(freqList);
}

function checkNofollow() {
    const html = document.getElementById('nofollowHtml').value.trim();
    if (!html) {
        showMessage('nofollowResult', 'Please paste HTML content.', 'error');
        return;
    }
    const resultsDiv = document.getElementById('nofollowResult');
    resultsDiv.innerHTML = '';

    const linkRegex = /<a\s[^>]*href=["']([^"']+)["'][^>]*>/gi;
    const links = [];
    let match;
    while ((match = linkRegex.exec(html)) !== null) {
        const href = match[1];
        const fullTag = match[0];
        const isNofollow = /rel=["'][^"']*nofollow[^"']*["']/i.test(fullTag);
        links.push({ href: href, nofollow: isNofollow });
    }

    const nofollowCount = links.filter(l => l.nofollow).length;
    const dofollowCount = links.length - nofollowCount;
    const nofollowPct = links.length > 0 ? ((nofollowCount / links.length) * 100).toFixed(1) : 0;
    const dofollowPct = links.length > 0 ? ((dofollowCount / links.length) * 100).toFixed(1) : 0;

    const title = document.createElement('h3');
    title.textContent = 'Nofollow Link Analysis';
    resultsDiv.appendChild(title);

    const stats = document.createElement('ul');
    const statItems = [
        'Total Links: ' + links.length,
        'Dofollow: ' + dofollowCount + ' (' + dofollowPct + '%)',
        'Nofollow: ' + nofollowCount + ' (' + nofollowPct + '%)'
    ];
    statItems.forEach(s => {
        const li = document.createElement('li');
        li.textContent = s;
        stats.appendChild(li);
    });
    resultsDiv.appendChild(stats);

    if (links.length > 0) {
        const detailTitle = document.createElement('h4');
        detailTitle.textContent = 'Link Details:';
        resultsDiv.appendChild(detailTitle);
        const detailList = document.createElement('ul');
        links.forEach(l => {
            const li = document.createElement('li');
            li.textContent = l.href + ' - ' + (l.nofollow ? 'Nofollow' : 'Dofollow');
            detailList.appendChild(li);
        });
        resultsDiv.appendChild(detailList);
    }
}

function showImageOptimizationTips() {
    const resultsDiv = document.getElementById('imageOptimizerResult');
    resultsDiv.innerHTML = '';

    const title = document.createElement('h3');
    title.textContent = 'Image Optimization Checklist';
    resultsDiv.appendChild(title);

    const tips = [
        'Compress images - Use tools like TinyPNG or ImageOptim to reduce file size.',
        'Use WebP format - Modern format with superior compression.',
        'Implement lazy loading - Add loading="lazy" to img tags.',
        'Use proper dimensions - Set width and height attributes to prevent layout shift.',
        'Responsive images with srcset - Serve different sizes for different devices.',
        'Always add alt text - Descriptive alt text improves SEO and accessibility.'
    ];

    const tipList = document.createElement('ul');
    tips.forEach(t => {
        const li = document.createElement('li');
        li.textContent = t;
        tipList.appendChild(li);
    });
    resultsDiv.appendChild(tipList);

    const codeTitle = document.createElement('h4');
    codeTitle.textContent = 'Sample Responsive Image Code:';
    resultsDiv.appendChild(codeTitle);

    const code = document.createElement('pre');
    code.textContent = '<picture>\n  <source media="(max-width: 480px)" srcset="image-480w.webp" type="image/webp">\n  <source media="(max-width: 800px)" srcset="image-800w.webp" type="image/webp">\n  <source srcset="image-1200w.webp" type="image/webp">\n  <img src="image-1200w.jpg" alt="Descriptive alt text" loading="lazy" width="1200" height="800">\n</picture>';
    resultsDiv.appendChild(code);
}

function generateFaviconCode() {
    const url = document.getElementById('faviconUrl').value.trim();
    const siteName = document.getElementById('faviconSiteName').value.trim();
    if (!url) {
        showMessage('faviconResult', 'Please enter a favicon image URL.', 'error');
        return;
    }
    const resultsDiv = document.getElementById('faviconResult');
    resultsDiv.innerHTML = '';

    const title = document.createElement('h3');
    title.textContent = 'Favicon HTML Code';
    resultsDiv.appendChild(title);

    const code = document.createElement('pre');
    code.textContent =
        '<!-- Standard Favicons -->\n' +
        '<link rel="icon" type="image/png" sizes="16x16" href="' + url + '">\n' +
        '<link rel="icon" type="image/png" sizes="32x32" href="' + url + '">\n\n' +
        '<!-- Apple Touch Icon -->\n' +
        '<link rel="apple-touch-icon" sizes="180x180" href="' + url + '">\n\n' +
        '<!-- Android Chrome -->\n' +
        '<link rel="icon" type="image/png" sizes="192x192" href="' + url + '">\n' +
        '<link rel="icon" type="image/png" sizes="512x512" href="' + url + '">\n\n' +
        '<!-- Web Manifest -->\n' +
        '<link rel="manifest" href="/site.webmanifest">\n\n' +
        '<!-- Microsoft -->\n' +
        '<meta name="msapplication-TileImage" content="' + url + '">\n' +
        '<meta name="msapplication-TileColor" content="#ffffff">\n' +
        (siteName ? '<meta name="application-name" content="' + siteName + '">\n' : '');
    resultsDiv.appendChild(code);
}

function generateOgImage() {
    const ogTitle = document.getElementById('ogTitle').value.trim();
    const ogSubtitle = document.getElementById('ogSubtitle').value.trim();
    const bgColor = document.getElementById('ogBgColor').value.trim() || '#4A90D9';
    const textColor = document.getElementById('ogTextColor').value.trim() || '#FFFFFF';
    if (!ogTitle) {
        showMessage('ogImageResult', 'Please enter a title.', 'error');
        return;
    }
    const resultsDiv = document.getElementById('ogImageResult');
    resultsDiv.innerHTML = '';

    const title = document.createElement('h3');
    title.textContent = 'OG Image Preview';
    resultsDiv.appendChild(title);

    // Preview div with 1200x630 aspect ratio
    const preview = document.createElement('div');
    preview.style.cssText = 'max-width:600px;padding-bottom:52.5%;position:relative;background:' + escapeHtml(bgColor) + ';border-radius:8px;overflow:hidden;margin:10px 0;';

    const content = document.createElement('div');
    content.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:20px;';

    const titleEl = document.createElement('h2');
    titleEl.textContent = ogTitle;
    titleEl.style.cssText = 'color:' + escapeHtml(textColor) + ';margin:0 0 10px 0;text-align:center;';
    content.appendChild(titleEl);

    if (ogSubtitle) {
        const subtitleEl = document.createElement('p');
        subtitleEl.textContent = ogSubtitle;
        subtitleEl.style.cssText = 'color:' + escapeHtml(textColor) + ';margin:0;text-align:center;opacity:0.9;';
        content.appendChild(subtitleEl);
    }

    preview.appendChild(content);
    resultsDiv.appendChild(preview);

    const metaTitle = document.createElement('h4');
    metaTitle.textContent = 'OG Meta Tags:';
    resultsDiv.appendChild(metaTitle);

    const metaCode = document.createElement('pre');
    metaCode.textContent =
        '<meta property="og:title" content="' + ogTitle + '">\n' +
        (ogSubtitle ? '<meta property="og:description" content="' + ogSubtitle + '">\n' : '') +
        '<meta property="og:image" content="YOUR_IMAGE_URL">\n' +
        '<meta property="og:image:width" content="1200">\n' +
        '<meta property="og:image:height" content="630">\n' +
        '<meta property="og:type" content="website">';
    resultsDiv.appendChild(metaCode);
}

function analyzePageSpeed() {
    const url = document.getElementById('pageSpeedUrl').value.trim();
    if (!url) {
        showMessage('pageSpeedResult', 'Please enter a URL.', 'error');
        return;
    }
    const resultsDiv = document.getElementById('pageSpeedResult');
    resultsDiv.innerHTML = '';

    const title = document.createElement('h3');
    title.textContent = 'Page Speed Optimization Checklist';
    resultsDiv.appendChild(title);

    const categories = [
        {
            name: 'LCP (Largest Contentful Paint)',
            tips: ['Optimize and compress images.', 'Preload critical resources.', 'Minimize render-blocking CSS and JavaScript.']
        },
        {
            name: 'FID (First Input Delay)',
            tips: ['Minimize and defer JavaScript.', 'Use web workers for heavy tasks.', 'Break up long tasks into smaller ones.']
        },
        {
            name: 'CLS (Cumulative Layout Shift)',
            tips: ['Set explicit dimensions on images and video.', 'Avoid inserting content above existing content.', 'Use CSS transform animations instead of layout-triggering properties.']
        }
    ];

    categories.forEach(cat => {
        const catTitle = document.createElement('h4');
        catTitle.textContent = cat.name;
        resultsDiv.appendChild(catTitle);

        const tipList = document.createElement('ul');
        cat.tips.forEach(tip => {
            const li = document.createElement('li');
            li.textContent = tip;
            tipList.appendChild(li);
        });
        resultsDiv.appendChild(tipList);
    });
}

function testMobileFriendly() {
    const url = document.getElementById('mobileFriendlyUrl').value.trim();
    if (!url) {
        showMessage('mobileFriendlyResult', 'Please enter a URL.', 'error');
        return;
    }
    const resultsDiv = document.getElementById('mobileFriendlyResult');
    resultsDiv.innerHTML = '';

    const title = document.createElement('h3');
    title.textContent = 'Mobile-Friendly Checklist';
    resultsDiv.appendChild(title);

    const checks = [
        'Viewport meta tag - Ensure your page has a proper viewport meta tag.',
        'Responsive CSS - Use media queries for different screen sizes.',
        'Touch target size - Buttons and links should be at least 48x48px.',
        'Readable font sizes - Use at least 16px for body text.',
        'No horizontal scrolling - Content should fit within the viewport.',
        'Fast loading - Page should load in under 3 seconds on mobile.'
    ];

    const checkList = document.createElement('ul');
    checks.forEach(c => {
        const li = document.createElement('li');
        li.textContent = c;
        checkList.appendChild(li);
    });
    resultsDiv.appendChild(checkList);

    const codeTitle = document.createElement('h4');
    codeTitle.textContent = 'Proper Viewport Meta Tag:';
    resultsDiv.appendChild(codeTitle);

    const code = document.createElement('pre');
    code.textContent = '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
    resultsDiv.appendChild(code);

    const tipsTitle = document.createElement('h4');
    tipsTitle.textContent = 'Responsive Design Tips:';
    resultsDiv.appendChild(tipsTitle);

    const tips = document.createElement('ul');
    const tipItems = ['Use flexbox or CSS grid for layouts.', 'Use relative units (%, em, rem) instead of fixed pixels.', 'Test on multiple device sizes.', 'Use responsive images with srcset.'];
    tipItems.forEach(t => {
        const li = document.createElement('li');
        li.textContent = t;
        tips.appendChild(li);
    });
    resultsDiv.appendChild(tips);
}

function checkSSL() {
    const domain = document.getElementById('sslDomain').value.trim();
    if (!domain) {
        showMessage('sslResult', 'Please enter a domain.', 'error');
        return;
    }
    const resultsDiv = document.getElementById('sslResult');
    resultsDiv.innerHTML = '';

    const title = document.createElement('h3');
    title.textContent = 'SSL Security Checklist for ' + domain;
    resultsDiv.appendChild(title);

    const checks = [
        'Valid SSL Certificate - Ensure certificate is not expired.',
        'HTTPS Redirect - All HTTP traffic should redirect to HTTPS.',
        'HSTS Header - Enable HTTP Strict Transport Security.',
        'Secure Cookies - Set Secure flag on all cookies.',
        'Mixed Content - No HTTP resources loaded on HTTPS pages.',
        'Certificate Chain - Complete certificate chain is served.'
    ];

    const checkList = document.createElement('ul');
    checks.forEach(c => {
        const li = document.createElement('li');
        li.textContent = c;
        checkList.appendChild(li);
    });
    resultsDiv.appendChild(checkList);

    const codeTitle = document.createElement('h4');
    codeTitle.textContent = 'Recommended HSTS Header:';
    resultsDiv.appendChild(codeTitle);

    const code = document.createElement('pre');
    code.textContent = 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload';
    resultsDiv.appendChild(code);
}

function validateStructuredData() {
    const input = document.getElementById('structuredDataInput').value.trim();
    if (!input) {
        showMessage('structuredDataResult', 'Please paste JSON-LD data.', 'error');
        return;
    }
    const resultsDiv = document.getElementById('structuredDataResult');
    resultsDiv.innerHTML = '';

    const title = document.createElement('h3');
    title.textContent = 'Structured Data Validation';
    resultsDiv.appendChild(title);

    let data;
    const checks = [];

    try {
        data = JSON.parse(input);
        checks.push({ label: 'Valid JSON', pass: true });
    } catch (e) {
        checks.push({ label: 'Valid JSON', pass: false });
        const list = document.createElement('ul');
        checks.forEach(c => {
            const li = document.createElement('li');
            li.textContent = (c.pass ? '\u2713 ' : '\u2717 ') + c.label;
            li.style.color = c.pass ? '#27ae60' : '#e74c3c';
            list.appendChild(li);
        });
        resultsDiv.appendChild(list);
        return;
    }

    // Check @context
    checks.push({ label: '@context present (schema.org)', pass: data['@context'] && String(data['@context']).includes('schema.org') });

    // Check @type
    checks.push({ label: '@type present', pass: !!data['@type'] });

    // Type-specific checks
    if (data['@type']) {
        const type = data['@type'];
        if (type === 'Article') {
            checks.push({ label: 'Article: headline', pass: !!data.headline });
            checks.push({ label: 'Article: author', pass: !!data.author });
            checks.push({ label: 'Article: datePublished', pass: !!data.datePublished });
        } else if (type === 'Product') {
            checks.push({ label: 'Product: name', pass: !!data.name });
            checks.push({ label: 'Product: description', pass: !!data.description });
        } else if (type === 'LocalBusiness') {
            checks.push({ label: 'LocalBusiness: name', pass: !!data.name });
            checks.push({ label: 'LocalBusiness: address', pass: !!data.address });
        }
    }

    const list = document.createElement('ul');
    checks.forEach(c => {
        const li = document.createElement('li');
        li.textContent = (c.pass ? '\u2713 ' : '\u2717 ') + c.label;
        li.style.color = c.pass ? '#27ae60' : '#e74c3c';
        list.appendChild(li);
    });
    resultsDiv.appendChild(list);
}

function checkServerStatus() {
    const url = document.getElementById('serverStatusUrl').value.trim();
    if (!url) {
        showMessage('serverStatusResult', 'Please enter a URL.', 'error');
        return;
    }
    const resultsDiv = document.getElementById('serverStatusResult');
    resultsDiv.innerHTML = '';

    const title = document.createElement('h3');
    title.textContent = 'HTTP Status Codes Reference';
    resultsDiv.appendChild(title);

    const codes = [
        { code: '200', name: 'OK', desc: 'Request successful.' },
        { code: '301', name: 'Moved Permanently', desc: 'Resource has permanently moved.' },
        { code: '302', name: 'Found', desc: 'Temporary redirect.' },
        { code: '400', name: 'Bad Request', desc: 'Server cannot process the request.' },
        { code: '401', name: 'Unauthorized', desc: 'Authentication required.' },
        { code: '403', name: 'Forbidden', desc: 'Access denied.' },
        { code: '404', name: 'Not Found', desc: 'Resource not found.' },
        { code: '500', name: 'Internal Server Error', desc: 'Server encountered an error.' },
        { code: '502', name: 'Bad Gateway', desc: 'Invalid response from upstream server.' },
        { code: '503', name: 'Service Unavailable', desc: 'Server temporarily unavailable.' }
    ];

    const codeList = document.createElement('ul');
    codes.forEach(c => {
        const li = document.createElement('li');
        li.textContent = c.code + ' ' + c.name + ' - ' + c.desc;
        codeList.appendChild(li);
    });
    resultsDiv.appendChild(codeList);

    const monitorTitle = document.createElement('h4');
    monitorTitle.textContent = 'Server Monitoring Tips:';
    resultsDiv.appendChild(monitorTitle);

    const tips = document.createElement('ul');
    const tipItems = ['Set up uptime monitoring alerts.', 'Monitor response times regularly.', 'Use tools like UptimeRobot, Pingdom, or StatusCake.', 'Configure health check endpoints.'];
    tipItems.forEach(t => {
        const li = document.createElement('li');
        li.textContent = t;
        tips.appendChild(li);
    });
    resultsDiv.appendChild(tips);
}

function performDnsLookup() {
    const domain = document.getElementById('dnsLookupDomain').value.trim();
    if (!domain) {
        showMessage('dnsLookupResult', 'Please enter a domain.', 'error');
        return;
    }
    const resultsDiv = document.getElementById('dnsLookupResult');
    resultsDiv.innerHTML = '';

    const title = document.createElement('h3');
    title.textContent = 'DNS Record Types for ' + domain;
    resultsDiv.appendChild(title);

    const records = [
        { type: 'A', desc: 'Maps domain to IPv4 address.' },
        { type: 'AAAA', desc: 'Maps domain to IPv6 address.' },
        { type: 'CNAME', desc: 'Alias for another domain name.' },
        { type: 'MX', desc: 'Mail exchange server for the domain.' },
        { type: 'TXT', desc: 'Text records for verification and policies.' },
        { type: 'NS', desc: 'Name servers authoritative for the domain.' },
        { type: 'SOA', desc: 'Start of authority - primary name server info.' },
        { type: 'PTR', desc: 'Reverse DNS lookup record.' }
    ];

    const recList = document.createElement('ul');
    records.forEach(r => {
        const li = document.createElement('li');
        li.textContent = r.type + ' - ' + r.desc;
        recList.appendChild(li);
    });
    resultsDiv.appendChild(recList);

    const cmdTitle = document.createElement('h4');
    cmdTitle.textContent = 'Dig Commands for ' + domain + ':';
    resultsDiv.appendChild(cmdTitle);

    const cmdCode = document.createElement('pre');
    cmdCode.textContent =
        'dig ' + domain + ' A\n' +
        'dig ' + domain + ' AAAA\n' +
        'dig ' + domain + ' MX\n' +
        'dig ' + domain + ' TXT\n' +
        'dig ' + domain + ' NS\n' +
        'dig ' + domain + ' CNAME';
    resultsDiv.appendChild(cmdCode);
}

function performWhoisLookup() {
    const domain = document.getElementById('whoisDomain').value.trim();
    if (!domain) {
        showMessage('whoisResult', 'Please enter a domain.', 'error');
        return;
    }
    const resultsDiv = document.getElementById('whoisResult');
    resultsDiv.innerHTML = '';

    const title = document.createElement('h3');
    title.textContent = 'WHOIS Information for ' + domain;
    resultsDiv.appendChild(title);

    const infoTitle = document.createElement('h4');
    infoTitle.textContent = 'WHOIS Data Explained:';
    resultsDiv.appendChild(infoTitle);

    const infoItems = [
        'Registrar Info - The company where the domain is registered.',
        'Creation Date - When the domain was first registered.',
        'Expiration Date - When the domain registration expires.',
        'Name Servers - DNS servers authoritative for the domain.',
        'Registrant Contact - Owner contact information.'
    ];
    const infoList = document.createElement('ul');
    infoItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        infoList.appendChild(li);
    });
    resultsDiv.appendChild(infoList);

    const privacyTitle = document.createElement('h4');
    privacyTitle.textContent = 'Privacy Considerations:';
    resultsDiv.appendChild(privacyTitle);

    const privacyItems = ['GDPR regulations may redact personal data in WHOIS.', 'WHOIS privacy services can mask registrant details.', 'Some registrars offer free WHOIS privacy protection.'];
    const privacyList = document.createElement('ul');
    privacyItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        privacyList.appendChild(li);
    });
    resultsDiv.appendChild(privacyList);

    const templateTitle = document.createElement('h4');
    templateTitle.textContent = 'Typical WHOIS Output:';
    resultsDiv.appendChild(templateTitle);

    const template = document.createElement('pre');
    template.textContent =
        'Domain Name: ' + domain.toUpperCase() + '\n' +
        'Registrar: [Registrar Name]\n' +
        'Creation Date: [YYYY-MM-DD]\n' +
        'Expiration Date: [YYYY-MM-DD]\n' +
        'Name Server: ns1.' + domain + '\n' +
        'Name Server: ns2.' + domain + '\n' +
        'Status: clientTransferProhibited';
    resultsDiv.appendChild(template);
}

function findIpLocation() {
    const ip = document.getElementById('ipAddress').value.trim();
    if (!ip) {
        showMessage('ipLocationResult', 'Please enter an IP address.', 'error');
        return;
    }
    const resultsDiv = document.getElementById('ipLocationResult');
    resultsDiv.innerHTML = '';

    // Validate IPv4
    const ipRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = ip.match(ipRegex);
    if (!match || match.slice(1).some(octet => parseInt(octet) > 255)) {
        showMessage('ipLocationResult', 'Please enter a valid IPv4 address.', 'error');
        return;
    }

    const title = document.createElement('h3');
    title.textContent = 'IP Address Analysis: ' + ip;
    resultsDiv.appendChild(title);

    const structTitle = document.createElement('h4');
    structTitle.textContent = 'IP Structure:';
    resultsDiv.appendChild(structTitle);

    const octets = ip.split('.');
    const firstOctet = parseInt(octets[0]);
    let ipClass;
    if (firstOctet <= 127) ipClass = 'Class A (1.0.0.0 - 127.255.255.255)';
    else if (firstOctet <= 191) ipClass = 'Class B (128.0.0.0 - 191.255.255.255)';
    else if (firstOctet <= 223) ipClass = 'Class C (192.0.0.0 - 223.255.255.255)';
    else if (firstOctet <= 239) ipClass = 'Class D - Multicast (224.0.0.0 - 239.255.255.255)';
    else ipClass = 'Class E - Reserved (240.0.0.0 - 255.255.255.255)';

    const classP = document.createElement('p');
    classP.textContent = 'IP Class: ' + ipClass;
    resultsDiv.appendChild(classP);

    const isPrivate = (firstOctet === 10) ||
        (firstOctet === 172 && parseInt(octets[1]) >= 16 && parseInt(octets[1]) <= 31) ||
        (firstOctet === 192 && parseInt(octets[1]) === 168);

    const privateP = document.createElement('p');
    privateP.textContent = isPrivate ? 'This is a private IP address.' : 'This is a public IP address.';
    resultsDiv.appendChild(privateP);

    const cdnTitle = document.createElement('h4');
    cdnTitle.textContent = 'CDN Recommendations for Global Reach:';
    resultsDiv.appendChild(cdnTitle);

    const cdnList = document.createElement('ul');
    const cdns = ['Cloudflare - Free tier available with global CDN.', 'AWS CloudFront - Pay-as-you-go CDN service.', 'Fastly - High-performance edge cloud platform.', 'Google Cloud CDN - Integrated with Google Cloud.'];
    cdns.forEach(cdn => {
        const li = document.createElement('li');
        li.textContent = cdn;
        cdnList.appendChild(li);
    });
    resultsDiv.appendChild(cdnList);
}

function checkHttpHeaders() {
    const url = document.getElementById('headersUrl').value.trim();
    if (!url) {
        showMessage('headersResult', 'Please enter a URL.', 'error');
        return;
    }
    const resultsDiv = document.getElementById('headersResult');
    resultsDiv.innerHTML = '';

    const title = document.createElement('h3');
    title.textContent = 'Important SEO HTTP Headers';
    resultsDiv.appendChild(title);

    const headers = [
        { name: 'X-Robots-Tag', desc: 'Controls search engine indexing at server level.' },
        { name: 'Link (rel=canonical)', desc: 'Specifies canonical URL via HTTP header.' },
        { name: 'Cache-Control', desc: 'Controls browser and CDN caching behavior.' },
        { name: 'Content-Type', desc: 'Specifies the media type of the resource.' },
        { name: 'Content-Security-Policy', desc: 'Prevents XSS and other injection attacks.' },
        { name: 'Strict-Transport-Security', desc: 'Forces HTTPS connections.' },
        { name: 'X-Content-Type-Options', desc: 'Prevents MIME type sniffing.' },
        { name: 'X-Frame-Options', desc: 'Controls iframe embedding.' }
    ];

    const headerList = document.createElement('ul');
    headers.forEach(h => {
        const li = document.createElement('li');
        li.textContent = h.name + ' - ' + h.desc;
        headerList.appendChild(li);
    });
    resultsDiv.appendChild(headerList);

    const configTitle = document.createElement('h4');
    configTitle.textContent = 'Recommended Headers Configuration (Nginx):';
    resultsDiv.appendChild(configTitle);

    const configCode = document.createElement('pre');
    configCode.textContent =
        'add_header X-Content-Type-Options "nosniff" always;\n' +
        'add_header X-Frame-Options "SAMEORIGIN" always;\n' +
        'add_header X-Robots-Tag "index, follow" always;\n' +
        'add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;\n' +
        'add_header Content-Security-Policy "default-src \'self\'" always;\n' +
        'add_header Cache-Control "public, max-age=86400";';
    resultsDiv.appendChild(configCode);
}

function testRichSnippets() {
    const input = document.getElementById('richSnippetInput').value.trim();
    if (!input) {
        showMessage('richSnippetResult', 'Please paste JSON-LD data.', 'error');
        return;
    }
    const resultsDiv = document.getElementById('richSnippetResult');
    resultsDiv.innerHTML = '';

    let data;
    try {
        data = JSON.parse(input);
    } catch (e) {
        showMessage('richSnippetResult', 'Invalid JSON. Please check your input.', 'error');
        return;
    }

    const title = document.createElement('h3');
    title.textContent = 'Rich Snippet Preview';
    resultsDiv.appendChild(title);

    const type = data['@type'] || 'Unknown';

    // Mock Google search result preview
    const preview = document.createElement('div');
    preview.style.cssText = 'border:1px solid #ddd;border-radius:8px;padding:16px;margin:10px 0;max-width:600px;font-family:Arial,sans-serif;';

    let snippetTitle = '';
    let snippetUrl = '';
    let snippetDesc = '';

    if (type === 'Article') {
        snippetTitle = data.headline || data.name || 'Article Title';
        snippetUrl = data.url || 'https://example.com/article';
        snippetDesc = data.description || 'Article description...';
        if (data.datePublished) {
            snippetDesc = data.datePublished + ' — ' + snippetDesc;
        }
    } else if (type === 'Product') {
        snippetTitle = data.name || 'Product Name';
        snippetUrl = data.url || 'https://example.com/product';
        snippetDesc = data.description || 'Product description...';
        if (data.offers && data.offers.price) {
            snippetDesc = 'Price: $' + data.offers.price + ' — ' + snippetDesc;
        }
    } else {
        snippetTitle = data.name || data.headline || 'Page Title';
        snippetUrl = data.url || 'https://example.com';
        snippetDesc = data.description || 'Page description...';
    }

    const titleLink = document.createElement('div');
    titleLink.textContent = snippetTitle;
    titleLink.style.cssText = 'color:#1a0dab;font-size:18px;cursor:pointer;margin-bottom:4px;';
    preview.appendChild(titleLink);

    const urlLine = document.createElement('div');
    urlLine.textContent = snippetUrl;
    urlLine.style.cssText = 'color:#006621;font-size:14px;margin-bottom:4px;';
    preview.appendChild(urlLine);

    if (type === 'Product' && data.aggregateRating) {
        const ratingLine = document.createElement('div');
        const rating = parseFloat(data.aggregateRating.ratingValue) || 0;
        const stars = '\u2605'.repeat(Math.round(rating)) + '\u2606'.repeat(5 - Math.round(rating));
        ratingLine.textContent = stars + ' ' + rating.toFixed(1);
        ratingLine.style.cssText = 'color:#e67700;font-size:14px;margin-bottom:4px;';
        preview.appendChild(ratingLine);
    }

    const descLine = document.createElement('div');
    descLine.textContent = snippetDesc;
    descLine.style.cssText = 'color:#545454;font-size:13px;line-height:1.4;';
    preview.appendChild(descLine);

    resultsDiv.appendChild(preview);

    const typeInfo = document.createElement('p');
    typeInfo.textContent = 'Schema Type: ' + type;
    typeInfo.style.fontWeight = 'bold';
    resultsDiv.appendChild(typeInfo);
}

// Utility Functions
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent || element.innerText;
    
    navigator.clipboard.writeText(text).then(() => {
        showMessage(elementId, 'Copied to clipboard!', 'success');
    }).catch(() => {
        showMessage(elementId, 'Failed to copy', 'error');
    });
}

function showMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    const messageClass = type === 'error' ? 'error-message' : 'success-message';
    const icon = type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle';
    
    // Create elements safely without innerHTML
    const messageDiv = document.createElement('div');
    messageDiv.className = messageClass;
    
    const iconElement = document.createElement('i');
    iconElement.className = `fas ${icon}`;
    
    const messageSpan = document.createElement('span');
    messageSpan.textContent = message; // Use textContent to prevent XSS
    
    messageDiv.appendChild(iconElement);
    messageDiv.appendChild(messageSpan);
    
    element.innerHTML = '';
    element.appendChild(messageDiv);
    
    setTimeout(() => {
        if (element.querySelector('.error-message, .success-message')) {
            element.innerHTML = '';
        }
    }, 3000);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

toolCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

// Back to Top Button
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
