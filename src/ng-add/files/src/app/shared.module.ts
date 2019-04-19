import {YunzaiModule, BasePluginType, BasePlugin, StompPlugin, BaseClient, BaseClientType} from 'yunzai';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {RouterModule} from '@angular/router';
import {environment} from 'src/environments/environment';

const plugins: Map<BasePluginType, BasePlugin> = new Map();

const stompPlugin: StompPlugin = {
  brokerURL: 'ws://0.0.0.0:15674/ws',
  connectHeaders: {login: 'guest', passcode: 'guest'},
  heartbeatIncoming: 5,
  heartbeatOutgoing: 20000,
  reconnectDelay: 200
};

plugins.set(BasePluginType.STOMP, stompPlugin);

const baseClient: BaseClient = {
  central: `${environment.central}`,
  gateway: `${environment.gateway}`,
  ignores: [`${environment.central}/app/validate_full?callback=${window.location.href}`],
  plugins: plugins,
  http401: 'http401',
  systemcode: <% if(systemCode) { %><%= `'${systemCode}'` %><%} else {%>null<%}%>,
  type: <% if(clientType === 'CAS_SYSTEM'){%>BaseClientType.CAS_SYSTEM<%}else if(clientType === 'OPEN_SYSTEM'){ %>BaseClientType.OPEN_SYSTEM<%}%>
};

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgZorroAntdModule,
    YunzaiModule.forRoot(baseClient),
  ],
  exports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgZorroAntdModule,
    YunzaiModule
  ]
})
export class SharedModule {
}
