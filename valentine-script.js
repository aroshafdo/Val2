// Image data with dates
const imageData = [
    { name: "IMG_20220303_151435.jpg", size: "2.45MB", date: "March 3, 2022" },
    { name: "IMG_20221028_130717.jpg", size: "3.28MB", date: "October 28, 2022" },
    { name: "PXL_20240129_113918290.MP.jpg", size: "2.46MB", date: "January 29, 2024" },
    { name: "PXL_20240130_083135347.jpg", size: "3.28MB", date: "January 30, 2024" },
    { name: "PXL_20240221_073743437.jpg", size: "1.60MB", date: "February 21, 2024" },
    { name: "PXL_20241031_100948096.jpg", size: "414KB", date: "October 31, 2024" },
    { name: "PXL_20241122_044333256.jpg", size: "1.07MB", date: "November 22, 2024" },
    { name: "PXL_20241122_114350381.jpg", size: "696KB", date: "November 22, 2024" },
    { name: "PXL_20241219_044532340.jpg", size: "1.48MB", date: "December 19, 2024" },
    { name: "PXL_20250509_093525388.jpg", size: "1.61MB", date: "May 9, 2025" },
    { name: "PXL_20250822_095021342.jpg", size: "1.15MB", date: "August 22, 2025" },
    { name: "PXL_20250825_090215175.jpg", size: "2.31MB", date: "August 25, 2025" },
    { name: "PXL_20250912_114828789.jpg", size: "1.50MB", date: "September 12, 2025" },
    { name: "PXL_20250916_030219580.jpg", size: "1.60MB", date: "September 16, 2025" },
    { name: "PXL_20250916_030233200.jpg", size: "2.16MB", date: "September 16, 2025" },
    { name: "PXL_20250922_112223361.jpg", size: "2.30MB", date: "September 22, 2025" },
    { name: "PXL_20250922_112324679.jpg", size: "2.30MB", date: "September 22, 2025" },
    { name: "PXL_20251108_102233915.jpg", size: "1.33MB", date: "November 8, 2025" },
    { name: "PXL_20251215_085420985.jpg", size: "1.08MB", date: "December 15, 2025" },
    { name: "PXL_20260116_053850367.jpg", size: "1.30MB", date: "January 16, 2026" }
];

// Romantic quotes
const quotes = [
    "You are my today and all of my tomorrows.",
    "Every love story is beautiful, but ours is my favorite.",
    "With you, every moment feels special.",
    "You make my world brighter just by being in it.",
    "Home is wherever I'm with you.",
    "I didn't choose you, my heart did.",
    "You're my favorite notification.",
    "Forever isn't long enough with you.",
    "You're the reason behind my happiest days.",
    "I fall for you more every single day.",
    "You + Me = ❤️",
    "My heart is yours.",
    "Love you endlessly.",
    "Together is my favorite place to be.",
    "You are my always."
];

// Carousel variables
let currentIndex = 0;
let autoScrollInterval;
let touchStartX = 0;
let isDragging = false;
let startX = 0;

// DOM Elements
const carouselTrack = document.getElementById('carouselTrack');
const carouselDots = document.getElementById('carouselDots');
const carouselDate = document.getElementById('carouselDate');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const quotesContainer = document.getElementById('quotesContainer');
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalInfo = document.getElementById('modalInfo');
const modalClose = document.querySelector('.modal-close');
const modalPrev = document.querySelector('.modal-prev');
const modalNext = document.querySelector('.modal-next');

// Check if mobile
function isMobile() {
    return window.innerWidth <= 768;
}

// Initialize carousel
function initCarousel() {
    // Clear existing content
    carouselTrack.innerHTML = '';
    carouselDots.innerHTML = '';

    // Create slides
    imageData.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.setAttribute('data-index', index);

        // Create image
        const img = document.createElement('img');
        img.src = `images/${image.name}`;
        img.alt = `Memory ${index + 1}`;
        img.loading = 'lazy';

        // Handle image error
        img.onerror = function() {
            this.src = ''; // Clear src
            this.style.background = 'linear-gradient(135deg, #ffd1dc, #ff69b4)';
            this.style.objectFit = 'none';
            this.style.padding = '20px';
            this.alt = 'Image not found';
        };

        // Create overlay with date
        const overlay = document.createElement('div');
        overlay.className = 'slide-overlay';
        overlay.innerHTML = `
            <span class="slide-date">📅 ${image.date}</span>
            <span class="slide-size">📸 ${image.size}</span>
        `;

        slide.appendChild(img);
        slide.appendChild(overlay);
        carouselTrack.appendChild(slide);

        // Create dot
        const dot = document.createElement('span');
        dot.className = 'carousel-dot';
        dot.setAttribute('data-index', index);
        dot.addEventListener('click', () => goToSlide(index));
        carouselDots.appendChild(dot);
    });

    // Clone first and last for infinite effect
    const firstClone = carouselTrack.firstElementChild.cloneNode(true);
    const lastClone = carouselTrack.lastElementChild.cloneNode(true);
    firstClone.classList.add('clone');
    lastClone.classList.add('clone');
    carouselTrack.appendChild(firstClone);
    carouselTrack.insertBefore(lastClone, carouselTrack.firstElementChild);

    // Set initial position
    updateSlidePosition(1, false);
    updateDots(0);
    updateDate(0);

    // Start zoom animation
    startZoomAnimation(1);
}

