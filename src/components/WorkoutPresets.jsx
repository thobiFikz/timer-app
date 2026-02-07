import React from 'react';
import './WorkoutPresets.css';

function WorkoutPresets({ workouts, onLoad, onDelete }) {
  if (workouts.length === 0) {
    return null;
  }

  return (
    <div className="workout-presets">
      <h2>📁 Saved Workouts</h2>
      <div className="presets-grid">
        {workouts.map((workout) => (
          <div key={workout.id} className="preset-card">
            <div className="preset-header">
              <h3>{workout.name}</h3>
              <button
                onClick={() => onDelete(workout.id)}
                className="delete-button"
                title="Delete workout"
              >
                🗑️
              </button>
            </div>
            <div className="preset-details">
              <div className="preset-detail">
                <span className="detail-icon">⏱️</span>
                <span>{workout.workTime}s work</span>
              </div>
              <div className="preset-detail">
                <span className="detail-icon">😮‍💨</span>
                <span>{workout.restBetweenSets}s rest</span>
              </div>
              <div className="preset-detail">
                <span className="detail-icon">🔢</span>
                <span>{workout.sets} sets × {workout.circuits} circuits</span>
              </div>
              <div className="preset-detail">
                <span className="detail-icon">⏸️</span>
                <span>{workout.restBetweenCircuits}s between circuits</span>
              </div>
            </div>
            <button
              onClick={() => onLoad(workout)}
              className="load-button"
            >
              Load Workout
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkoutPresets;
