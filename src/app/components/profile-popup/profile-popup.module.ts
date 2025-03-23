import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; 
import { MatDialogModule } from '@angular/material/dialog';
import { ProfilePopupComponent } from './profile-popup.component';

@NgModule({
  declarations: [ProfilePopupComponent],
  imports: [
    CommonModule,         
    ReactiveFormsModule,  
    MatDialogModule      
  ],
  exports: [ProfilePopupComponent]
})
export class ProfilePopupModule {}
