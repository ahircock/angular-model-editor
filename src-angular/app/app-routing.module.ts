import { NgModule } from '@angular/core';
import {RouterModule, Routes } from '@angular/router';

import { ModelListComponent } from './components/model-list/model-list.component';
import { ModelEditorComponent } from './components/model-editor/model-editor.component';
import { SpecialRuleListComponent } from './components/special-rule-list/special-rule-list.component';
import { ForceEditorComponent } from './components/force-editor/force-editor.component';

const routes: Routes = [
  { path: "", redirectTo: "/models", pathMatch: "full" },
  { path: "models", component: ModelListComponent },
  { path: "specialrules", component: SpecialRuleListComponent },
  { path: "forces", component: ForceEditorComponent }
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
