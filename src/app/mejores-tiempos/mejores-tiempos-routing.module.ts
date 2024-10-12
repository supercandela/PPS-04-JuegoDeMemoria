import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MejoresTiemposPage } from './mejores-tiempos.page';

const routes: Routes = [
  {
    path: '',
    component: MejoresTiemposPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MejoresTiemposPageRoutingModule {}
