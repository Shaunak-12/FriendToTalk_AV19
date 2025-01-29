import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NonAuthGuard } from '../guards/non-auth.guard';

const routes: Routes = [

    //  {
    //         path: 'login',
    //         component:LoginComponent,
    //         canActivate: [NonAuthGuard]
    //     },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AuthRoutingModule { }