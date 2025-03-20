import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, addDoc, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Ingredient } from '../models/ingredient.model';
import { Auth, user } from '@angular/fire/auth';
import { switchMap } from 'rxjs/operators';

export interface IngredientList {
  id?: string;
  name: string;
  ingredients: Ingredient[];
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ListIngredientService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  // Enregistrer une nouvelle liste d'ingrédients dans une sous-collection de l'utilisateur
  async saveIngredientList(name: string, ingredients: Ingredient[]): Promise<string> {
    const authUser = this.auth.currentUser;
    if (!authUser) {
      throw new Error("Utilisateur non authentifié");
    }

    // Utilisation de l'UID de l'utilisateur pour organiser ses listes
    const userListsRef = collection(this.firestore, `users/${authUser.uid}/lists`);

    // Création de l'objet liste
    const newList: IngredientList = {
      name,
      ingredients,
      createdAt: new Date()
    };

    // Ajout du document dans la sous-collection
    const docRef = await addDoc(userListsRef, newList);
    return docRef.id;
  }

  // Récupérer les listes d'ingrédients de l'utilisateur
  getUserLists(): Observable<IngredientList[]> {
    return user(this.auth).pipe(
      switchMap(authUser => {
        if (!authUser) {
          throw new Error("Utilisateur non authentifié");
        }

        // On récupère toutes les listes dans `/users/{UID}/lists`
        const listsRef = collection(this.firestore, `users/${authUser.uid}/lists`);
        return collectionData(listsRef, { idField: 'id' }) as Observable<IngredientList[]>;
      })
    );
  }

  // Supprimer une liste d'ingrédients
  async deleteList(listId: string): Promise<void> {
    const authUser = this.auth.currentUser;
    if (!authUser) {
      throw new Error("Utilisateur non authentifié");
    }

    // Référence du document dans `/users/{UID}/lists/{listId}`
    const listDocRef = doc(this.firestore, `users/${authUser.uid}/lists`, listId);

    return setDoc(listDocRef, { deleted: true }, { merge: true });
  }
}
