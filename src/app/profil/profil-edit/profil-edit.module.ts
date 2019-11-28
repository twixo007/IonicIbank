import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilEditPageRoutingModule } from './profil-edit-routing.module';

import { ProfilEditPage } from './profil-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProfilEditPageRoutingModule
  ],
  declarations: [ProfilEditPage]
})
export class ProfilEditPageModule {}
