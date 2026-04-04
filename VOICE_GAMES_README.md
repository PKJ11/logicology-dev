# Voice Games System Documentation

## Overview

The Voice Games system includes two interactive, voice-based games designed to make learning math engaging and fun. Players can speak their answers, which are automatically transcribed and validated.

## Games Included

### 1. **Digit Sum Game** 🎤➕
- **Purpose**: Practice addition by summing multiple numbers
- **Mechanics**: Listen to numbers, calculate the sum, and speak your answer
- **Difficulty Levels**:
  - Easy: Add 2 numbers (1-10)
  - Medium: Add 2 numbers (1-100)
  - Hard: Add 3 numbers (1-100)

### 2. **Table Challenge** 🎤✖️
- **Purpose**: Master multiplication tables through voice interaction
- **Mechanics**: Hear multiplication problems, solve them mentally, and speak the answer
- **Difficulty Levels**:
  - Easy: Tables 1-5 × 1-5
  - Medium: Tables 1-10 × 1-10
  - Hard: Tables 1-20 × 1-20

## Game Modes

### Normal Mode 🎮
- Unlimited time to answer each question
- Focus on accuracy
- Perfect for learning and practice

### Speed Mode ⚡
- 30-second timer per question
- Bonus points awarded for speed
- Increases difficulty and engagement
- Timer displayed during gameplay

## Features

### Voice Recognition
- **Browser Support**: Chrome, Edge, Safari (uses Web Speech API)
- **Automatic Transcription**: Speech-to-text conversion in real-time
- **Natural Language Understanding**: Converts spoken numbers to digits
  - Supports word-form numbers (e.g., "twenty-three" → 23)
  - Supports digit-form numbers (e.g., "100")

### Scoring System
- **Base Points**:
  - Easy: 10 points per correct answer
  - Medium: 15 points per correct answer
  - Hard: 20 points per correct answer
- **Speed Bonus**: Extra points for quick correct answers in speed mode
- **Streak Tracking**: Consecutive correct answers with motivational messages

### Game Statistics
Real-time tracking of:
- Current Score
- Streak Counter (consecutive correct answers)
- Total Correct Answers
- Total Attempts
- Accuracy Percentage
- Game Duration

### Feedback System
- **Correct Answer**: Green feedback with points earned and streak message
- **Wrong Answer**: Red feedback showing the correct answer and spoken confirmation
- **Voice Feedback**: Text-to-speech confirmation of answers
- **Streak Messages**: Motivational messages at 1, 3, 5, 10+ streak milestones

## Project Structure

```
app/voice-games/
├── page.tsx                    # Main hub/landing page
├── digit-sum/
│   └── page.tsx               # Digit Sum Game page
├── table-challenge/
│   └── page.tsx               # Table Challenge page
└── lib/
    ├── types.ts               # TypeScript interfaces
    ├── voiceUtils.ts          # Speech recognition utilities
    └── gameLogic.ts           # Game logic & question generation

components/voice-games/
├── VoiceInput.tsx             # Reusable voice input component
├── DigitSumGame.tsx           # Digit Sum game component
└── TableChallenge.tsx         # Table Challenge game component
```

## Key Files & Their Responsibilities

### 1. **lib/types.ts**
Defines TypeScript interfaces:
- `Difficulty`: Game difficulty levels
- `GameMode`: Normal or Speed mode
- `GameStats`: Player statistics tracking
- `VoiceGameState`: Voice input state management
- `GameQuestion`: Question structure

### 2. **lib/voiceUtils.ts**
Voice recognition functionality:
- `startVoiceListening()`: Initiates speech recognition
- `extractNumberFromTranscript()`: Converts speech to number
- `isBrowserSupported()`: Checks browser compatibility
- `speakText()`: Text-to-speech output
- `parseAnswer()`: Parses complex number expressions

### 3. **lib/gameLogic.ts**
Game mechanics:
- `generateDigitSumQuestion()`: Creates random addition problems
- `generateTableQuestion()`: Creates random multiplication problems
- `validateAnswer()`: Checks if answer is correct
- `calculateScore()`: Computes points earned
- `getStreakMessage()`: Returns motivational messages
- `getDifficultyLabel()`: Formats difficulty names

