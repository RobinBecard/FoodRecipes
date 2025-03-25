import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, addDoc, docData, deleteDoc, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Ingredient, IngredientList } from '../models/ingredient.model';
import { Auth, user } from '@angular/fire/auth';
import { switchMap } from 'rxjs/operators';

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
    const newList:Omit<IngredientList, 'id'>  = {
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

  // Ajouter cette méthode dans votre ListIngredientService
async updateList(listId: string, name: string, ingredients: Ingredient[]): Promise<void> {
  const authUser = this.auth.currentUser;
  if (!authUser) {
    throw new Error("Utilisateur non authentifié");
  }
  
  const listDocRef = doc(this.firestore, `users/${authUser.uid}/lists`, listId);
  return setDoc(listDocRef, {
    name,
    ingredients,
    updatedAt: new Date()
  }, { merge: true });
}

  // Ajouter cette méthode dans votre ListIngredientService
  getListById(listId: string): Observable<IngredientList> {
    return user(this.auth).pipe(
      switchMap(authUser => {
        if (!authUser) {
          throw new Error("Utilisateur non authentifié");
        }
        const listDocRef = doc(this.firestore, `users/${authUser.uid}/lists`, listId);
        return docData(listDocRef) as Observable<IngredientList>;
      })
    );
  }

  // Supprimer une liste d'ingrédients
  async deleteList(listId: string): Promise<void> {
    const authUser = this.auth.currentUser;
    if (!authUser) {
      throw new Error("Utilisateur non authentifié");
    }
  
    // Référence du document dans Firestore
    const listDocRef = doc(this.firestore, `users/${authUser.uid}/lists`, listId);
  
    // Suppression complète du document
    return deleteDoc(listDocRef);
  }

  async deleteAllList(): Promise<void> {
    const authUser = this.auth.currentUser;
    if (!authUser) {
      throw new Error('Utilisateur non authentifié');
    }
  
    const collectionRef = collection(this.firestore, `users/${authUser.uid}/lists`);
    const allDocQuery = await getDocs(collectionRef);
  
    for (const docSnap of allDocQuery.docs) {
      const docRef = doc(this.firestore, `users/${authUser.uid}/lists`, docSnap.id);
      await deleteDoc(docRef); 
    }
  }
  
}
