import React, { useEffect, useState } from 'react';
import './TimerDisplay.css';


function TimerDisplay({ timerState, workout, isPaused, onPause, onReset }) {
  const { currentSet, currentCircuit, intervalIdx, timeRemaining, intervalLabel, inRestBetweenCircuits } = timerState;
  const [progress, setProgress] = useState(0);

  // Get intervals array
  const getIntervals = () => workout.intervals && workout.intervals.length > 0
    ? workout.intervals
    : [{ label: 'Work', duration: workout.workTime || 45 }, { label: 'Rest', duration: workout.restBetweenSets || 15 }];

  useEffect(() => {
    let total;
    if (inRestBetweenCircuits) {
      total = workout.restBetweenCircuits || 60;
    } else {
      const intervals = getIntervals();
      total = intervals[intervalIdx] ? intervals[intervalIdx].duration : 1;
    }
    setProgress(((total - timeRemaining) / total) * 100);
  }, [timeRemaining, intervalIdx, inRestBetweenCircuits, workout]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Color and label for current interval
  const getPhaseInfo = () => {
    if (inRestBetweenCircuits) {
      return {
        label: '⏸️ REST BETWEEN CIRCUITS',
        color: '#60a5fa',
        backgroundColor: 'rgba(96, 165, 250, 0.1)',
      };
    }
    const intervals = getIntervals();
    const interval = intervals[intervalIdx] || {};
    // Color by label (basic mapping)
    let color = '#4ade80';
    let bg = 'rgba(74, 222, 128, 0.1)';
    if (/rest/i.test(interval.label)) {
      color = '#fbbf24';
      bg = 'rgba(251, 191, 36, 0.1)';
    } else if (/run/i.test(interval.label)) {
      color = '#60a5fa';
      bg = 'rgba(96, 165, 250, 0.1)';
    } else if (/strength|lift|push|pull/i.test(interval.label)) {
      color = '#a78bfa';
      bg = 'rgba(167, 139, 250, 0.1)';
    }
    return {
      label: interval.label ? `⏱️ ${interval.label.toUpperCase()}` : '⏱️ INTERVAL',
      color,
      backgroundColor: bg,
    };
  };

  const phaseInfo = getPhaseInfo();
  const totalSets = workout.sets * workout.circuits;
  const completedSets = (currentCircuit - 1) * workout.sets + (currentSet - 1);

  return (
    <div className="timer-display" style={{ backgroundColor: phaseInfo.backgroundColor }}>
      <div className="timer-header">
        <div className="phase-indicator" style={{ color: phaseInfo.color }}>
          {phaseInfo.label}
        </div>
        {!inRestBetweenCircuits && (
          <div className="interval-label" style={{ color: '#fff', fontWeight: 500, fontSize: '1.1rem', marginLeft: 12 }}>
            {intervalLabel}
          </div>
        )}
        {isPaused && <div className="paused-indicator">⏸️ PAUSED</div>}
      </div>

      <div className="timer-main">
        <div className="timer-circle" style={{ borderColor: phaseInfo.color }}>
          <svg className="progress-ring" width="300" height="300">
            <circle
              className="progress-ring-circle-bg"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="12"
              fill="transparent"
              r="140"
              cx="150"
              cy="150"
            />
            <circle
              className="progress-ring-circle"
              stroke={phaseInfo.color}
              strokeWidth="12"
              fill="transparent"
              r="140"
              cx="150"
              cy="150"
              style={{
                strokeDasharray: `${2 * Math.PI * 140}`,
                strokeDashoffset: `${2 * Math.PI * 140 * (1 - progress / 100)}`,
                transition: 'stroke-dashoffset 0.5s linear',
              }}
            />
          </svg>
          <div className="timer-content">
            <div className="time-remaining">{formatTime(timeRemaining)}</div>
            {!inRestBetweenCircuits && (
              <div style={{ fontSize: '1.1rem', color: '#aaa', marginTop: 8 }}>
                Interval {intervalIdx + 1} / {getIntervals().length}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="timer-info">
        <div className="info-card">
          <div className="info-label">Circuit</div>
          <div className="info-value">
            {currentCircuit} / {workout.circuits}
          </div>
        </div>
        <div className="info-card">
          <div className="info-label">Set</div>
          <div className="info-value">
            {currentSet} / {workout.sets}
          </div>
        </div>
        <div className="info-card">
          <div className="info-label">Total Progress</div>
          <div className="info-value">
            {completedSets} / {totalSets}
          </div>
        </div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar-label">Overall Progress</div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{
              width: `${(completedSets / totalSets) * 100}%`,
              backgroundColor: phaseInfo.color,
            }}
          />
        </div>
      </div>

      <div className="timer-controls">
        <button onClick={onPause} className="control-button pause-button">
          {isPaused ? '▶️ Resume' : '⏸️ Pause'}
        </button>
        <button onClick={onReset} className="control-button reset-button">
          🔄 Reset
        </button>
      </div>
    </div>
  );
}

export default TimerDisplay;
