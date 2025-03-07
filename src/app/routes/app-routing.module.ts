import { NgModule } from '@angular/core';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { MainComponent } from '../components/main/main.component';
import { SignUpComponent } from '../components/signUp/signUp.component';

const redirectLoggedInToMain = () => redirectLoggedInTo(['main']);
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'login',
    component: LoginComponent,
    ...canActivate(redirectLoggedInToMain),
  },
  {
    path: 'main',
    component: MainComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  { path: 'Register', component: SignUpComponent },
  { path: 'api-test', component: ApiTestComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
