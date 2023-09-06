import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule,HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HashLocationStrategy, LocationStrategy, CommonModule, DecimalPipe,PathLocationStrategy } from "@angular/common";
import { AngularDraggableModule } from 'angular2-draggable';
import { Title } from '@angular/platform-browser';
import { WorkerService } from './order-book/worker.service';
// import { UserIdleModule } from 'angular-user-idle';
import { QRCodeModule } from 'angularx-qrcode';
import { RecaptchaModule } from 'ng-recaptcha';
import { Ng2OdometerModule } from 'ng2-odometer';
import { LazyLoadImageModule } from 'ng-lazyload-image';
// import { NgApexchartsModule } from "ng-apexcharts";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { OrderBookComponent } from './order-book/order-book.component';
import { ChartComponent } from './chart/chart.component';
import { TradesComponent } from './trades/trades.component';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StopLossComponent } from './stop-loss/stop-loss.component';
import { SafePipe } from './chart/safe.pipe';
import { NavbarComponent } from './navbar/navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CoreDataService } from "./core-data.service";
import { BodyService } from "./body.service";
import { LoginComponent } from './login/login.component';
import { CookieService } from "ngx-cookie-service";
import { MyWalletComponent } from './my-wallet/my-wallet.component';
import { DepositFundsComponent } from './deposit-funds/deposit-funds.component';
import { ShareModule } from '@ngx-share/core';
import { WithdrawFundsComponent } from './withdraw-funds/withdraw-funds.component';
import { HistoryComponent } from './history/history.component';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { IdentityVerificationComponent } from './identity-verification/identity-verification.component';
import { BankDetailsComponent } from './bank-details/bank-details.component';
import { PromotionsComponent } from './promotions/promotions.component';
import { SettingsComponent } from './settings/settings.component';
import { SupportComponent } from './support/support.component';
import { SignupComponent } from './signup/signup.component';
import { SecureTokenComponent } from './secure-token/secure-token.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { OtpComponent } from './otp/otp.component';
import { ModalsComponent } from './modals/modals.component';
import { LoaderComponent } from './loader/loader.component';
import { ReportComponent } from './report/report.component';
import { NumericDirective } from '../app/core-data.directive';
import { NgbdModalContent, } from './deposit-funds/deposit-funds.component';
import { TvChartContainerComponent } from './tv-chart-container/tv-chart-container.component';
import { TvChartWebSocketAPI } from './tv-chart-container/TvChartWebSocketAPI';
import { AppHeaderComponent } from './app-header/app-header.component';
import { WalletgraphComponent } from './walletgraph/walletgraph.component';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { DecimalpointDirective } from './decimalpoint.directive';
import { BasicComponent } from './basic/basic.component';
import { OtcComponent } from './otc/otc.component';
import { WebSocketAPI } from './WebSocketAPI';
import { BuystoplimitdierctiveDirective } from './buystoplimitdierctive.directive';
import { PortfolioHoldingsComponent } from './portfolio-holdings/portfolio-holdings.component';
import { DerivativeWebSocketAPI } from './DerivativeWebSocketAPI';
import { DerivativeDashboardComponent } from './derivative-dashboard/derivative-dashboard.component';
import { DerivativeStoplossComponent } from './derivative-stoploss/derivative-stoploss.component';
import { DerivativeTradeComponent } from './derivative-trade/derivative-trade.component';
import { DerivativeOrderbookComponent } from './derivative-orderbook/derivative-orderbook.component';
import { DerivativeChartComponent } from './derivative-chart/derivative-chart.component';
import { DerivativeTvchartcontainerComponent } from './derivative-tvchartcontainer/derivative-tvchartcontainer.component';
import { TwodecimalpointDirective } from './twodecimalpoint.directive';
import { OtcRevisedComponent } from './otc-revised/otc-revised.component';
import { OptionsChartComponent } from './options-chart/options-chart.component';
import { OptionsDashboardComponent } from './options-dashboard/options-dashboard.component';
import { OptionsOrderbookComponent } from './options-orderbook/options-orderbook.component';
import { OptionsStoplossComponent } from './options-stoploss/options-stoploss.component';
import { OptionsTradeComponent } from './options-trade/options-trade.component';
import { OptionsTvchartcontainerComponent } from './options-tvchartcontainer/options-tvchartcontainer.component';
import { OptionsWebSocketAPI } from './OptionsWebSocketAPI';
import { HttpConfigInterceptor } from './interceptors/httpconfig.interceptor';
import { SearchPipe } from './my-wallet/search.pipe';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { ConnectionServiceModule } from 'ng-connection-service';
import { RECAPTCHA_SETTINGS,  RecaptchaSettings } from 'ng-recaptcha';

