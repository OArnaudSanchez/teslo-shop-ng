import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';
import { isAdminGuard } from '@dashboard/guards/is-admin.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then(routes => routes.authRoutes),
        canMatch: [NotAuthenticatedGuard]
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin-dashboard/admin-dashboard.routes').then(route => route.adminDashboardRoutes),
        canMatch: [isAdminGuard]
    },
    {
        path: '',
        loadChildren: () => import('./store-front/store-front.routes').then(route => route.storeFrontRoutes)
    },
];
