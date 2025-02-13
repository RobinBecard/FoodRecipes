import { Component } from '@angular/core';
import { Firestore, collection, addDoc, getDocs } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

@Component({
  selector: 'app-protected',
  templateUrl: './protected.component.html',
  styleUrls: ['./protected.component.css']
})
export class ProtectedComponent {
  testData: any[] = [];
  message: string = '';

  constructor(private firestore: Firestore, private auth: Auth, private router: Router) {
    this.fetchTestData();
  }

  async fetchTestData() {
    try {
      const querySnapshot = await getDocs(collection(this.firestore, 'testData'));
      this.testData = querySnapshot.docs.map(doc => doc.data());
    } catch (error: any) {
      this.message = 'Erreur lors de la récupération des données : ' + error.message;
    }
  }

  async addTestData() {
    try {
      await addDoc(collection(this.firestore, 'testData'), { value: 'Nouvelle donnée', timestamp: new Date() });
      this.message = 'Donnée ajoutée avec succès !';
      this.fetchTestData();
    } catch (error: any) {
      this.message = 'Erreur lors de l'ajout de la donnée : ' + error.message;
    }
  }

  logout() {
    this.auth.signOut().then(() => this.router.navigate(['/login']));
  }
}

