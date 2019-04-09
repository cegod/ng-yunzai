import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {Y401Component, YzLayoutComponent} from 'yunzai';

const routes: Routes = [
  {
    path: '', component: YzLayoutComponent, children: [
      {path: 'y401', component: Y401Component}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
