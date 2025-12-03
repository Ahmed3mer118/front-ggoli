import { importProvidersFrom } from '@angular/core';
import { provideToastr } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const ToastrProviders = [
  importProvidersFrom(BrowserAnimationsModule),
  provideToastr({
    timeOut: 3000,
    positionClass: 'toast-bottom-right',
    preventDuplicates: true,
  }),
];
