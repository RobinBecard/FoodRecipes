import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { SignUpComponent } from '../components/signUp/signUp.component';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { SidenavComponent } from '../components/sidenav/sidenav.component';

const redirectLoggedInToSidenav = () => redirectLoggedInTo(['sidenav']);
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  {path:"",component:LoginComponent},
  {path:'login',component:LoginComponent,...canActivate(redirectLoggedInToSidenav)},
  {path:'sidenav', component:SidenavComponent,...canActivate(redirectUnauthorizedToLogin)},
  {path:"Register",component:SignUpComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}