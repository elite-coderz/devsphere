
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { DeveloperProfileComponent } from './components/developer-profile/developer-profile';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'developer/:id',
    component: DeveloperProfileComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
