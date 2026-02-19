/* SEO Tools – Main JavaScript */

// Mobile nav toggle
document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");

    if (toggle && links) {
        toggle.addEventListener("click", function () {
            links.classList.toggle("active");
        });
    }

    // Mobile dropdown toggles
    document.querySelectorAll(".dropdown-toggle").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            var parent = btn.closest(".dropdown");
            if (parent) {
                parent.classList.toggle("open");
            }
        });
    });
});

// Copy code to clipboard
function copyCode(button) {
    var codeBlock = button.parentElement.querySelector("code");
    if (!codeBlock) return;

    var text = codeBlock.textContent;
    navigator.clipboard.writeText(text).then(function () {
        var original = button.textContent;
        button.textContent = "Copied!";
        setTimeout(function () {
            button.textContent = original;
        }, 2000);
    });
}
