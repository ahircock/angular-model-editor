// modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'

// services
import { UserService } from './services/user/user.service';
import { ModelDataService } from './services/model-data/model-data.service';
import { SpecialRuleDataService } from './services/special-rule-data/special-rule-data.service';
import { ForceDataService } from './services/force-data/force-data.service';
import { ActionDataService } from './services/action-data/action-data.service';
import { DbConnectService } from './services/db-connector/db-connector.interface';
import { RestAPIConnector } from './services/db-connector/restapi-connector.service';
import { AppErrorHandler } from './services/error-handler/error-handler.service'

// components
import { AppComponent } from './app.component';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { ModelListComponent } from './components/model-list/model-list.component';
import { ModelEditorComponent } from './components/model-view/model-view.component';
import { AppRoutingModule } from './app-routing.module';
import { SpecialRuleSelectorComponent } from './components/special-rule-selector/special-rule-selector.component';
import { SpecialRuleListComponent } from './components/special-rule-list/special-rule-list.component';
import { ForceListComponent } from './components/force-list/force-list.component';
import { ModelTileComponent } from './components/model-tile/model-tile.component';
import { ForceTileComponent } from './components/force-tile/force-tile.component';
import { ForceDetailsComponent } from './components/force-details/force-details.component';
import { ForcePrintComponent } from './components/force-print/force-print.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { UserSignupComponent } from './components/user-signup/user-signup.component';
import { SpecialRuleEditorComponent } from './components/special-rule-editor/special-rule-editor.component';
import { ActionListComponent } from './components/action-list/action-list.component';
import { ActionViewComponent } from './components/action-view/action-view.component';
import { DropdownMeleeComponent } from './components/dropdowns/dropdown-melee.component';
import { DropdownRangedComponent } from './components/dropdowns/dropdown-ranged.component';
import { DropdownSpecialComponent } from './components/dropdowns/dropdown-special.component';

//directives
import { ClickElsewhereDirective } from './directives/click-elsewhere/click-elsewhere.directive';
import { TextControllerDirective } from './directives/text-controller/text-controller.directive';


@NgModule({
  declarations: [
    AppComponent,
    ModelListComponent,
    ModelEditorComponent,
    SpecialRuleSelectorComponent,
    SpecialRuleListComponent,
    ForceListComponent,
    ModelTileComponent,
    ForceTileComponent,
    ForceDetailsComponent,
    ForcePrintComponent,
    UserLoginComponent,
    UserSignupComponent,
    SpecialRuleEditorComponent,
    ClickElsewhereDirective,
    ActionListComponent,
    AppHeaderComponent,
    ActionViewComponent,
    TextControllerDirective,
    DropdownMeleeComponent,
    DropdownRangedComponent,
    DropdownSpecialComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    { provide: ErrorHandler, useClass: AppErrorHandler },
    UserService,
    ModelDataService,
    SpecialRuleDataService,
    ForceDataService,
    ActionDataService,
    { provide: DbConnectService, useClass: RestAPIConnector }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
