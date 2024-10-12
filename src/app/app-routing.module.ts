import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
 
 
const routes: Routes = [
  {
    path: 'home',
    children: [
      {
        path: '',
        loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
        canMatch: [authGuard]
      }
    ]
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'splash',
    loadChildren: () => import('./splash/splash.module').then( m => m.SplashPageModule)
  },
  {
    path: 'juego',
    children: [
      {
        path: ':nivel',
        loadChildren: () => import('./juego/juego.module').then( m => m.JuegoPageModule),
        canMatch: [authGuard]
      }
    ]
  },
  {
    path: 'mejores-tiempos',
    loadChildren: () => import('./mejores-tiempos/mejores-tiempos.module').then( m => m.MejoresTiemposPageModule),
    canMatch: [authGuard]
  }
];
 
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}