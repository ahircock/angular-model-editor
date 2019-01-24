import { NgModule } from '@angular/core';
import {RouterModule, Routes } from '@angular/router';

import { ForceListComponent } from './components/page-force-list/force-list.component';
import { ForceDetailsComponent } from './components/page-force-details/force-details.component';
import { ForcePrintComponent } from './components/page-force-print/force-print.component';
import { UserLoginComponent } from './components/common-account/user-login/user-login.component';
import { UserSignupComponent } from './components/common-account/user-signup/user-signup.component';
import { ModelDetailsComponent } from './components/page-model-details/model-details.component';
import { ForceAbilityDetailsComponent } from './components/page-force-ability-details/force-ability-details.component';

const routes: Routes = [
  { path: 'force/:id', component: ForceDetailsComponent },
  { path: 'force/print/:id', component: ForcePrintComponent },
  { path: 'force/abilities/:id', component: ForceAbilityDetailsComponent },
  { path: 'force-list', component: ForceListComponent },
  { path: 'model/:id', component: ModelDetailsComponent },
  { path: 'login', component: UserLoginComponent },
  { path: 'signup', component: UserSignupComponent },
  { path: '**', redirectTo: '/force-list' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