import { environment } from '../environments/environment';
import { TradeHistoryService } from './tv-chart-container/trade-history.service';
import { SocketService } from './tv-chart-container/socket.service';
import { HttpModule } from '../../node_modules/@angular/http';
import { DerivativeTvChartWebSocketAPI } from './derivative-tvchartcontainer/DerivativeTvChartWebSocketAPI';
import { LoginWithFacebookComponent } from './login-with-facebook/login-with-facebook.component';
import { MyBotsComponent } from './my-bots/my-bots.component';
import { SignupWithFacebookComponent } from './signup-with-facebook/signup-with-facebook.component';
import { CopyTradingComponent } from './copy-trading/copy-trading.component';
import { IsnegativeDirective } from './isnegative.directive';
import { CreateNewBotComponent } from './my-bots/create-new-bot/create-new-bot.component';
import { EditBotComponent } from './my-bots/edit-bot/edit-bot.component';
import { AddApiKeyComponent } from './add-api-key/add-api-key.component';
import { OptionsTvChartWebSocketAPI } from './options-tvchartcontainer/OptionsTvChartWebSocketAPI';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { ViewTraderComponent } from './view-trader/view-trader.component';
import { ViewBotComponent } from './view-bot/view-bot.component';
import { ManageCopyTradingComponent } from './manage-copy-trading/manage-copy-trading.component';
import { ManageCopyTradingMyPayoutsComponent } from './manage-copy-trading-my-payouts/manage-copy-trading-my-payouts.component';
import { ManageCopyTradingMyFollowersComponent } from './manage-copy-trading-my-followers/manage-copy-trading-my-followers.component';
import { ManageCopyTradingWhomIFollowComponent } from './manage-copy-trading-whom-ifollow/manage-copy-trading-whom-ifollow.component';
import { SocialDrawerComponent } from './social-drawer/social-drawer.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { ViewBotTraderComponent } from './view-bot-trader/view-bot-trader.component';
import { NumbersOnlyDirective } from './numbers-only.directive';
import { ChatgptChatBotComponent } from './chat-bots/chatgpt-chat-bot/chatgpt-chat-bot.component';
 import { HttpResponseInterceptors } from './httpResponse.interceptors';
import { AlphaNumericOnlyDirective } from './alpha-numeric-only.directive';
import { AlphanumericPattern2Directive } from './alphanumeric-pattern2.directive';
import { OnlyAlphabetDirective } from './only-alphabet.directive';
import { TradeBookComponent } from './trade-book/trade-book.component';
import { DerivativeTradeBookComponent } from './derivative-trade-book/derivative-trade-book.component';
import { OptionsTradeBookComponent } from './options-trade-book/options-trade-book.component';
import { BinanceLtpWebsocket } from './my-bots/binanceLtpWebsocket';
import { DepthChartComponent } from './depth-chart/depth-chart.component';
import { DerivativeDepthChartComponent } from './derivative-depth-chart/derivative-depth-chart.component';
import { BinanceFutuesLtpWebsocket } from './my-bots/binanceFuturesLtpWebsocket';
import { OptionsDepthChartComponent } from './options-depth-chart/options-depth-chart.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsAndConditionComponent } from './terms-and-condition/terms-and-condition.component';
import { CopyTradingHistoryComponent } from './copy-trading-history/copy-trading-history.component';

