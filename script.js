document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav ul li a');
    const themeToggle = document.getElementById('theme-toggle');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const currentYearSpan = document.getElementById('current-year');

    // Set current year in footer
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Smooth Scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = document.querySelector('header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Typewriter Effect
    const nameElement = document.getElementById('typewriter-name');
    const taglineElement = document.getElementById('typewriter-tagline');
    const nameText = nameElement ? nameElement.dataset.text || nameElement.textContent : '';
    const taglineText = taglineElement ? taglineElement.dataset.text || taglineElement.textContent : '';
    
    function typeWriter(element, text, speed, callback) {
        if (!element || !text) {
            if(callback) callback();
            return;
        }
        element.innerHTML = ''; // Clear original text before typing
        element.classList.add(element.id.includes('name') ? 'typewriter-name' : 'typewriter-tagline');
        let i = 0;
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
            else {
                if(callback) callback();
            }
        }
        type();
    }

    if (nameElement) nameElement.textContent = ''; // Clear static text
    if (taglineElement) taglineElement.textContent = ''; // Clear static text

    typeWriter(nameElement, nameText, 100, () => {
        typeWriter(taglineElement, taglineText, 75);
    });

    // Dark/Light Mode Toggle
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', currentTheme);
    updateThemeToggleIcon(currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            let theme = document.body.getAttribute('data-theme');
            if (theme === 'dark') {
                theme = 'light';
            } else {
                theme = 'dark';
            }
            document.body.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            updateThemeToggleIcon(theme);
        });
    }

    function updateThemeToggleIcon(theme) {
        if (!themeToggle) return;
        if (theme === 'dark') {
            // Moon icon (default in HTML is moon, so switch to sun for light)
            themeToggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/></svg>`;
        } else {
            // Sun icon
            themeToggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/></svg>`;
        }
    }

    // Contact Form Submission
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            if (formStatus) formStatus.textContent = 'Sending...';
            contactForm.querySelector('button[type="submit"]').disabled = true;

            const formData = new FormData(contactForm);
            
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    if (formStatus) formStatus.textContent = 'Message sent successfully!';
                    contactForm.reset();
                    // Simple fade out animation for status message
                    setTimeout(() => { if(formStatus) formStatus.textContent = ''; }, 5000);
                } else {
                    const data = await response.json();
                    if (data.errors) {
                        if (formStatus) formStatus.textContent = data.errors.map(error => error.message).join(', ');
                    } else {
                        if (formStatus) formStatus.textContent = 'Oops! There was a problem submitting your form.';
                    }
                }
            } catch (error) {
                if (formStatus) formStatus.textContent = 'Oops! There was a problem submitting your form.';
                console.error('Form submission error:', error);
            }
            contactForm.querySelector('button[type="submit"]').disabled = false;
        });
    }

    // Subtle scroll animations for sections
    const sections = document.querySelectorAll('section');
    const options = {
        root: null, // viewport
        threshold: 0.1, // 10% of the item is visible
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // observer.unobserve(entry.target); // Optional: stop observing after it's visible
            }
        });
    }, options);

    sections.forEach(section => {
        section.classList.add('fade-in'); // Add class to prepare for animation
        observer.observe(section);
    });

});
