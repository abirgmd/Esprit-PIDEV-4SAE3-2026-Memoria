import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    console.log('Application bootstrapped successfully');
    const indicator = document.getElementById('loading-indicator');
    if (indicator) indicator.remove();
  })
  .catch((err) => {
    console.error('Bootstrap error:', err);
    const indicator = document.getElementById('loading-indicator');
    if (indicator) indicator.remove();

    const errorDiv = document.createElement('div');
    errorDiv.style.padding = '20px';
    errorDiv.style.color = 'red';
    errorDiv.style.fontFamily = 'monospace';
    errorDiv.innerHTML = `<h1>Application Error</h1><pre>${err.stack || err.message || err}</pre>`;
    document.body.appendChild(errorDiv);
  });
