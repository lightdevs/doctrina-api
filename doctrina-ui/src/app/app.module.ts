import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Interceptor } from './core/interceptor/interceptor';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GraphQLModule } from './graphql.module';
import {APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';
import {ApolloClient, DefaultOptions, InMemoryCache} from '@apollo/client/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import {ProfileModule} from './features/profile/profile.module';
import {ScheduleModule} from "./features/schedule/schedule.module";
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { SchedulerModule } from 'angular-calendar-scheduler';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

const myDefaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule.forRoot(),
    GraphQLModule,
    LoadingBarHttpClientModule,
    LoadingBarRouterModule,
    ProfileModule,
    ScheduleModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
      {
        provide: APOLLO_OPTIONS,
        useFactory: (httpLink: HttpLink) => {
          return {
            cache: new InMemoryCache(),
            defaultOptions: myDefaultOptions,
            link: httpLink.create({
              uri: 'http://localhost:5000/graphql',
            }),
          };
        },
        deps: [HttpLink],
      },
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}
