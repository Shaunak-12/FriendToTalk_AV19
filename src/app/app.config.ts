
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
// import { reducers } from './store/ui/reducer';

// import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { FeatherModule } from 'angular-feather';

import { allIcons } from 'angular-feather/icons';
import { provideStore } from '@ngrx/store';
// import { reducers } from './store/reducers ';
import { uiReducer } from '@/store/ui/reducer';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import {provideToastr} from 'ngx-toastr';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  // providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(withEventReplay()), provideAnimationsAsync()]

  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes),
  provideHttpClient(withFetch()),
  importProvidersFrom(FeatherModule.pick(allIcons)),
  provideStore(),
  // provideStore(reducers),
  // { provide: BrowserAnimationsModule, useClass: BrowserAnimationsModule },
  provideAnimations(),
  provideStore({ ui: uiReducer }),
  provideToastr(),
  { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: { disabled: true } } // Disable ripples globally



  ]

};
