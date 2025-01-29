import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { NonAuthGuard } from '../app/guards/non-auth.guard';
import { MainComponent } from './common/main/main.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleauthGuard } from './guards/role-auth.guard';
import { RegisterComponent } from '@auth/register/register.component';
import { ForgotPasswordComponent } from '@auth/forgot-password/forgot-password.component';
import { RecoverPasswordComponent } from '@auth/recover-password/recover-password.component';

export const routes: Routes = [

    // {
    //     path: '',
    //     redirectTo: 'login',
    //     pathMatch:'full'
    // },




    {
        path: '',
        component: MainComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                canActivate: [RoleauthGuard],
                canActivateChild: [RoleauthGuard],
                loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
            },
            {
                path: 'users',
                canActivate: [RoleauthGuard],
                canActivateChild: [RoleauthGuard],
                loadChildren: () => import('@modules/users/users.module').then(m => m.UsersModule)
            },
            // {
            //     path: 'bank',
            //     canActivate: [RoleauthGuard],
            //     canActivateChild: [RoleauthGuard],
            //     loadChildren: () => import('@modules/bank/bank.module').then(m => m.BankModule)
            // },
            // {
            //     path: 'report',
            //     canActivate: [RoleauthGuard],
            //     canActivateChild: [RoleauthGuard],
            //     loadChildren: () => import('@modules/report/report.module').then(m => m.ReportModule)
            // },
            // {
            //     path: 'creator',
            //     canActivate: [RoleauthGuard],
            //     canActivateChild: [RoleauthGuard],
            //     loadChildren: () => import('@modules/creator/creator.module').then(m => m.CreatorModule)
            // },
            // {
            //     path: 'promo',
            //     canActivate: [RoleauthGuard],
            //     canActivateChild: [RoleauthGuard],
            //     loadChildren: () => import('@modules/promo/promo.module').then(m => m.PromoModule)
            // },
            // {
            //     path:'crmissuetracker',
            //     canActivate: [RoleauthGuard],
            //     canActivateChild: [RoleauthGuard],
            //     loadChildren: () => import('@modules/crm/crm.module').then(m => m.CrmModule)
            // },
            {
                path: 'viptemp',
                canActivate: [RoleauthGuard],
                canActivateChild: [RoleauthGuard],
                loadChildren: () => import('@modules/viptemp/viptemp.module').then(m=>m.ViptempModule)
            }
            // ,
            // {
            //     path: 'leads',
            //     canActivate: [RoleauthGuard],
            //     canActivateChild: [RoleauthGuard],
            //     loadChildren: () => import('@modules/leads/leads.module').then(m=>m.LeadsModule)
            // }
        ]
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'change-password',
        component: RecoverPasswordComponent,
        canActivate: [AuthGuard]
    },
    {path: '**', redirectTo: ''}
];