// Go to specific slide
function goToSlide(index, smooth = true) {
    const slides = document.querySelectorAll('.carousel-slide');
    const slideWidth = slides[0]?.offsetWidth || 0;

    // Handle infinite loop
    if (index >= imageData.length) {
        index = 0;
    } else if (index < 0) {
        index = imageData.length - 1;
    }

    // Adjust for clones (we have one clone at the beginning)
    const adjustedIndex = index + 1;

    currentIndex = index;

    if (smooth) {
        carouselTrack.style.transition = 'transform 0.5s ease';
    } else {
        carouselTrack.style.transition = 'none';
    }

    carouselTrack.style.transform = `translateX(-${adjustedIndex * slideWidth}px)`;

    updateDots(index);
    updateDate(index);
    startZoomAnimation(adjustedIndex);
}

// Update slide position
function updateSlidePosition(index, smooth = true) {
    const slides = document.querySelectorAll('.carousel-slide');
    const slideWidth = slides[0]?.offsetWidth || 0;

    carouselTrack.style.transition = smooth ? 'transform 0.5s ease' : 'none';
    carouselTrack.style.transform = `translateX(-${index * slideWidth}px)`;
}

// Update navigation dots
function updateDots(index) {
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, i) => {
        if (i === index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Update date display
function updateDate(index) {
    if (imageData[index]) {
        carouselDate.innerHTML = `💕 ${imageData[index].date} 💕`;
    }
}

// Start zoom animation for current slide
function startZoomAnimation(slideIndex) {
    // Remove zoom classes from all slides
    document.querySelectorAll('.carousel-slide').forEach(slide => {
        slide.classList.remove('zoom-in', 'zoom-out');
    });

    // Get current slide
    const slides = document.querySelectorAll('.carousel-slide');
    const currentSlide = slides[slideIndex];

    if (currentSlide) {
        // Start zoom animation cycle
        setTimeout(() => {
            currentSlide.classList.add('zoom-in');
        }, 100);

        setTimeout(() => {
            currentSlide.classList.remove('zoom-in');
            currentSlide.classList.add('zoom-out');
        }, 3000);

        setTimeout(() => {
            currentSlide.classList.remove('zoom-out');
            currentSlide.classList.add('zoom-in');
        }, 6000);
    }
}

// Auto scroll function
function startAutoScroll() {
    stopAutoScroll();
    autoScrollInterval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % imageData.length;
        goToSlide(nextIndex);
    }, 5000);
}

function stopAutoScroll() {
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
    }
}

// Initialize quotes
function initQuotes() {
    quotesContainer.innerHTML = '';

    // Duplicate quotes for smooth scrolling
    const allQuotes = [...quotes, ...quotes];

    allQuotes.forEach((quote, index) => {
        const quoteItem = document.createElement('div');
        quoteItem.className = 'quote-item';

        // Add category classes
        if (index % 3 === 0) quoteItem.classList.add('sweet');
        else if (index % 3 === 1) quoteItem.classList.add('cute');
        else quoteItem.classList.add('short');

        quoteItem.textContent = quote;

        // Add random rotation for desktop
        if (!isMobile()) {
            const rotation = Math.random() * 4 - 2;
            quoteItem.style.transform = `rotate(${rotation}deg)`;
        }

        quotesContainer.appendChild(quoteItem);
    });
}

