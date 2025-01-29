import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

if (environment.production) {
  enableProdMode();
}

(window as any).PF = {
  config: {
    mode: 'bs4'
  }
};

// org code
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));





// Add provideHttpClient() to appConfig's providers
// bootstrapApplication(AppComponent, {
//   ...appConfig,
//   providers: [
//     ...(appConfig.providers || []), // Preserve existing providers
//     provideHttpClient(), // Add HttpClient provider
//   ],
// }).catch((err) => console.error(err));



// Add provideHttpClient directly to the bootstrap configuration
// bootstrapApplication(AppComponent, {
//   providers: [
//     provideHttpClient(), // Register HttpClient provider globally
//   ],
// },).catch((err) => console.error(err));