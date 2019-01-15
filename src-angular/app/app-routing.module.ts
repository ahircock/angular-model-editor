import { NgModule } from '@angular/core';
import {RouterModule, Routes } from '@angular/router';

import { ForceListComponent } from './components/force-list/force-list.component';
import { ForceDetailsComponent } from './components/force-details/force-details.component';
import { ForcePrintComponent } from './components/force-print/force-print.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { UserSignupComponent } from './components/user-signup/user-signup.component';

const routes: Routes = [
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
