import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module'

import { DashboardRoutingModule } from './dashboard-routing.module';
import { MyDashboardComponent } from './my-dashboard/my-dashboard.component';
// import { DashboardComponent } from './dashboard.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AnalyticsComponent } from './analytics/analytics.component';


@NgModule({
  declarations: [
    // MyDashboardComponent,
    // AnalyticsComponent,
    // DashboardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule,
    MatProgressSpinnerModule
  ]
})
export class DashboardModule { }
