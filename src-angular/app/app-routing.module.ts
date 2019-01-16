import { NgModule } from '@angular/core';
import {RouterModule, Routes } from '@angular/router';

import { ForceListComponent } from './components/page-force-list/force-list.component';
import { ForceDetailsComponent } from './components/page-force-details/force-details.component';
import { ForcePrintComponent } from './components/page-force-print/force-print.component';
import { UserLoginComponent } from './components/common-account/user-login/user-login.component';
import { UserSignupComponent } from './components/common-account/user-signup/user-signup.component';

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
