import { Routes } from "@angular/router";
import { StoreFrontLayout } from "./layouts/store-front-layout/store-front-layout.component";
import { GenderPageComponent } from "./pages/gender-page/gender-page.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { ProductPageComponent } from "./pages/product-page/product-page.component";

export const storeFrontRoutes: Routes = [
    {
        path: '',
        component: StoreFrontLayout,
        children: [
            {
                path: '',
                component: HomePageComponent
            },
            {
                path: 'gender/:gender',
                component: GenderPageComponent
            },
            {
                path: 'product/:idSlug',
                component: ProductPageComponent
            },
            {
                path: '**',
                loadComponent: () => import('./pages/not-found-page/not-found-page.component').then(route => route.NotFoundPageComponent)            
            }
        ]
    },
    {
        path: "**",
        redirectTo: ''
    }
]