// Touch events for mobile
function setupTouchEvents() {
    carouselTrack.addEventListener('touchstart', (e) => {
        stopAutoScroll();
        touchStartX = e.touches[0].clientX;
        isDragging = true;
        carouselTrack.style.transition = 'none';
    }, { passive: true });

    carouselTrack.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();

        const currentX = e.touches[0].clientX;
        const diff = currentX - touchStartX;

        const slides = document.querySelectorAll('.carousel-slide');
        const slideWidth = slides[0]?.offsetWidth || 0;
        const currentTranslate = -((currentIndex + 1) * slideWidth) + diff;

        carouselTrack.style.transform = `translateX(${currentTranslate}px)`;
    }, { passive: false });

    carouselTrack.addEventListener('touchend', (e) => {
        if (!isDragging) return;

        const diff = e.changedTouches[0].clientX - touchStartX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                // Swipe right - previous
                goToSlide(currentIndex - 1);
            } else {
                // Swipe left - next
                goToSlide(currentIndex + 1);
            }
        } else {
            // Just a tap, stay on current slide
            goToSlide(currentIndex);
        }

        isDragging = false;
        startAutoScroll();
    });

    // Mouse events for desktop
    carouselTrack.addEventListener('mousedown', (e) => {
        stopAutoScroll();
        startX = e.clientX;
        isDragging = true;
        carouselTrack.style.transition = 'none';
        carouselTrack.style.cursor = 'grabbing';
        e.preventDefault();
    });

    carouselTrack.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();

        const currentX = e.clientX;
        const diff = currentX - startX;

        const slides = document.querySelectorAll('.carousel-slide');
        const slideWidth = slides[0]?.offsetWidth || 0;
        const currentTranslate = -((currentIndex + 1) * slideWidth) + diff;

        carouselTrack.style.transform = `translateX(${currentTranslate}px)`;
    });

    carouselTrack.addEventListener('mouseup', (e) => {
        if (!isDragging) return;

        const diff = e.clientX - startX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                goToSlide(currentIndex - 1);
            } else {
                goToSlide(currentIndex + 1);
            }
        } else {
            goToSlide(currentIndex);
        }

        isDragging = false;
        carouselTrack.style.cursor = 'grab';
        startAutoScroll();
    });

    carouselTrack.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            carouselTrack.style.cursor = 'grab';
            goToSlide(currentIndex);
            startAutoScroll();
        }
    });
}

// Click on slide to view full image
carouselTrack.addEventListener('click', (e) => {
    if (!isDragging) {
        const slide = e.target.closest('.carousel-slide');
        if (slide && !slide.classList.contains('clone')) {
            const index = parseInt(slide.getAttribute('data-index') || '0');
            showFullImage(index);
        }
    }
});

// Show full image in modal
function showFullImage(index) {
    const image = imageData[index];
    if (!image) return;

    modalImage.src = `images/${image.name}`;
    modalInfo.innerHTML = `
        <span>📅 ${image.date}</span>
        <span>📸 ${image.size}</span>
    `;
    modal.classList.add('show');

    // Set current modal index
    modal.setAttribute('data-current-index', index);
}

// Modal navigation
modalPrev.addEventListener('click', () => {
    const currentIndex = parseInt(modal.getAttribute('data-current-index') || '0');
    const newIndex = (currentIndex - 1 + imageData.length) % imageData.length;
    modal.setAttribute('data-current-index', newIndex);
    modalImage.src = `images/${imageData[newIndex].name}`;
    modalInfo.innerHTML = `
        <span>📅 ${imageData[newIndex].date}</span>
        <span>📸 ${imageData[newIndex].size}</span>
    `;
});

modalNext.addEventListener('click', () => {
    const currentIndex = parseInt(modal.getAttribute('data-current-index') || '0');
    const newIndex = (currentIndex + 1) % imageData.length;
    modal.setAttribute('data-current-index', newIndex);
    modalImage.src = `images/${imageData[newIndex].name}`;
    modalInfo.innerHTML = `
        <span>📅 ${imageData[newIndex].date}</span>
        <span>📸 ${imageData[newIndex].size}</span>
    `;
});

// Close modal
modalClose.addEventListener('click', () => {
    modal.classList.remove('show');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});

// Navigation buttons
prevBtn.addEventListener('click', () => {
    stopAutoScroll();
    goToSlide(currentIndex - 1);
    startAutoScroll();
});

nextBtn.addEventListener('click', () => {
    stopAutoScroll();
    goToSlide(currentIndex + 1);
    startAutoScroll();
});

// Create floating hearts
function createFloatingHearts() {
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = ['❤️', '💖', '💕', '💗', '💓', '💘', '💝'][Math.floor(Math.random() * 7)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = Math.random() * 30 + 10 + 'px';
        heart.style.setProperty('--duration', Math.random() * 4 + 3 + 's');
        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 7000);
    }, 300);
}

// Handle window resize
window.addEventListener('resize', () => {
    goToSlide(currentIndex, false);

    // Reinitialize quotes for mobile/desktop
    initQuotes();
});

// Initialize everything
window.addEventListener('load', () => {
    initCarousel();
    initQuotes();
    setupTouchEvents();
    createFloatingHearts();

    // Start auto-scroll after 2 seconds
    setTimeout(() => {
        startAutoScroll();
    }, 2000);

    // Initial hearts burst
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.innerHTML = ['❤️', '💖', '💕'][Math.floor(Math.random() * 3)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.top = Math.random() * 100 + '%';
            heart.style.fontSize = '25px';
            heart.style.setProperty('--duration', '3s');
            document.body.appendChild(heart);

            setTimeout(() => heart.remove(), 3000);
        }, i * 200);
    }
});

// Pause animations when not visible for better performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopAutoScroll();
    } else {
        startAutoScroll();
    }
});