import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Exercise} from './exercise.model';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();

  private availableExercises: Exercise[] = [
    { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
  ];
  private runnningExercise: Exercise = null;
  private exercises: Exercise[] = [];

  constructor(private router: Router) {

  }

  getAvailableExercises() {
    return this.availableExercises.slice();
  }

  startExercise(selectedExercise: string) {
    this.runnningExercise = this.getAvailableExercises().find(ex => ex.id === selectedExercise);
    this.exerciseChanged.next(  {...this.runnningExercise});
  }

  completeExercise() {
    this.exercises.push(
      {
        ...this.runnningExercise,
        date: new Date(),
        state: 'completed'
      }
      );
    this.runnningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.exercises.push(
      {
        ...this.runnningExercise,
        duration: this.runnningExercise.duration * (progress / 100),
        calories: this.runnningExercise.calories * (progress / 100),
        date: new Date(),
        state: 'cancelled'
      }
    );
    this.runnningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise() {
    return {...this.runnningExercise};
  }

  getCompletedOrCancelledExercises() {
    return this.exercises.slice();
  }
}
