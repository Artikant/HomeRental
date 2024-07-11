import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule,provideHttpClient,withFetch } from '@angular/common/http';  
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { ApiService } from './api.service';
import { NgxSliderModule,Options } from '@angular-slider/ngx-slider';
import { FormsModule, NgForm } from '@angular/forms';
import { SocialLoginModule, SocialAuthServiceConfig, SocialAuthService } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { SocialAuthServiceWrapper } from './social-auth.service';
import { PropertyDetails } from './property.service';
import { ChatService } from './chat.service';
import { PaymentService } from './payment.service';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),NgForm, provideClientHydration(),provideHttpClient(withFetch()),
    ApiService,NgxSliderModule,Options,FormsModule,SocialLoginModule,SocialAuthServiceWrapper,SocialAuthService,PropertyDetails,ChatService,
    PaymentService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('85510781226-o3dd7fis147sg184ouh4176nt6c17gav.apps.googleusercontent.com')
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ]
};
