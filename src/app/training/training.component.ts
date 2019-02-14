import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrainingService} from './training.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy {
  exerciseChangedSubscription: Subscription;
  onGoingTraining = false;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.exerciseChangedSubscription = this.trainingService.exerciseChanged.subscribe(exercice => {
      if (exercice) {
        this.onGoingTraining = true;
      } else {
        this.onGoingTraining = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.exerciseChangedSubscription.unsubscribe();
  }
}
