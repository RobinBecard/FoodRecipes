import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RouterLink, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BodyComponent } from './components/body/body.component';
import { BottomBarComponent } from './components/bottom-bar/bottom-bar.component';
import { ButtonLogOutComponent } from './components/button-log-out/button-log-out.component';
import { DescriptionComponent } from './components/description/description';
import { ListSidenavComponent } from './components/list-sidenav/list-sidenav.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { PageListIngredientComponent } from './components/page-list-ingredient/page-list-ingredient.component';
import { SignUpComponent } from './components/signUp/signUp.component';
import { SimplifiedCardComponent } from './components/simplified-card/simplified-card.component';
import { TestInfoLogComponent } from './components/test-info-log/test-info-log.component';
import { ApiTestComponent } from './components/test/api-test.component';
import { ModifyListIngredientComponent } from './modify-list-ingredient/modify-list-ingredient.component';
import { AppRoutingModule } from './routes/app-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { VideoplayerComponent } from './videoplayer/videoplayer.component';

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
    PageListIngredientComponent,
    BottomBarComponent,
    ApiTestComponent,
    SimplifiedCardComponent,
    ModifyListIngredientComponent,
    DescriptionComponent,
    VideoplayerComponent
  ],
  bootstrap: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    DragDropModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatToolbarModule,
    MatIconModule,
    MatTooltipModule,
    ReactiveFormsModule,
    RouterLink,
    RouterModule,
    ScrollingModule,
    MatDialogModule ,
    YouTubePlayerModule 
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
