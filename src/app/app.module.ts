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
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RouterModule } from '@angular/router';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { AppComponent } from './app.component';
import { BodyComponent } from './components/body/body.component';
import { BottomBarComponent } from './components/bottom-bar/bottom-bar.component';
import { ButtonLogOutComponent } from './components/button-log-out/button-log-out.component';
import { DescriptionComponent } from './components/description/description';
import { FilterComponent } from './components/filter/filter.component';
import { IngredientCardComponent } from './components/ingredient-card/ingredient-card.component';
import { ListDescriptionComponent } from './components/list-description/list-description.component';
import { ListSidenavComponent } from './components/list-sidenav/list-sidenav.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { ModifyListIngredientComponent } from './components/modify-list-ingredient/modify-list-ingredient.component';
import { PageListIngredientComponent } from './components/page-list-ingredient/page-list-ingredient.component';
import { ProfilePopupComponent } from './components/profile-popup/profile-popup.component';
import { SignUpComponent } from './components/signUp/signUp.component';
import { SimplifiedCardComponent } from './components/simplified-card/simplified-card.component';
import { TestInfoLogComponent } from './components/test-info-log/test-info-log.component';
import { ApiTestComponent } from './components/test/api-test.component';
import { AppRoutingModule } from './routes/app-routing.module';
import { VideoplayerComponent } from './videoplayer/videoplayer.component';
import { environment } from './environments/environment';


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
    ApiTestComponent,
    SimplifiedCardComponent,
    ModifyListIngredientComponent,
    DescriptionComponent,
    BottomBarComponent,
    ProfilePopupComponent,
    FilterComponent,
    VideoplayerComponent,
    ListDescriptionComponent,
    IngredientCardComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    ScrollingModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatToolbarModule,
    MatTooltipModule,
    RouterModule,
    ScrollingModule,
    MatDialogModule,
    YouTubePlayerModule,
  ],
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
})
export class AppModule {}
