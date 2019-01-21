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
import { ModelViewComponent } from './components/common-model/model-view/model-view.component';
import { ForceListComponent } from './components/page-force-list/force-list.component';
import { ModelTileComponent } from './components/page-force-details/model-tile/model-tile.component';
import { ForceTileComponent } from './components/page-force-list/force-tile/force-tile.component';
import { ForceDetailsComponent } from './components/page-force-details/force-details.component';
import { ForcePrintComponent } from './components/page-force-print/force-print.component';
import { UserLoginComponent } from './components/common-account/user-login/user-login.component';
import { UserSignupComponent } from './components/common-account/user-signup/user-signup.component';
import { ModelOptionsComponent } from './components/common-model/model-options/model-options.component';
import { AttackDetailsComponent } from './components/common-model/attack-details/attack-details.component';
import { ModelDetailsComponent } from './components/page-model-details/model-details.component';
import { AbilityDetailsComponent } from './components/common-model/ability-details/ability-details.component';
import { HeaderDetailsComponent } from './components/common-model/header-details/header-details.component';
import { ActionDetailsComponent } from './components/common-model/action-details/action-details.component';

// directives
import { ClickElsewhereDirective } from './directives/click-elsewhere.directive';
import { TextControllerDirective } from './directives/text-controller.directive';


@NgModule({
  declarations: [
    ClickElsewhereDirective,
    TextControllerDirective,
    AppComponent,
    ModelViewComponent,
    ForceListComponent,
    ModelTileComponent,
    ForceTileComponent,
    ForceDetailsComponent,
    ForcePrintComponent,
    UserLoginComponent,
    UserSignupComponent,
    AppHeaderComponent,
    ModelOptionsComponent,
    ModelDetailsComponent,
    AttackDetailsComponent,
    AbilityDetailsComponent,
    HeaderDetailsComponent,
    ActionDetailsComponent
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
