import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { HomeComponent } from './home/home.component';

//path:'' -> la page par défaut au lancement de l'application
const routes: Routes = [//{path: '', component: HomeComponent }, 
                        {path:"",component:LoginComponent},
                        {path:"Register",component:SignInComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}