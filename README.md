# Party Game Splash

A clean, mobile-responsive website featuring a slideshow of party games with navigation to different game windows.

## Features

- **Responsive Design**: Works great on desktop, tablet, and mobile devices
- **Interactive Slideshow**: Smooth transitions between game options
- **Touch Support**: Swipe gestures for mobile navigation
- **Confirmation Modal**: Click "Play Now" to see a confirmation popup before starting games
- **Direct Navigation**: Games open in the same window, replacing the main page
- **Auto-advance**: Slideshow automatically advances every 5 seconds
- **Keyboard Navigation**: Use arrow keys to navigate slides, ESC to close modal

## Games Included

1. **Trivia Night** - Test your knowledge with friends
2. **Charades** - Act it out and guess the word
3. **Word Association** - Connect words in creative ways
4. **Pictionary** - Draw and guess together

## How to Use

1. Open `index.html` in your web browser
2. Navigate through the slides using:
   - Arrow buttons (‹ ›)
   - Dot indicators
   - Arrow keys on keyboard
   - Swipe gestures on mobile
3. Click on any slide or "Play Now" button to see a confirmation popup
4. Choose "Play" to start the game or "Cancel" to go back
5. Games open in the same window, replacing the main page
6. Use "Back to Menu" button in games to return to the main slideshow

## Game Windows

Each game opens in the same browser window with its own HTML and JavaScript:

### Trivia Night (`games/trivia.html`)
- Multiple choice questions
- Score tracking
- Progressive difficulty

### Charades (`games/charades.html`)
- Word display for acting
- Timer countdown
- Category-based words

### Word Association (`games/word-association.html`)
- Chain word associations
- Real-time input
- Timer-based rounds

### Pictionary (`games/pictionary.html`)
- Drawing canvas
- Color picker
- Word prompts

## Files

- `index.html` - Main HTML structure with confirmation modal
- `styles.css` - Responsive CSS styling including modal styles
- `script.js` - JavaScript functionality for slideshow and modal management
- `games/` - Directory containing individual game files
  - `trivia.html` - Trivia Night game
  - `charades.html` - Charades game
  - `word-association.html` - Word Association game
  - `pictionary.html` - Pictionary game

## Mobile Features

- Touch-friendly interface
- Swipe gestures for navigation
- Responsive design that adapts to screen size
- Optimized for mobile performance
- Modal works great on mobile devices

## Browser Compatibility

Works on all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

## Navigation Flow

1. **Main Slideshow** → Click "Play Now" or slide
2. **Confirmation Modal** → Choose "Play" or "Cancel"
3. **Game Page** → Play the game
4. **Back to Menu** → Return to main slideshow
