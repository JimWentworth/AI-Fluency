// 1. Handle Copy-to-Clipboard functionality
document.querySelectorAll('.btn-copy').forEach(button => {
    button.addEventListener('click', () => {
        const textToCopy = button.parentElement.innerText.replace('Copy', '').trim();
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = button.innerText;
            button.innerText = 'Copied!';
            button.style.backgroundColor = '#FF5F05'; // Illini Orange
            setTimeout(() => {
                button.innerText = originalText;
                button.style.backgroundColor = '#13294B'; // Illini Blue
            }, 2000);
        });
    });
});

// 2. Add Accessibility "Skip to Content" dynamically if not present
const skipLink = document.createElement('a');
skipLink.href = '#main-content';
skipLink.innerText = 'Skip to main content';
skipLink.className = 'skip-link';
document.body.prepend(skipLink);