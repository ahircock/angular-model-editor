// modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

// services
import { UserService } from './services/user.service';
import { ModelDataService } from './services/model-data.service';
import { RuleDataService } from './services/rule-data.service';
import { ForceDataService } from './services/force-data.service';
import { AttackDataService } from './services/attack-data.service';
import { ActionDataService } from './services/action-data.service';
import { FactionDataService } from './services/faction-data.service';
import { DataAccessService } from './services/data-access.service';
import { AppErrorHandler } from './services/error-handler.service';
import { AbilityDataService } from './services/ability-data.service';
import { WindowService } from './services/window.service';

// components
import { AppComponent } from './app.component';
import { AppHeaderComponent } from './components/common/app-header/app-header.component';
import { ModelViewComponent } from './components/view-model/model-view/model-view.component';
import { ForceListComponent } from './components/page-force-list/force-list.component';
import { ForceTileComponent } from './components/page-force-list/force-tile/force-tile.component';
import { ForceDetailsComponent } from './components/page-force-details/force-details.component';
import { ForcePrintComponent } from './components/page-force-print/force-print.component';
import { UserLoginComponent } from './components/common-account/user-login/user-login.component';
import { UserSignupComponent } from './components/common-account/user-signup/user-signup.component';
import { ModelOptionsComponent } from './components/view-model/model-options/model-options.component';
import { AttackDetailsComponent } from './components/view-model/attack-details/attack-details.component';
import { ModelDetailsComponent } from './components/page-model-details/model-details.component';
import { ForceAbilityDetailsComponent } from './components/page-force-ability-details/force-ability-details.component';
import { AbilityDetailsComponent } from './components/view-model/ability-details/ability-details.component';
import { HeaderDetailsComponent } from './components/view-model/header-details/header-details.component';
import { ActionDetailsComponent } from './components/view-model/action-details/action-details.component';
import { ViewForceAbilitiesComponent } from './components/view-force-abilities/view-force-abilities.component';
import { ForceListItemComponent } from './components/page-force-details/force-list-item/force-list-item.component';
import { ModelListItemComponent } from './components/page-force-details/model-list-item/model-list-item.component';

// directives
import { ClickElsewhereDirective } from './directives/click-elsewhere.directive';
import { TextControllerDirective } from './directives/text-controller.directive';
import { AppButtonComponent } from './components/common/app-button/app-button.component';


@NgModule({
  declarations: [
    ClickElsewhereDirective,
    TextControllerDirective,
    AppComponent,
    ModelViewComponent,
    ForceListComponent,
    ForceTileComponent,
    ForceDetailsComponent,
    ForcePrintComponent,
    UserLoginComponent,
    UserSignupComponent,
    AppHeaderComponent,
    ModelOptionsComponent,
    ModelDetailsComponent,
    ForceAbilityDetailsComponent,
    AttackDetailsComponent,
    AbilityDetailsComponent,
    HeaderDetailsComponent,
    ActionDetailsComponent,
    ViewForceAbilitiesComponent,
    ForceListItemComponent,
    ModelListItemComponent,
    AppButtonComponent
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
    RuleDataService,
    ForceDataService,
    AttackDataService,
    AbilityDataService,
    ActionDataService,
    FactionDataService,
    DataAccessService,
    WindowService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
