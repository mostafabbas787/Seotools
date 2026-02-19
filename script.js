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
    minified = minified.replace(/\/\/.*$/gm, '');
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
        output = '<div class="' + escapeHtml(cssClass) + '-wrapper">\n  ' + imgTag + '\n</div>';
    } else {
        output = imgTag;
    }

    const pre = document.createElement('pre');
    pre.textContent = output;
    document.getElementById('lazyLoadResult').innerHTML = '';
    document.getElementById('lazyLoadResult').appendChild(pre);
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
