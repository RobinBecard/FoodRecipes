import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './routes/app-routing.module';
import { AppComponent } from './app.component';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from './material.module';
import { BodyComponent } from './components/body/body.component';
import { MainComponent } from './components/main/main.component';
import { ListSidenavComponent } from './components/list-sidenav/list-sidenav.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/signUp/signUp.component';
import { TestInfoLogComponent } from './components/test-info-log/test-info-log.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonLogOutComponent } from './components/button-log-out/button-log-out.component';
import { RouterLink, RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { BottomBarComponent } from './components/bottom-bar/bottom-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    MainComponent,
    ListSidenavComponent,
    LoginComponent,
    SignUpComponent,
    TestInfoLogComponent,
    ButtonLogOutComponent,
    BottomBarComponent
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    DragDropModule,
    ScrollingModule,
    MatToolbarModule,
    MatIconModule 
  ],
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    provideFirebaseApp(() =>
        initializeApp({
          projectId: 'foodrecipes-2aa22',
          appId: '1:884813621746:web:33a2d8b48d913f4dc3636b',
          storageBucket: 'foodrecipes-2aa22.firebasestorage.app',
          apiKey: 'AIzaSyCX8mcEGxhnFox8kfUBQsE3tTzJKdExp6c',
          authDomain: 'foodrecipes-2aa22.firebaseapp.com',
          messagingSenderId: '884813621746',
        })
      ),
      provideAuth(() => getAuth()),
      provideFirestore(() => getFirestore()),
  ],
})
export class AppModule {}
