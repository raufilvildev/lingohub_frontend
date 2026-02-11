import { Routes } from '@angular/router';
import { PublicLayout } from './pages/public-layout/public-layout';
import { Home } from './pages/public-layout/home/home';
import { Signup } from './pages/public-layout/signup/signup';
import { Login } from './pages/public-layout/login/login';
import { ForgotPassword } from './pages/public-layout/forgot-password/forgot-password';
import { Request } from './pages/public-layout/forgot-password/request/request';
import { Verify } from './pages/public-layout/forgot-password/verify/verify';
import { Reset } from './pages/public-layout/forgot-password/reset/reset';
import { PrivateLayout } from './pages/private-layout/private-layout';
import { Dashboard } from './pages/private-layout/dashboard/dashboard';
import { Settings } from './pages/private-layout/settings/settings';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    canActivate: [authGuard('public')],
    children: [
      { path: '', component: Home },
      { path: 'signup', component: Signup },
      { path: 'login', component: Login },
      {
        path: 'forgot_password',
        component: ForgotPassword,
        children: [
          { path: '', component: Request },
          { path: 'verify', component: Verify },
          { path: 'reset', component: Reset },
        ],
      },
    ],
  },
  {
    path: 'dashboard',
    component: PrivateLayout,
    canActivate: [authGuard('private')],
    children: [
      { path: '', component: Dashboard },
      { path: 'settings', component: Settings },
    ],
  },
];
