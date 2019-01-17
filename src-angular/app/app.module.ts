// modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// services
import { UserService } from './services/user.service';
import { ModelDataService } from './services/model-data.service';
import { SpecialRuleDataService } from './services/special-rule-data.service';
import { ForceDataService } from './services/force-data.service';
import { AttackDataService } from './services/attack-data.service';
import { DataAccessService } from './services/data-access.service';
import { AppErrorHandler } from './services/error-handler.service';

// components
import { AppComponent } from './app.component';
import { AppHeaderComponent } from './components/common/app-header/app-header.component';
import { ModelViewComponent } from './components/common/model-view/model-view.component';
import { AppRoutingModule } from './app-routing.module';
import { ForceListComponent } from './components/page-force-list/force-list.component';
import { ModelTileComponent } from './components/page-force-details/model-tile/model-tile.component';
import { ForceTileComponent } from './components/page-force-list/force-tile/force-tile.component';
import { ForceDetailsComponent } from './components/page-force-details/force-details.component';
import { ForcePrintComponent } from './components/page-force-print/force-print.component';
import { UserLoginComponent } from './components/common-account/user-login/user-login.component';
import { UserSignupComponent } from './components/common-account/user-signup/user-signup.component';
import { ModelOptionsComponent } from './components/common/model-options/model-options.component';

// directives
import { ClickElsewhereDirective } from './directives/click-elsewhere.directive';
import { TextControllerDirective } from './directives/text-controller.directive';
import { ModelDetailsComponent } from './components/page-model-details/model-details.component';
import { WindowService } from './services/window.service';


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
    ModelDetailsComponent
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
    AttackDataService,
    DataAccessService,
    WindowService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
