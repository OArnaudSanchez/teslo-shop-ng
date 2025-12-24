import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then(routes => routes.authRoutes),
        canMatch: [NotAuthenticatedGuard]
    },
    {
        path: '',
        loadChildren: () => import('./store-front/store-front.routes').then(route => route.storeFrontRoutes)
    },
];
