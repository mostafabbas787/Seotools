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
    
    let html = '<h3>Top 10 Keywords:</h3><div class="stats-grid">';
    sorted.forEach(([word, count]) => {
        const density = ((count / totalWords) * 100).toFixed(2);
        html += `
            <div class="stat-item">
                <div class="stat-value">${density}%</div>
                <div class="stat-label">${word} (${count})</div>
            </div>
        `;
    });
    html += '</div>';
    
    document.getElementById('keywordResults').innerHTML = html;
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
    
    const metaTags = `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${description}">
${keywords ? `<meta name="keywords" content="${keywords}">` : ''}
${author ? `<meta name="author" content="${author}">` : ''}

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${description}">`;
    
    document.getElementById('metaTagsResult').innerHTML = `<pre>${metaTags}</pre>`;
}

// URL Encoder/Decoder
function encodeURL() {
    const input = document.getElementById('urlInput').value;
    try {
        const encoded = encodeURIComponent(input);
        document.getElementById('urlResult').innerHTML = `<pre>${encoded}</pre>`;
    } catch (e) {
        showMessage('urlResult', 'Error encoding URL', 'error');
    }
}

function decodeURL() {
    const input = document.getElementById('urlInput').value;
    try {
        const decoded = decodeURIComponent(input);
        document.getElementById('urlResult').innerHTML = `<pre>${decoded}</pre>`;
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
    
    document.getElementById('caseResult').innerHTML = `<pre>${result}</pre>`;
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
    
    document.getElementById('loremResult').innerHTML = `<pre>${result}</pre>`;
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
    
    document.getElementById('robotsResult').innerHTML = `<pre>${robotsTxt}</pre>`;
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
    document.getElementById('htmlResult').innerHTML = `<pre>${encoded}</pre>`;
}

function decodeHTML() {
    const input = document.getElementById('htmlInput').value;
    const decoded = input
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");
    document.getElementById('htmlResult').innerHTML = `<pre>${decoded}</pre>`;
}

// Base64 Encoder/Decoder
function encodeBase64() {
    const input = document.getElementById('base64Input').value;
    try {
        // Use TextEncoder for proper UTF-8 encoding
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const binary = String.fromCharCode(...data);
        const encoded = btoa(binary);
        document.getElementById('base64Result').innerHTML = `<pre>${encoded}</pre>`;
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
        document.getElementById('base64Result').innerHTML = `<pre>${decoded}</pre>`;
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
        document.getElementById('jsonResult').innerHTML = `<pre>${formatted}</pre>`;
    } catch (e) {
        showMessage('jsonResult', 'Invalid JSON: ' + e.message, 'error');
    }
}

function minifyJSON() {
    const input = document.getElementById('jsonInput').value;
    try {
        const parsed = JSON.parse(input);
        const minified = JSON.stringify(parsed);
        document.getElementById('jsonResult').innerHTML = `<pre>${minified}</pre>`;
    } catch (e) {
        showMessage('jsonResult', 'Invalid JSON: ' + e.message, 'error');
    }
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
    
    element.innerHTML = `
        <div class="${messageClass}">
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        </div>
    `;
    
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
