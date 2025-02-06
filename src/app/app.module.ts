import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp({"projectId":"foodrecipes-2aa22","appId":"1:884813621746:web:33a2d8b48d913f4dc3636b","storageBucket":"foodrecipes-2aa22.firebasestorage.app","apiKey":"AIzaSyCX8mcEGxhnFox8kfUBQsE3tTzJKdExp6c","authDomain":"foodrecipes-2aa22.firebaseapp.com","messagingSenderId":"884813621746"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
