import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { MainLayout } from './layout/main-layout';


export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
  { path: 'motoristas', loadComponent: () => import('./pages/motoristas/motoristas.component').then(m => m.MotoristasComponent)},
  { path: 'register', loadComponent: () => import('./pages/register/register').then(m => m.Register) },
  { path: 'register-driver-1', loadComponent: () => import('./pages/register-driver/register-driver-1/register-driver-1').then(m => m.RegisterDriverOne) },
  { path: 'register-driver-2', loadComponent: () => import('./pages/register-driver/register-driver-2/register-driver-2').then(m => m.RegisterDriverTwo) },
  { 
    path: '', 
    component: MainLayout,
    canActivate: [authGuard], 
    children: [
    ] 
  },
  // Temporary workaround: Since we don't have a dashboard component, let's make the root path protected 
  // but if the user is logged in, they stay on root. If not, guard sends to login.
];