### 4. **components/VoiceInput.tsx**
Reusable voice input component:
- Displays microphone button with status feedback
- Shows transcribed text to user
- Handles browser compatibility warnings
- 10-second auto-stop timeout
- Error handling and user-friendly messages

### 5. **components/DigitSumGame.tsx** & **components/TableChallenge.tsx**
Main game components:
- State management for questions, stats, and feedback
- Game flow control (setup → playing → finish)
- Speed mode timer integration
- Score calculation and streak tracking
- UI for displaying questions and feedback
- Play again functionality

## How to Play

### Step 1: Select Game
Visit `/voice-games` and choose between:
- Digit Sum Game
- Table Challenge

### Step 2: Configure Settings
- **Choose Difficulty**: Easy, Medium, or Hard
- **Select Mode**: Normal or Speed

### Step 3: Play
1. Read the displayed question (or click speaker icon to hear it)
2. Calculate the answer mentally
3. Click microphone and speak your answer clearly
4. View instant feedback
5. Proceed to next question automatically or manually

### Step 4: Review Results
When game ends (speed mode) or manually:
- View final score
- See accuracy percentage
- Check best streak
- Option to play again

## Browser Requirements

- **Supported Browsers**: Chrome, Edge, Safari
- **Required**: Microphone access permission
- **Optional but Recommended**: Speaker/Headphones for audio feedback

## Browser Compatibility Notes

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome/Chromium | ✅ Full | Full Speech Recognition API support |
| Edge | ✅ Full | Full Speech Recognition API support |
| Safari | ✅ Full | Full Speech Recognition API support |
| Firefox | ❌ Limited | No native Web Speech API support |

## Customization Guide

### Adding New Difficulty Levels
Edit `lib/gameLogic.ts`:
```typescript
export const generateDigitSumQuestion = (difficulty: Difficulty): GameQuestion => {
  // Add new case for difficulty level
  if (difficulty === "expert") {
    min = 10;
    max = 1000;
    count = 5;
  }
  // ...
}
```

### Adjusting Speed Mode Time
Edit the game component (e.g., `DigitSumGame.tsx`):
```typescript
setTimeLeft(60); // Change from 30 to 60 seconds
```

### Modifying Scoring
Edit `lib/gameLogic.ts`:
```typescript
export const calculateScore = (
  difficulty: Difficulty,
  timeSpent: number,
  speedMode: boolean
): number => {
  // Adjust base scores or bonus logic
}
```

### Adding New Games
1. Create game logic in `lib/gameLogic.ts`
2. Create game component in `components/voice-games/`
3. Create page in `app/voice-games/[game-name]/`
4. Add to hub page in `app/voice-games/page.tsx`

## Performance Considerations

- **Speech Recognition**: Runs in browser (no server calls)
- **Lightweight**: Minimal dependencies, optimized for quick load
- **Offline Capable**: Works with cached Speech Recognition API
- **Mobile Friendly**: Responsive design works on all screen sizes

## Accessibility Features

- ✅ Voice alternative to typing
- ✅ Visual and text feedback
- ✅ Speaker icon for audio questions (optional)
- ✅ Clear color contrast
- ✅ Readable large fonts
- ✅ Keyboard accessible buttons

## Troubleshooting

### "Speech Recognition not supported"
- Use Chrome, Edge, or Safari
- Check microphone is connected and permissions granted
- Ensure browser is updated

### Answers not being recognized
- Speak clearly and at normal pace
- Ensure quiet environment
- Try speaking individual digits (e.g., "one hundred five" instead of "105")

### Slow performance
- Close other browser tabs
- Check internet connection (for loading assets)
- Clear browser cache

### Timer not counting down (Speed Mode)
- Check if JavaScript is enabled
- Try refreshing the page
- Clear browser cache

## Future Enhancements

- [ ] Leaderboard system
- [ ] Achievement badges
- [ ] Multiple languages support
- [ ] Custom difficulty settings
- [ ] Word problems
- [ ] Fraction and decimal operations
- [ ] Mobile app version
- [ ] Data export/statistics

## Contributing

To add features or fix bugs:
1. Follow the existing code structure
2. Update types in `lib/types.ts` if needed
3. Add game logic to appropriate utils
4. Update components
5. Test with multiple browsers

## Support

For issues or feature requests, please refer to the main project documentation.
