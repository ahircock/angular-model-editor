import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { ModelListComponent } from './components/model-list/model-list.component';
import { ModelDetailsComponent } from './components/model-details/model-details.component';

import { ModelDataService } from './services/model-data/model-data.service';
import { SpecialRuleDataService } from './services/special-rule-data/special-rule-data.service';
import { ModelEditorComponent } from './components/model-editor/model-editor.component';
import { AppRoutingModule } from './/app-routing.module';
import { SpecialRuleSelectorComponent } from './components/special-rule-selector/special-rule-selector.component';
import { SpecialRuleListComponent } from './components/special-rule-list/special-rule-list.component';
import { ForceEditorComponent } from './components/force-editor/force-editor.component';


@NgModule({
  declarations: [
    AppComponent,
    ModelListComponent,
    ModelDetailsComponent,
    ModelEditorComponent,
    SpecialRuleSelectorComponent,
    SpecialRuleListComponent,
    ForceEditorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    ModelDataService,
    SpecialRuleDataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