export * from './chart/chart.component';

const appRoutes: Routes = [
  { path: '', component: LoginComponent,pathMatch: 'full' },
  { path: 'login/:userId/:location/:deviceId', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'social-signup', component: SignupWithFacebookComponent},
  { path: 'signup/:id', component: SignupComponent },
  { path: 'otp', component: OtpComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'spot', component: DashboardComponent },

  { path: 'login', component: LoginComponent },
  { path: 'my-wallet', component: MyWalletComponent },
  { path: 'deposit-funds', component: DepositFundsComponent },
  { path: 'deposit-funds/:transaction_id/:msid', component: DepositFundsComponent },
  { path: 'withdraw-funds', component: WithdrawFundsComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'profile-details', component: ProfileDetailsComponent },
  { path: 'identity-verification', component: IdentityVerificationComponent },
  { path: 'bank-details', component: BankDetailsComponent },
  { path: 'my-bots', component: MyBotsComponent },
  { path: 'my-bots/create-new-bot', component: CreateNewBotComponent },
  { path: 'my-bots/edit-bot', component: EditBotComponent },
  { path: 'promotion', component: PromotionsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'support', component: SupportComponent },
  { path: 'secure-token', component: SecureTokenComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'report', component: ReportComponent },
  { path: 'modaltest', component: ModalsComponent },
  { path: 'basic', component: BasicComponent },
 /*  { path: 'otc', component: OtcComponent }, */
  { path: 'otc', component: OtcRevisedComponent },
  { path: 'portfolio-holdings', component: PortfolioHoldingsComponent },
  { path: 'derivative-dashboard', component: DerivativeDashboardComponent },
  { path: 'futures', component: DerivativeDashboardComponent },

  { path: 'options-dashboard', component: OptionsDashboardComponent },
  { path: 'options', component: OptionsDashboardComponent },

  { path: 'copy-trading', component: CopyTradingComponent },
  { path: 'add-apiKey', component: AddApiKeyComponent },
  { path: 'marketplace', component: MarketplaceComponent },
  { path: 'view-traders/:p1/:q1/:follow', component: ViewTraderComponent },
  { path: 'view-bot-traders/:b1/:c1/:follow', component: ViewBotTraderComponent },

  { path: 'view-bots', component: ViewBotComponent },
  { path: 'manage-copytrading', component: ManageCopyTradingComponent },
  { path: 'my-payouts', component: ManageCopyTradingMyPayoutsComponent },
  { path: 'my-followers', component: ManageCopyTradingMyFollowersComponent },
  { path: 'whom-I-follow', component: ManageCopyTradingWhomIFollowComponent },

  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms-of-use', component: TermsAndConditionComponent },
  { path: 'copy-trading-history', component: CopyTradingHistoryComponent },







  

];

