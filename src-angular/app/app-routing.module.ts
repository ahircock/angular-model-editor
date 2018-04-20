import { NgModule } from '@angular/core';
import {RouterModule, Routes } from '@angular/router';

import { ModelListComponent } from './components/model-list/model-list.component';
import { ModelEditorComponent } from './components/model-editor/model-editor.component';

const routes: Routes = [
  { path: "", redirectTo: "/models", pathMatch: "full" },
  { path: "models", component: ModelListComponent },
  { path: "models/edit/:id", component: ModelEditorComponent }
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
