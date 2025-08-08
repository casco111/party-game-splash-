document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const slideBtns = document.querySelectorAll('.slide-btn');
    const modal = document.getElementById('confirmationModal');
    const confirmBtn = document.getElementById('confirmPlay');
    const cancelBtn = document.getElementById('cancelPlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    let selectedGame = null;
    
    // Game configurations
    const gameConfigs = {
        game1: {
            title: 'Trivia Night',
            description: 'Test your knowledge with friends in this exciting quiz game!',
            url: 'games/trivia.html'
        },
        game2: {
            title: 'Wer hat die Bombe?',
            description: 'Finde Begriffe, um nicht zu explodieren!',
            url: 'games/bomb.html'
        },
        game3: {
            title: 'Word Association',
            description: 'Connect words in creative and unexpected ways!',
            url: 'games/word-association.html'
        },
        game4: {
            title: 'Pictionary',
            description: 'Draw and guess together in this classic drawing game!',
            url: 'games/pictionary.html'
        }
    };
    
    // Initialize slideshow
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show current slide
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlide = index;
    }
    
    // Next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }
    
    // Previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }
    
    // Show confirmation modal
    function showConfirmationModal(gamePage) {
        const config = gameConfigs[gamePage];
        if (config) {
            selectedGame = gamePage;
            modalTitle.textContent = config.title;
            modalDescription.textContent = config.description;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Hide confirmation modal
    function hideConfirmationModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        selectedGame = null;
    }
    
    // Navigate to game
    function navigateToGame() {
        if (selectedGame) {
            const config = gameConfigs[selectedGame];
            if (config) {
                window.location.href = config.url;
            }
        }
    }
    
    // Event listeners for navigation buttons
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // Event listeners for slide buttons (Play Now buttons)
    slideBtns.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const slide = slides[currentSlide];
            const gamePage = slide.getAttribute('data-page');
            showConfirmationModal(gamePage);
        });
    });
    
    // Event listeners for clicking on slides
    slides.forEach((slide, index) => {
        slide.addEventListener('click', (e) => {
            // Only trigger if not clicking on the button
            if (!e.target.classList.contains('slide-btn')) {
                const gamePage = slides[currentSlide].getAttribute('data-page');
                showConfirmationModal(gamePage);
            }
        });
    });
    
    // Modal event listeners
    confirmBtn.addEventListener('click', navigateToGame);
    cancelBtn.addEventListener('click', hideConfirmationModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideConfirmationModal();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        } else if (e.key === 'Escape') {
            hideConfirmationModal();
        }
    });
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    const slideshowContainer = document.querySelector('.slideshow-container');
    
    slideshowContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    slideshowContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                prevSlide();
            }
        }
    }
    
   
    
    
    // Initialize first slide
    showSlide(0);
    
    // Add smooth transitions for better UX
    slides.forEach(slide => {
        slide.style.transition = 'opacity 0.5s ease-in-out';
    });
    
    // Add loading animation for images
    const images = document.querySelectorAll('.slide-content img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease-in-out';
    });
}); 