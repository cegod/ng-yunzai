import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DemoComponent} from './demo/demo.component';
import {ActGuard, Http401Component, YzLayoutComponent} from 'yunzai';

const routes: Routes = [
  {path: 'http401', component: Http401Component},
  {
    path: '', component: YzLayoutComponent,
    canActivate: [ActGuard],
    canActivateChild: [ActGuard],
    children: [
      {path: '', component: DemoComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
