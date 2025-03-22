import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { FilterState } from '../../models/filter.model';
import { IngredientList } from '../../models/ingredient.model';
import { Meal } from '../../models/meal.model';
import { ApiService } from '../../service/api.service';
import { FilterService } from '../../service/filter.service';

@Component({
  selector: 'app-filter',
  standalone: false,
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
})
export class FilterComponent implements OnInit, OnDestroy {
  @Input() ingredientsList: IngredientList[] = []; // Liste des listes ingrédients
  @Input() recipesList: Meal[] = []; // Liste de recettes filtrées
  @Output() recipesListChange = new EventEmitter<Meal[]>();

  categories: string[] = [];
  regions: string[] = [];

  alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Options de filtrage
  searchControl = new FormControl(''); // pour la recherche
  selectedCategory = new FormControl(''); // pour les catégories
  selectedRegion = new FormControl(''); // pour les régions
  selectedIngredientsList = new FormControl(''); // pour les listes d'ingrédients
  selectedLetter = new FormControl(''); // pour les lettres

  // Collection des subscriptions
  private subscriptions: Subscription[] = [];

  constructor(
    private filterService: FilterService,
    private mealService: ApiService
  ) {}

  ngOnInit(): void {
    // Charger les catégories
    this.subscriptions.push(
      this.mealService.getAllMealCategories().subscribe((categories) => {
        this.categories = categories.map((cat) => cat.strCategory);
      })
    );

    // Charger les régions
    this.subscriptions.push(
      this.mealService.getAllAreas().subscribe((areas) => {
        this.regions = areas;
      })
    );

    // Charger des recettes aléatoires
    this.subscriptions.push(
      this.filterService.loadRandomMeals(15).subscribe((meals) => {
        this.recipesList = meals;
      })
    );

    // Observer les changements de la recherche
    this.subscriptions.push(
      this.searchControl.valueChanges
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe((term) => {
          // Réinitialiser les autres filtres exclusifs
          this.selectedIngredientsList.setValue('', { emitEvent: false });
          this.selectedLetter.setValue('', { emitEvent: false });
          this.filterService.setFilter('ingredientsList', '', false);
          this.filterService.setFilter('letter', '', false);

          if (term && term.length > 1) {
            this.filterService.setFilter('search', term, true);
          } else {
            this.searchControl.setValue('', { emitEvent: false });
            this.filterService.setFilter('search', '', false);
          }
          this.updateRecipesList();
        })
    );

    // Observer les changements de catégories, de régions, de lettres et de listes d'ingrédients
    this.observeChanges(this.selectedCategory, 'category');
    this.observeChanges(this.selectedRegion, 'region');
    this.observeChanges(this.selectedLetter, 'letter', true);
    this.observeChanges(this.selectedIngredientsList, 'ingredientsList', true);
  }

  private observeChanges(
    control: FormControl,
    nom: 'category' | 'region' | 'letter' | 'ingredientsList',
    exclusions: boolean = false
  ): void {
    const subscription = control.valueChanges.subscribe((value) => {
      if (exclusions) {
        // Réinitialiser les autres filtres exclusifs sans déclencher d'événements
        const exclusifs = ['letter', 'ingredientsList', 'search'];
        const autresFiltres = exclusifs.filter((name) => name !== nom);
        autresFiltres.forEach((name) => {
          this.filterService.setFilter(name as keyof FilterState, '', false);
          if (name === 'letter') {
            this.selectedLetter.setValue('', { emitEvent: false });
          } else if (name === 'ingredientsList') {
            this.selectedIngredientsList.setValue('', { emitEvent: false });
          } else if (name === 'search') {
            this.searchControl.setValue('', { emitEvent: false });
          }
        });
      }

      if (value && value.length > 0) {
        this.filterService.setFilter(nom, value, true);
      } else {
        if (nom == 'letter') {
          // Ne pas déclencher un nouvel événement lors de cette réinitialisation
          this.selectedLetter.setValue('', { emitEvent: false });
        } else if (nom == 'ingredientsList') {
          this.selectedIngredientsList.setValue('', { emitEvent: false });
        }
        this.filterService.setFilter(nom, '', false);
      }

      // Mise à jour de la liste des recettes
      this.updateRecipesList();
    });

    // Ajouter cet abonnement à la liste des subscriptions
    this.subscriptions.push(subscription);
  }

  updateRecipesList(): void {
    const subscription = this.filterService
      .applyFilters()
      .subscribe((meals) => {
        // Si aucun filtre n'est actif, charger des recettes aléatoires
        if (meals.length === 0 && !this.hasActiveFilters()) {
          const randomSubscription = this.filterService
            .loadRandomMeals(15)
            .subscribe((randomMeals) => {
              this.recipesList = randomMeals;
              this.recipesListChange.emit(this.recipesList); // Notifier le parent
            });
          this.subscriptions.push(randomSubscription);
        } else {
          this.recipesList = meals;
          this.recipesListChange.emit(this.recipesList); // Notifier le parent
        }
      });
    this.subscriptions.push(subscription);
  }

  hasActiveFilters(): boolean {
    const filters = this.filterService.filterState;
    return Object.values(filters).some((filter) => filter.active);
  }

  ngOnDestroy(): void {
    // Désinscrire toutes les subscriptions pour éviter les fuites mémoire
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
