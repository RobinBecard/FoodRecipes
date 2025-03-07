import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RouterLink } from '@angular/router';
import { AppComponent } from './app.component';
import { BodyComponent } from './components/body/body.component';
import { ButtonLogOutComponent } from './components/button-log-out/button-log-out.component';
import { ListSidenavComponent } from './components/list-sidenav/list-sidenav.component';
import { LoginComponent } from './components/login/login.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { SignUpComponent } from './components/signUp/signUp.component';
import { TestInfoLogComponent } from './components/test-info-log/test-info-log.component';
import { ApiTestComponent } from './components/test/api-test.component';
import { MaterialModule } from './material.module';
import { AppRoutingModule } from './routes/app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    SidenavComponent,
    ListSidenavComponent,
    LoginComponent,
    SignUpComponent,
    TestInfoLogComponent,
    ButtonLogOutComponent,
    ApiTestComponent,
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
    RouterLink,
    DragDropModule,
  ],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