@NgModule({
  declarations: [
    AppComponent,
    OrderBookComponent,
    ChartComponent,
    TradesComponent,
    StopLossComponent,
    SafePipe,
    NavbarComponent,
    DashboardComponent,
    LoginComponent,
    MyWalletComponent,
    DepositFundsComponent,
    NgbdModalContent,
    WithdrawFundsComponent,
    HistoryComponent,
    ProfileDetailsComponent,
    IdentityVerificationComponent,
    BankDetailsComponent,
    PromotionsComponent,
    SettingsComponent,
    SupportComponent,
    SignupComponent,
    SecureTokenComponent,
    ForgetPasswordComponent,
    OtpComponent,
    ModalsComponent,
    LoaderComponent,
    ReportComponent,
    NumericDirective,
    TvChartContainerComponent,
    AppHeaderComponent,
    WalletgraphComponent,
    DecimalpointDirective,
    BasicComponent,
    OtcComponent,
    BuystoplimitdierctiveDirective,
    PortfolioHoldingsComponent,
    DerivativeDashboardComponent,
    DerivativeStoplossComponent,
    DerivativeTradeComponent,
    DerivativeOrderbookComponent,
    DerivativeChartComponent,
    DerivativeTvchartcontainerComponent,
    TwodecimalpointDirective,
    OtcRevisedComponent,
    OptionsChartComponent,
    OptionsDashboardComponent,
    OptionsOrderbookComponent,
    OptionsStoplossComponent,
    OptionsTradeComponent,
    OptionsTvchartcontainerComponent,
    SearchPipe,
    LoginWithFacebookComponent,
    MyBotsComponent,
    SignupWithFacebookComponent,
    CopyTradingComponent,
    IsnegativeDirective,
    CreateNewBotComponent,
    EditBotComponent,
    AddApiKeyComponent,
    MarketplaceComponent,
    ViewTraderComponent,
    ViewBotTraderComponent,
    ViewBotComponent,
    ManageCopyTradingComponent,
    ManageCopyTradingMyPayoutsComponent,
    ManageCopyTradingMyFollowersComponent,
    ManageCopyTradingWhomIFollowComponent,
    SocialDrawerComponent,
    NumbersOnlyDirective,
    ChatgptChatBotComponent,
    AlphaNumericOnlyDirective,
    AlphanumericPattern2Directive,
    OnlyAlphabetDirective,
    TradeBookComponent,
    DerivativeTradeBookComponent,
    OptionsTradeBookComponent,
    DepthChartComponent,
    DerivativeDepthChartComponent,
    OptionsDepthChartComponent,
    PrivacyPolicyComponent,
    TermsAndConditionComponent,
    CopyTradingHistoryComponent

  ],
  imports: [
    FormsModule,
    QRCodeModule,
    RecaptchaModule,
    AngularDraggableModule,
    LazyLoadImageModule,
    NgbModule.forRoot(),
    BrowserModule,
    CommonModule,
    Ng2OdometerModule.forRoot(),
    HttpClientModule,
    BrowserAnimationsModule,
    Ng2TelInputModule,
    ConnectionServiceModule,
    ShareModule.forRoot(),
    HttpModule,
    //control idle timeout
    RouterModule.forRoot(
      appRoutes
      // { enableTracing: true } // <-- debugging purposes only
    ),
    DeviceDetectorModule,
    AngularMultiSelectModule,
    
  ],

  providers: [Title,
    ChartComponent,
    DerivativeChartComponent,
    OrderBookComponent,
    StopLossComponent,
    CoreDataService,
    CookieService,
    TradesComponent,
    NavbarComponent,
    BodyService,
    DashboardComponent,
    MyWalletComponent,
    NgbdModalContent,
    SignupComponent,
    TvChartContainerComponent,
    DerivativeTvchartcontainerComponent,
    WalletgraphComponent,
    NgbActiveModal,
    WebSocketAPI,
    DerivativeWebSocketAPI,
    TvChartWebSocketAPI,
    DerivativeTvChartWebSocketAPI,
    OptionsTvChartWebSocketAPI,
    DerivativeTradeComponent,
    DerivativeStoplossComponent,
    DerivativeOrderbookComponent,
    DerivativeDashboardComponent,
    OptionsChartComponent,
    OptionsDashboardComponent,
    OptionsStoplossComponent,
    OptionsTradeComponent,
    OptionsTvchartcontainerComponent,
    OptionsOrderbookComponent,
    OptionsWebSocketAPI,
    TradeHistoryService,
    SocketService,
    WorkerService,
    BinanceLtpWebsocket,
    BinanceFutuesLtpWebsocket,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
    DecimalPipe,
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.recaptcha.siteKey,
      } as RecaptchaSettings,
    },
  ],
  entryComponents: [NgbdModalContent],
  bootstrap: [AppComponent]
})
export class AppModule { }
