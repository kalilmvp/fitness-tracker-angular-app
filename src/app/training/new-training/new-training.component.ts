import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrainingService} from '../training.service';
import {NgForm} from '@angular/forms';
import {Exercise} from '../exercise.model';
import {Subscription} from 'rxjs';
import {UiService} from '../../shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  typesOfTraining: Exercise[];
  private exercisesSubscription: Subscription;
  isLoading = true;

  constructor(private trainingService: TrainingService,
              private uiService: UiService) { }

  ngOnInit() {
    this.exercisesSubscription = this.trainingService.exercisesChanged.subscribe(exercises => {
      this.typesOfTraining = exercises;
      this.isLoading = false;
    });
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy(): void {
    this.exercisesSubscription.unsubscribe();
  }
}
