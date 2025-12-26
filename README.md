# RustReflex 🦀

A Progressive Web App (PWA) designed like a flashcard dojo for mastering Rust programming through interactive code debugging challenges.

## 🎯 Overview

RustReflex transforms the frustrating process of learning Rust errors into an engaging, gamified experience. Train your brain to spot compiler errors, predict program output, and fix syntax issues under time pressure.

## 🚀 Features

### Three Training Modes:
- **The Compiler** - Spot the Error: Identify exactly why code won't compile
- **The Oracle** - Predict the Output: Guess what the program will print or if it will panic
- **The Mechanic** - Fix the Syntax: Select the correct syntax to make broken code work

### Core Functionality:
- 📱 **Offline-First PWA**: Works completely offline after initial load
- 🎮 **Gamification**: Streak tracking, mastery scores, and speed run mode
- 📊 **Smart Sync**: Timestamp-based updates for fresh content
- 🎨 **Syntax Highlighting**: Beautiful Rust code with Prism.js
- 💾 **Local Storage**: IndexedDB for persistent data

## 🏆 Gamification Elements

- **Streak Protection**: Maintain daily practice streaks
- **Mastery Scores**: Track progress across difficulty levels (Basics, Ownership, Advanced)
- **Speed Run Mode**: Challenge yourself with timed sessions
- **Adaptive Learning**: Focus on your weakest areas

## 🛠️ Technical Architecture

### Frontend Stack:
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with custom properties
- **JavaScript**: Vanilla JS for maximum performance
- **Prism.js**: Syntax highlighting for Rust code
- **PWA**: Service Worker + Cache API + Manifest

### Data Storage:
- **IndexedDB**: Local browser database for questions
- **JSON**: Question data format with versioning
- **Smart Sync**: Timestamp-based delta updates

## 📁 Project Structure

```
RustReflex/
├── index.html          # Main application entry point
├── styles.css          # Custom styling
├── script.js           # Core application logic
├── sw.js              # Service Worker for offline
├── manifest.json      # PWA manifest configuration
├── data/
│   └── questions.json # Question database
└── assets/
    └── icons/         # PWA icons
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for initial setup and sync

### Installation
1. Clone the repository:
```bash
git clone git@github.com:DieHard073055/RustReflex.git
```

2. Open `index.html` in your browser

### Usage
1. Select a training mode from the main screen
2. Answer the questions to test your Rust knowledge
3. Track your progress with streaks and mastery scores
4. Use the Sync button to get fresh questions (when online)

## 📊 Question Data Format

Each question follows this JSON structure:
```json
{
  "id": "rust_001",
  "version": 2,
  "difficulty": "Hard",
  "category": "Ownership",
  "date_added": "2023-10-27T10:00:00Z",
  "code_snippet": [
    "fn main() {",
    "  let s1 = String::from(\"hello\");",
    "  let s2 = s1;",
    "  println!(\"{}\", s1);",
    "}"
  ],
  "question_type": "spot_error",
  "correct_line_index": 3,
  "explanation": "s1 was moved to s2. s1 is no longer valid.",
  "choices": [
    "Line 2: String::from is deprecated",
    "Line 3: s2 cannot be created", 
    "Line 4: Use of moved value: s1",
    "Line 4: Format string requires argument"
  ]
}
```

## 🎨 Customization

### Adding Questions
1. Add new entries to `data/questions.json`
2. Each question should have:
   - Unique ID
   - Version number
   - Difficulty level
   - Category
   - Code snippet (array of strings)
   - Question type
   - Correct answer(s)
   - Explanations and choices

### Styling
Customize the appearance in `styles.css`:
- Theme colors
- Layout adjustments
- Animations and transitions
- Responsive design

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request with:
- New questions and categories
- Bug fixes
- Feature enhancements
- Documentation improvements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Prism.js](https://prismjs.com/) - Syntax highlighting
- [PWA Guidelines](https://web.dev/progressive-web-apps/) - PWA best practices
- The Rust community for inspiration

## 🚀 Deployment

This project is designed to be hosted on GitHub Pages. Simply push to your repository and enable GitHub Pages in the settings.

---

**Master Rust with RustReflex - Train your brain, not just your memory!**
