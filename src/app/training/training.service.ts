import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Exercise} from './exercise.model';
import {Subject} from 'rxjs/Subject';
import {AngularFirestore} from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();

  private availableExercises: Exercise[] = [];
  private runnningExercise: Exercise = null;
  private exercises: Exercise[] = [];


  constructor(private router: Router, private db: AngularFirestore) {

  }

  fetchAvailableExercises() {
    return this.db
      .collection('availableExercises')
      .snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            name: doc.payload.doc.data()['name'],
            duration: doc.payload.doc.data()['duration'],
            calories: doc.payload.doc.data()['calories'],
          };
        });
      })).subscribe((exercises: Exercise[]) => {
        this.availableExercises = exercises;
        this.exercisesChanged.next([...exercises]);
      });
  }

  startExercise(selectedExercise: string) {
    this.runnningExercise = this.availableExercises.find(ex => ex.id === selectedExercise);
    this.exerciseChanged.next(  {...this.runnningExercise});
  }

  completeExercise() {
    this.addDataToDatabase(
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
    this.addDataToDatabase(
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

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises')
      .add(exercise)
      .then(success => {
        console.log(success);
      }).catch(error => {
        console.log(error);
      });
  }
}
