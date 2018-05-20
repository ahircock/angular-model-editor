import { NgModule } from '@angular/core';
import {RouterModule, Routes } from '@angular/router';

import { ModelListComponent } from './components/model-list/model-list.component';
import { ModelEditorComponent } from './components/model-editor/model-editor.component';
import { SpecialRuleListComponent } from './components/special-rule-list/special-rule-list.component';
import { ForceListComponent } from './components/force-list/force-list.component';
import { ForceDetailsComponent } from './components/force-details/force-details.component';
import { ForcePrintComponent } from './components/force-print/force-print.component';

const routes: Routes = [
  { path: "", redirectTo: "/forces", pathMatch: "full" },
  { path: "models", component: ModelListComponent },
  { path: "specialrules", component: SpecialRuleListComponent },
  { path: "forces/:id", component: ForceDetailsComponent },
  { path: "forces/print/:id", component: ForcePrintComponent },
  { path: "forces", component: ForceListComponent }
  
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
