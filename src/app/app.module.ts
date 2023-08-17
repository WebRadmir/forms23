import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from './shared/shared.module';

import { CreatePostModule } from './components/create-post/create-post.module';
import { PostTableModule } from './components/post-table/post-table.module';
import { RegistrationFormModule } from './components/registration-form/registration-form.module';
import { LoginFormModule } from './components/login-form/login-form.module';
import { LoginPageModule } from './pages/login-page/login-page.module';
import { NotFoundPageModule } from './pages/not-found-page/not-found-page.module';
import { RegistrationPageModule } from './pages/registration-page/registration-page.module';
import { TablePageModule } from './pages/table-page/table-page.module';
import { HttpClientsModule } from './services/httpClients/http-clients.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    LoginFormModule,
    CreatePostModule,
    PostTableModule,
    RegistrationFormModule,
    LoginPageModule,
    NotFoundPageModule,
    RegistrationPageModule,
    TablePageModule,
    HttpClientsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
