import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Exercise} from './exercise.model';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {AngularFirestore} from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();

  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise = null;
  private exercises: Exercise[] = [];
  private fbSubscriptions: Subscription[] = [];

  constructor(private router: Router, private db: AngularFirestore) {}

  fetchAvailableExercises() {
    this.fbSubscriptions.push(this.db
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
      }, error => {
        console.log(error);
      }));
  }

  startExercise(selectedExercise: string) {
    // dummy data added
    /*this.db.doc('availableExercises/' + selectedExercise).update({
      lastSelected: new Date()
    });*/

    this.runningExercise = this.availableExercises.find(ex => ex.id === selectedExercise);
    this.exerciseChanged.next(  {...this.runningExercise});
  }

  completeExercise() {
    this.addDataToDatabase(
      {
        ...this.runningExercise,
        date: new Date(),
        state: 'completed'
      }
    );
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase(
      {
        ...this.runningExercise,
        duration: this.runningExercise.duration * (progress / 100),
        calories: this.runningExercise.calories * (progress / 100),
        date: new Date(),
        state: 'cancelled'
      }
    );
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise() {
    return {...this.runningExercise};
  }

  fetchCompletedOrCancelledExercises() {
    this.fbSubscriptions.push(this.db.collection('finishedExercises')
      .valueChanges()
      .subscribe((exercises: Exercise[]) => {
        this.finishedExercisesChanged.next(exercises);
      }, error => {
        console.log(error);
      }));
  }

  cancelSubscriptions() {
    this.fbSubscriptions.forEach(subs => {
      subs.unsubscribe();
    });
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
