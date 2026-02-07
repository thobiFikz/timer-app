# 💪 Workout Timer App

A customizable workout timer app that helps you maintain consistency during exercise by timing your sets, circuits, and rest periods.

## 🎯 Features

- **Customizable Workouts**: Set work time, rest between sets, rest between circuits
- **Multiple Circuits**: Configure number of sets and circuits for your workout
- **Save Workout Presets**: Save different workout configurations for different days
- **Visual Timer**: Large, easy-to-read countdown timer with progress indicators
- **Audio Alerts**: Beep notifications when transitioning between work/rest periods
- **Pause & Resume**: Control your workout with pause/resume functionality
- **Progress Tracking**: See your current circuit, set, and overall progress
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

## 📱 How to Use

### Setting Up a Workout

1. **Configure Your Workout**:
   - Enter a workout name (e.g., "HIIT Monday", "Leg Day")
   - Set work time in seconds (how long each exercise lasts)
   - Set rest between sets (recovery time between exercises)
   - Set number of sets (exercises in one circuit)
   - Set number of circuits (how many times to repeat)
   - Set rest between circuits (longer break between circuit rounds)

2. **Save Your Workout** (Optional):
   - Click "Save Workout Preset" to save your configuration
   - Load saved workouts anytime from the "Saved Workouts" section

3. **Start Your Workout**:
   - Click "Start Workout" to begin
   - The timer will guide you through work periods, set rests, and circuit rests
   - Audio beeps signal transitions between phases

### During Workout

- **Pause/Resume**: Click the pause button to take a break
- **Reset**: End the current workout and return to setup
- **Visual Indicators**: 
  - Green = Work period
  - Yellow = Rest between sets
  - Blue = Rest between circuits

## 🎨 Workout Examples

### HIIT Training
- Work Time: 45 seconds
- Rest Between Sets: 15 seconds
- Sets: 10
- Circuits: 3
- Rest Between Circuits: 90 seconds

### Strength Training
- Work Time: 60 seconds
- Rest Between Sets: 30 seconds
- Sets: 8
- Circuits: 4
- Rest Between Circuits: 120 seconds

### Tabata
- Work Time: 20 seconds
- Rest Between Sets: 10 seconds
- Sets: 8
- Circuits: 1
- Rest Between Circuits: 0 seconds

## 🛠️ Built With

- React 18
- Vite
- CSS3
- Web Audio API (for sound notifications)
- LocalStorage (for saving workouts)

## 📦 Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## 🤝 Contributing

Feel free to fork this project and customize it for your needs!

## 📄 License

This project is open source and available for personal use.

---

Stay consistent, track your progress, and crush your workouts! 💪
