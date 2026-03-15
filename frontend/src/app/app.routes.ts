import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home').then(m => m.HomeComponent)
  },
  {
    path: 'post/:id',
    loadComponent: () => import('./components/post/post').then(m => m.PostComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./components/create-post/create-post').then(m => m.CreatePostComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./components/edit-post/edit-post').then(m => m.EditPostComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
