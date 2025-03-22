import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, deleteDoc, query, getDocs } from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { Meal } from '../models/meal.model';
import { Auth } from '@angular/fire/auth';
import { switchMap, map, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FavoriteRecipesService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  async addToFavorites(recipe: Meal): Promise<void> {
    const authUser = this.auth.currentUser;
    if (!authUser) {
      console.error('User not authenticated');
      throw new Error("User not authenticated");
    }

    console.log('Adding recipe to favorites:', recipe.idMeal);
    
    const favoritesRef = doc(this.firestore, `users/${authUser.uid}/favorites/${recipe.idMeal}`);

    return setDoc(favoritesRef, {
      idMeal: recipe.idMeal,
      strMeal: recipe.strMeal,
      strCategory: recipe.strCategory,
      strArea: recipe.strArea,
      strMealThumb: recipe.strMealThumb,
      addedAt: new Date()
    });
  }

  async removeFromFavorites(recipeId: string): Promise<void> {
    const authUser = this.auth.currentUser;
    if (!authUser) {
      console.error('User not authenticated');
      throw new Error("User not authenticated");
    }

    console.log('Removing recipe from favorites:', recipeId);

    const recipeDocRef = doc(this.firestore, `users/${authUser.uid}/favorites/${recipeId}`);
    
    return deleteDoc(recipeDocRef);
  }

  // Récupérer les recettes favorites du user
  getFavoriteRecipes(): Observable<Meal[]> {
    return from(this.getAuthenticatedUser()).pipe(
      switchMap(authUser => {
        if (!authUser) {
          console.log('No authenticated user, returning empty favorites list');
          return of([]);
        }

        console.log('Getting favorites for user:', authUser.uid);
        
        const favoritesRef = collection(this.firestore, `users/${authUser.uid}/favorites`);
        return collectionData(favoritesRef, { idField: 'idMeal' }) as Observable<Meal[]>;
      }),
      tap(favorites => console.log('Favorites loaded:', favorites.length)),
      catchError(error => {
        console.error('Error getting favorite recipes:', error);
        return of([]);
      })
    );
  }

  async checkRecipeFavorited(recipeId: string): Promise<boolean> {
    const authUser = this.auth.currentUser;
    if (!authUser) {
      console.log('No authenticated user for favorite check');
      return false;
    }
  
    console.log('Checking if recipe is favorited (one-time check):', recipeId);
  
    const recipeDocRef = doc(this.firestore, `users/${authUser.uid}/favorites/${recipeId}`);
    
    try {
      const docSnap = await getDocs(collection(this.firestore, `users/${authUser.uid}/favorites`));
      return docSnap.docs.some(doc => doc.id === recipeId); // Vérifie si l'ID du document existe
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  }

  // Toggle favorite status (without using real-time observables)
  toggleFavorite(recipe: Meal): Observable<boolean> {
    console.log('Service: Toggling favorite for recipe:', recipe.idMeal);

    return from(this.checkRecipeFavorited(recipe.idMeal)).pipe(
      tap(status => console.log('Service: Current favorite status before toggle:', status)),
      switchMap(isFavorited => {
        if (isFavorited) {
          return from(this.removeFromFavorites(recipe.idMeal)).pipe(
            map(() => false),
            tap(() => console.log('Service: Recipe removed from favorites')),
            catchError(err => {
              console.error('Service: Error removing from favorites:', err);
              return of(isFavorited);
            })
          );
        } else {
          return from(this.addToFavorites(recipe)).pipe(
            map(() => true),
            tap(() => console.log('Service: Recipe added to favorites')),
            catchError(err => {
              console.error('Service: Error adding to favorites:', err);
              return of(isFavorited);
            })
          );
        }
      })
    );
  }

  // Helper function to get the authenticated user
  private async getAuthenticatedUser() {
    return this.auth.currentUser;
  }
}
