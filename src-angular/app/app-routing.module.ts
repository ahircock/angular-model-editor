import { NgModule } from '@angular/core';
import {RouterModule, Routes } from '@angular/router';

import { ModelListComponent } from './components/model-list/model-list.component';
import { SpecialRuleListComponent } from './components/special-rule-list/special-rule-list.component';
import { ActionListComponent } from './components/action-list/action-list.component';
import { ForceListComponent } from './components/force-list/force-list.component';
import { ForceDetailsComponent } from './components/force-details/force-details.component';
import { ForcePrintComponent } from './components/force-print/force-print.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { UserSignupComponent } from './components/user-signup/user-signup.component';
import { ActionDetailsComponent } from './components/action-details/action-details.component';

const routes: Routes = [
  { path: 'models', component: ModelListComponent },
  { path: 'specialrules', component: SpecialRuleListComponent },
  { path: 'ranged-actions', component: ActionListComponent },
  { path: 'melee-actions', component: ActionListComponent },
  { path: 'special-actions', component: ActionListComponent },
  { path: 'actions/:id', component: ActionDetailsComponent },
  { path: 'forces/:id', component: ForceDetailsComponent },
  { path: 'forces/print/:id', component: ForcePrintComponent },
  { path: 'forces', component: ForceListComponent },
  { path: 'login', component: UserLoginComponent },
  { path: 'signup', component: UserSignupComponent },
  { path: '**', redirectTo: '/forces' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
