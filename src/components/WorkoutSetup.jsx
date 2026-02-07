import React from 'react';
import './WorkoutSetup.css';


import { useState } from 'react';

function WorkoutSetup({ workout, onChange, onSave }) {
  // For backward compatibility, initialize intervals if not present
  const initialIntervals = workout.intervals && Array.isArray(workout.intervals)
    ? workout.intervals
    : [
        { label: 'Run', duration: 120 },
        { label: 'Strength', duration: 45 },
      ];
  const [intervals, setIntervals] = useState(initialIntervals);

  const handleChange = (field, value) => {
    if (field === 'intervals') {
      setIntervals(value);
      onChange({ ...workout, intervals: value });
    } else {
      onChange({ ...workout, [field]: value, intervals });
    }
  };

  const handleIntervalChange = (idx, key, value) => {
    const updated = intervals.map((interval, i) =>
      i === idx ? { ...interval, [key]: value } : interval
    );
    handleChange('intervals', updated);
  };

  const handleAddInterval = () => {
    const updated = [...intervals, { label: '', duration: 60 }];
    handleChange('intervals', updated);
  };

  const handleRemoveInterval = (idx) => {
    if (intervals.length <= 1) return;
    const updated = intervals.filter((_, i) => i !== idx);
    handleChange('intervals', updated);
  };

  const handleMoveInterval = (idx, dir) => {
    const updated = [...intervals];
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= intervals.length) return;
    [updated[idx], updated[swapIdx]] = [updated[swapIdx], updated[idx]];
    handleChange('intervals', updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (workout.name.trim()) {
      onSave({ ...workout, intervals });
      alert('Workout saved successfully!');
    } else {
      alert('Please enter a workout name to save');
    }
  };

  return (
    <div className="workout-setup">
      <h2>⚙️ Configure Your Workout</h2>
      
      <form onSubmit={handleSubmit} className="setup-form">
        <div className="form-group">
          <label htmlFor="workoutName">Workout Name</label>
          <input
            id="workoutName"
            type="text"
            placeholder="e.g., HIIT Monday, Leg Day"
            value={workout.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="input-field"
          />
        </div>


        <div className="intervals-section">
          <label>Intervals (sequence):</label>
          {intervals.map((interval, idx) => (
            <div className="interval-row" key={idx}>
              <input
                type="text"
                placeholder="Label (e.g. Run, Strength)"
                value={interval.label}
                onChange={e => handleIntervalChange(idx, 'label', e.target.value)}
                className="input-field interval-label"
              />
              <input
                type="number"
                min="5"
                max="1800"
                value={interval.duration}
                onChange={e => handleIntervalChange(idx, 'duration', parseInt(e.target.value) || 0)}
                className="input-field interval-duration"
                style={{ width: 90 }}
              />
              <span className="interval-suffix">sec</span>
              <button type="button" className="interval-btn" onClick={() => handleMoveInterval(idx, -1)} title="Move up">↑</button>
              <button type="button" className="interval-btn" onClick={() => handleMoveInterval(idx, 1)} title="Move down">↓</button>
              <button type="button" className="interval-btn interval-remove" onClick={() => handleRemoveInterval(idx)} title="Remove">✕</button>
            </div>
          ))}
          <button type="button" className="add-interval-btn" onClick={handleAddInterval}>+ Add Interval</button>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="sets">Number of Sets (interval sequence repeats per circuit)</label>
            <input
              id="sets"
              type="number"
              min="1"
              max="50"
              value={workout.sets}
              onChange={(e) => handleChange('sets', parseInt(e.target.value) || 1)}
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="circuits">Number of Circuits</label>
            <input
              id="circuits"
              type="number"
              min="1"
              max="20"
              value={workout.circuits}
              onChange={(e) => handleChange('circuits', parseInt(e.target.value) || 1)}
              className="input-field"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="restBetweenCircuits">Rest Between Circuits (seconds)</label>
          <input
            id="restBetweenCircuits"
            type="number"
            min="0"
            max="600"
            value={workout.restBetweenCircuits}
            onChange={(e) => handleChange('restBetweenCircuits', parseInt(e.target.value) || 0)}
            className="input-field"
          />
        </div>


        <div className="workout-summary">
          <h3>📊 Workout Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Intervals per Set:</span>
              <span className="summary-value">{intervals.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Sets:</span>
              <span className="summary-value">{workout.sets * workout.circuits}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Interval Time:</span>
              <span className="summary-value">
                {Math.floor((intervals.reduce((sum, i) => sum + i.duration, 0) * workout.sets * workout.circuits) / 60)}m {((intervals.reduce((sum, i) => sum + i.duration, 0) * workout.sets * workout.circuits) % 60)}s
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Estimated Duration:</span>
              <span className="summary-value">
                {Math.floor((
                  intervals.reduce((sum, i) => sum + i.duration, 0) * workout.sets * workout.circuits +
                  workout.restBetweenCircuits * (workout.circuits - 1)
                ) / 60)}m
              </span>
            </div>
          </div>
        </div>

        <button type="submit" className="save-button">
          💾 Save Workout Preset
        </button>
      </form>
    </div>
  );
}

export default WorkoutSetup;
