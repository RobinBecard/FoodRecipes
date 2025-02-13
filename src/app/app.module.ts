import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './routes/app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from './material.module';
import { BodyComponent } from './components/body/body.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ListSidenavComponent } from './components/list-sidenav/list-sidenav.component';
import { LoginComponent } from './components/login/login.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { TestInfoLogComponent } from './components/test-info-log/test-info-log.component';

import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ButtonLogOutComponent } from './components/button-log-out/button-log-out.component';

@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    SidenavComponent,
    ListSidenavComponent,
    LoginComponent,
    SignInComponent,
    TestInfoLogComponent,
    ButtonLogOutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp({"projectId":"foodrecipes-2aa22","appId":"1:884813621746:web:33a2d8b48d913f4dc3636b","storageBucket":"foodrecipes-2aa22.firebasestorage.app","apiKey":"AIzaSyCX8mcEGxhnFox8kfUBQsE3tTzJKdExp6c","authDomain":"foodrecipes-2aa22.firebaseapp.com","messagingSenderId":"884813621746"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
