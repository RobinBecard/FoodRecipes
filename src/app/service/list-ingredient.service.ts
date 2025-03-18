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
  userId: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ListIngredientService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  // Enregistrer une nouvelle liste d'ingrédients
  async saveIngredientList(name: string, ingredients: Ingredient[]): Promise<string> {
    const authUser = this.auth.currentUser;
    if (!authUser) {
      throw new Error("Utilisateur non authentifié");
    }

    const listRef = collection(this.firestore, 'ingredientLists');

    const newList: IngredientList = {
      name,
      ingredients,
      userId: authUser.uid, // Récupération de l'UID
      createdAt: new Date()
    };

    const docRef = await addDoc(listRef, newList);
    return docRef.id;
  }

  // Récupérer les listes d'ingrédients de l'utilisateur
  getUserLists(): Observable<IngredientList[]> {
    return user(this.auth).pipe(
      switchMap(authUser => {
        if (!authUser) {
          throw new Error("Utilisateur non authentifié");
        }
        const listsRef = collection(this.firestore, 'ingredientLists');
        const q = query(listsRef, where('userId', '==', authUser.uid));
        return collectionData(q, { idField: 'id' }) as Observable<IngredientList[]>;
      })
    );
  }

  // Supprimer une liste d'ingrédients
  async deleteList(listId: string): Promise<void> {
    const listDocRef = doc(this.firestore, 'ingredientLists', listId);
    return setDoc(listDocRef, { deleted: true }, { merge: true });
  }
}
