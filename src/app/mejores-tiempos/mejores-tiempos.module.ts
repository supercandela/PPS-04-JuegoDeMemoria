import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MejoresTiemposPageRoutingModule } from './mejores-tiempos-routing.module';

import { MejoresTiemposPage } from './mejores-tiempos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MejoresTiemposPageRoutingModule
  ],
  declarations: [MejoresTiemposPage]
})
export class MejoresTiemposPageModule {}
