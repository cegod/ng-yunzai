import {NZ_I18N, zh_CN} from 'ng-zorro-antd';
import zh from '@angular/common/locales/zh';
import {registerLocaleData} from '@angular/common';
import {CookieInterceptor,  TokenInterceptor} from 'yunzai';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {SharedModule} from './shared.module';
import {APPINIT_PROVIDES} from 'yunzai';
import {DefaultInterceptor} from 'yunzai';
import {AppRoutingModule} from './app-routing.module';


registerLocaleData(zh);


@NgModule({
  declarations: [AppComponent],
  imports: [SharedModule, AppRoutingModule],
  providers: [
    {provide: NZ_I18N, useValue: zh_CN},
    {provide: HTTP_INTERCEPTORS, useClass: CookieInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    ...APPINIT_PROVIDES,
    {provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
