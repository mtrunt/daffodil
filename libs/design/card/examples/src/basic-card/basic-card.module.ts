import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {
  DaffCardModule,
  DaffImageModule,
  DaffButtonModule,
} from '@daffodil/design';

import { BasicCardComponent } from './basic-card.component';

@NgModule({
  declarations: [
    BasicCardComponent,
  ],
  imports: [
    CommonModule,
    DaffCardModule,
    DaffImageModule,
    DaffButtonModule,

    FontAwesomeModule,
  ],
  exports: [
    BasicCardComponent,
  ],
})
export class BasicCardModule { }
