import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '../material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {TrainingComponent} from './training.component';
import {CurrentTrainingComponent} from './current-training/current-training.component';
import {NewTrainingComponent} from './new-training/new-training.component';
import {PastTrainingsComponent} from './past-trainings/past-trainings.component';

@NgModule({
  declarations: [
    TrainingComponent,
    CurrentTrainingComponent,
    NewTrainingComponent,
    PastTrainingsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    FlexLayoutModule
  ],
  exports: []
})
export class TrainingModule {}
