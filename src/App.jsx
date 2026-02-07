import React, { useState, useEffect, useRef } from 'react';
import WorkoutSetup from './components/WorkoutSetup';
import TimerDisplay from './components/TimerDisplay';
import WorkoutPresets from './components/WorkoutPresets';
import './App.css';

function App() {
  const [workouts, setWorkouts] = useState(() => {
    const saved = localStorage.getItem('workoutPresets');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentWorkout, setCurrentWorkout] = useState({
    name: '',
    workTime: 45,
    restBetweenSets: 15,
    restBetweenCircuits: 60,
    sets: 10,
    circuits: 3,
  });

  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timerState, setTimerState] = useState({
    currentSet: 1,
    currentCircuit: 1,
    intervalIdx: 0,
    timeRemaining: currentWorkout.intervals && currentWorkout.intervals[0] ? currentWorkout.intervals[0].duration : 45,
    intervalLabel: currentWorkout.intervals && currentWorkout.intervals[0] ? currentWorkout.intervals[0].label : 'Work',
    inRestBetweenCircuits: false,
  });

  const audioRef = useRef(null);
  const timerRef = useRef(null);

  // Save workouts to localStorage
  useEffect(() => {
    localStorage.setItem('workoutPresets', JSON.stringify(workouts));
  }, [workouts]);

  // Timer logic

  useEffect(() => {
    if (!isTimerActive || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimerState((prev) => {
        const newTimeRemaining = prev.timeRemaining - 1;
        if (newTimeRemaining <= 0) {
          playSound();
          return getNextInterval(prev);
        }
        return { ...prev, timeRemaining: newTimeRemaining };
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerActive, isPaused, currentWorkout]);

  // Helper to get intervals array
  const getIntervals = () => currentWorkout.intervals && currentWorkout.intervals.length > 0
    ? currentWorkout.intervals
    : [{ label: 'Work', duration: currentWorkout.workTime || 45 }, { label: 'Rest', duration: currentWorkout.restBetweenSets || 15 }];

  // Main interval stepping logic
  const getNextInterval = (current) => {
    const intervals = getIntervals();
    const { sets, circuits, restBetweenCircuits } = currentWorkout;
    const {
      currentSet,
      currentCircuit,
      intervalIdx,
      inRestBetweenCircuits
    } = current;

    // Handle rest between circuits
    if (inRestBetweenCircuits) {
      // After rest, move to next circuit or finish
      if (currentCircuit < circuits) {
        return {
          currentSet: 1,
          currentCircuit: currentCircuit + 1,
          intervalIdx: 0,
          timeRemaining: intervals[0].duration,
          intervalLabel: intervals[0].label,
          inRestBetweenCircuits: false,
        };
      } else {
        setIsTimerActive(false);
        playCompletionSound();
        return current;
      }
    }

    // Step to next interval in sequence
    if (intervalIdx < intervals.length - 1) {
      return {
        ...current,
        intervalIdx: intervalIdx + 1,
        timeRemaining: intervals[intervalIdx + 1].duration,
        intervalLabel: intervals[intervalIdx + 1].label,
      };
    }

    // End of interval sequence: next set or next circuit
    if (currentSet < sets) {
      // Next set, restart interval sequence
      return {
        ...current,
        currentSet: currentSet + 1,
        intervalIdx: 0,
        timeRemaining: intervals[0].duration,
        intervalLabel: intervals[0].label,
      };
    } else {
      // End of sets: rest between circuits or finish
      if (currentCircuit < circuits) {
        return {
          ...current,
          inRestBetweenCircuits: true,
          timeRemaining: restBetweenCircuits,
          intervalLabel: 'Rest Between Circuits',
        };
      } else {
        setIsTimerActive(false);
        playCompletionSound();
        return current;
      }
    }
  };

  const getNextPhase = (current) => {
    const { currentPhase, currentSet, currentCircuit } = current;
    const { sets, circuits, workTime, restBetweenSets, restBetweenCircuits } = currentWorkout;

    if (currentPhase === 'work') {
      if (currentSet < sets) {
        // Move to rest between sets
        return {
          currentPhase: 'rest',
          currentSet,
          currentCircuit,
          timeRemaining: restBetweenSets,
        };
      } else if (currentCircuit < circuits) {
        // Move to rest between circuits
        return {
          currentPhase: 'circuitRest',
          currentSet,
          currentCircuit,
          timeRemaining: restBetweenCircuits,
        };
      } else {
        // Workout complete
        setIsTimerActive(false);
        playCompletionSound();
        return current;
      }
    } else if (currentPhase === 'rest') {
      // Move to next set
      return {
        currentPhase: 'work',
        currentSet: currentSet + 1,
        currentCircuit,
        timeRemaining: workTime,
      };
    } else if (currentPhase === 'circuitRest') {
      // Move to next circuit
      return {
        currentPhase: 'work',
        currentSet: 1,
        currentCircuit: currentCircuit + 1,
        timeRemaining: workTime,
      };
    }

    return current;
  };

  const playSound = () => {
    // Create beep sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const playCompletionSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Play three ascending beeps
    [0, 0.15, 0.3].forEach((delay, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 600 + (index * 200);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + delay);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + delay + 0.2);
      
      oscillator.start(audioContext.currentTime + delay);
      oscillator.stop(audioContext.currentTime + delay + 0.2);
    });
  };


  const handleStart = () => {
    const intervals = getIntervals();
    if (!isTimerActive) {
      setTimerState({
        currentSet: 1,
        currentCircuit: 1,
        intervalIdx: 0,
        timeRemaining: intervals[0].duration,
        intervalLabel: intervals[0].label,
        inRestBetweenCircuits: false,
      });
      setIsTimerActive(true);
      setIsPaused(false);
    } else {
      setIsPaused(!isPaused);
    }
  };


  const handleReset = () => {
    const intervals = getIntervals();
    setIsTimerActive(false);
    setIsPaused(false);
    setTimerState({
      currentSet: 1,
      currentCircuit: 1,
      intervalIdx: 0,
      timeRemaining: intervals[0].duration,
      intervalLabel: intervals[0].label,
      inRestBetweenCircuits: false,
    });
  };

  const handleSaveWorkout = (workout) => {
    const newWorkout = { ...workout, id: Date.now() };
    setWorkouts([...workouts, newWorkout]);
  };

  const handleLoadWorkout = (workout) => {
    setCurrentWorkout(workout);
    handleReset();
  };

  const handleDeleteWorkout = (id) => {
    setWorkouts(workouts.filter(w => w.id !== id));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>💪 Workout Timer</h1>
        <p>Stay consistent, track your sets</p>
      </header>

      <div className="app-content">
        {!isTimerActive ? (
          <>
            <WorkoutSetup
              workout={currentWorkout}
              onChange={setCurrentWorkout}
              onSave={handleSaveWorkout}
            />
            <WorkoutPresets
              workouts={workouts}
              onLoad={handleLoadWorkout}
              onDelete={handleDeleteWorkout}
            />
          </>
        ) : (
          <TimerDisplay
            timerState={timerState}
            workout={currentWorkout}
            isPaused={isPaused}
            onPause={() => setIsPaused(!isPaused)}
            onReset={handleReset}
          />
        )}
      </div>

      {!isTimerActive && (
        <div className="start-button-container">
          <button className="start-button" onClick={handleStart}>
            Start Workout
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
