import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { SignUpComponent } from '../components/signUp/signUp.component';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { MainComponent } from '../components/main/main.component';
import { PageListIngredientComponent } from '../components/page-list-ingredient/page-list-ingredient.component';


const redirectLoggedInToMain = () => redirectLoggedInTo(['main']);
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  {path:"",component:LoginComponent},
  {path:'login',component:LoginComponent,...canActivate(redirectLoggedInToMain)},
  {path:'main', component:MainComponent,...canActivate(redirectUnauthorizedToLogin)},
  {path:"Register",component:SignUpComponent},
  {path:"CreateList",component:PageListIngredientComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}