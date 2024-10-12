import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
 
import { AppRoutingModule } from './app-routing.module';
import {
  RouteReuseStrategy,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
 
@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    BrowserModule,
    IonicModule.forRoot(),
    IonicModule,
    RouterLink,
    RouterLinkActive,
    HttpClientModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideFirebaseApp(() => initializeApp({"projectId":"practicaprofesional-01","appId":"1:50528220535:web:1464e44d817e446ce15d72","databaseURL":"https://practicaprofesional-01-default-rtdb.firebaseio.com","storageBucket":"practicaprofesional-01.appspot.com","apiKey":"AIzaSyBmSf8tzJuk990_niYbZMhp9iKcT-1Mnco","authDomain":"practicaprofesional-01.firebaseapp.com","messagingSenderId":"50528220535","measurementId":"G-BCCN8GR296"})), provideFirestore(() => getFirestore())],
  bootstrap: [AppComponent],
})
export class AppModule {}