import { Routes } from '@angular/router';
import { HomeComponent } from './main/home/home.component';
import { LoginComponent } from './main/auth/login/login.component';
import { RegisterComponent } from './main/auth/register/register.component';
import { ShoppingCartComponent } from './main/shopping-cart/shopping-cart.component';
import { ProductComponent } from './main/product/product.component';
import { OrdersComponent } from './main/orders/orders.component';
import { OrderSuccessComponent } from './main/orders/order-success/order-success.component';
import { isAdmin } from './route-guards/admin-guard';
import { isAuthenticated, isNotAuthenticated } from './route-guards/auth-guard';
import { OrderHistoryComponent } from './main/order-history/order-history.component';
import { UserInfoComponent } from './main/user-info/user-info.component';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent
    },
    {
        path: "login",
        component: LoginComponent,
        canMatch: [isNotAuthenticated]
    },
    {
        path: "register",
        component: RegisterComponent,
        canMatch: [isNotAuthenticated]
    },
    {
        path: "cart",
        component: ShoppingCartComponent
    },
    {
        path: "admin",
        loadComponent: () => import('./main/admin-panel/admin-panel.component').then(m => m.AdminPanelComponent),
        canActivate: [AdminGuard],
        children: [
            {
                path: '',
                redirectTo: 'overview',
                pathMatch: 'full'
            },
            {
                path: 'overview',
                loadComponent: () => import('./main/admin-panel/overview/overview.component').then(m => m.OverviewComponent)
            },
            {
                path: 'edit/:id',
                loadComponent: () => import('./main/admin-panel/edit-mode/edit-mode.component').then(m => m.EditModeComponent)
            },
            {
                path: 'create',
                loadComponent: () => import('./main/admin-panel/edit-mode/edit-mode.component').then(m => m.EditModeComponent)
            }
        ]
    },
    {
        path: "product/:id",
        component: ProductComponent
    },
    {
        path: 'order',
        canMatch: [isAuthenticated],
        component: OrdersComponent
    },
    {
        path: 'order-success',
        canMatch: [isAuthenticated],
        component: OrderSuccessComponent
    },
    {
        path: 'order-history',
        canMatch: [isAuthenticated],
        component: OrderHistoryComponent
    },
    {
        path: 'profile',
        component: UserInfoComponent,
        canMatch: [isAuthenticated]
    }
];