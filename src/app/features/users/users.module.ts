import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { UsersRoutingModule } from './users-routing.module';
import { UsersEffects } from './store/Users.effects';
import { UsersReducer } from './store/Users.reducer';
import { UsersComponent } from './users.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UsersRoutingModule,
    UsersComponent,
    EffectsModule.forFeature([UsersEffects]),
    StoreModule.forFeature('users', UsersReducer),

  ],
})
export class UsersModule { }
