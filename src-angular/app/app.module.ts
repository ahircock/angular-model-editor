// modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// services
import { ModelDataService } from './services/model-data/model-data.service';
import { SpecialRuleDataService } from './services/special-rule-data/special-rule-data.service';
import { ForceDataService } from './services/force-data/force-data.service';

// components
import { AppComponent } from './app.component';
import { ModelListComponent } from './components/model-list/model-list.component';
import { ModelDetailsComponent } from './components/model-details/model-details.component';
import { ModelEditorComponent } from './components/model-editor/model-editor.component';
import { AppRoutingModule } from './/app-routing.module';
import { SpecialRuleSelectorComponent } from './components/special-rule-selector/special-rule-selector.component';
import { SpecialRuleListComponent } from './components/special-rule-list/special-rule-list.component';
import { ForceListComponent } from './components/force-list/force-list.component';
import { ModelTileComponent } from './components/model-tile/model-tile.component';
import { ForceTileComponent } from './components/force-tile/force-tile.component';
import { ForceDetailsComponent } from './components/force-details/force-details.component';


@NgModule({
  declarations: [
    AppComponent,
    ModelListComponent,
    ModelDetailsComponent,
    ModelEditorComponent,
    SpecialRuleSelectorComponent,
    SpecialRuleListComponent,
    ForceListComponent,
    ModelTileComponent,
    ForceTileComponent,
    ForceDetailsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    ModelDataService,
    SpecialRuleDataService,
    ForceDataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
