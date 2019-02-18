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
  private loadingSubscription: Subscription;
  isLoading = true;

  constructor(private trainingService: TrainingService,
              private uiService: UiService) { }

  ngOnInit() {
    this.loadingSubscription = this.uiService.loadingStateChanged.subscribe(
      isLoading => {
        this.isLoading = isLoading;
      });

    this.exercisesSubscription = this.trainingService.exercisesChanged.subscribe(exercises => {
      this.typesOfTraining = exercises;
    });

    this.fetchExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy(): void {
    this.exercisesSubscription.unsubscribe();
    this.loadingSubscription.unsubscribe();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }
}
