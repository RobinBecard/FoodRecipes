import { NgModule } from '@angular/core';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { MainComponent } from '../components/main/main.component';
import { PageListIngredientComponent } from '../components/page-list-ingredient/page-list-ingredient.component';

import { SignUpComponent } from '../components/signUp/signUp.component';
import { ApiTestComponent } from '../components/test/api-test.component';
import { ModifyListIngredientComponent } from '../modify-list-ingredient/modify-list-ingredient.component';

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
    path: 'Register',
    component: SignUpComponent,
    ...canActivate(redirectLoggedInToMain),
  },
  {
    path: 'main',
    component: MainComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  { path: 'api-test', component: ApiTestComponent },
  { path: 'CreateList', component: PageListIngredientComponent },
  { path: 'EditList/:id', component: ModifyListIngredientComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
