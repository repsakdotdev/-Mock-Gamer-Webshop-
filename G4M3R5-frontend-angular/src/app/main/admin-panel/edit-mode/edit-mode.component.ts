import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { ToastService } from '../../../services/toast.service';
import { Category } from '../../../models/category.model';
import { PreviewImage } from '../../../models/preview-image.model';
import { Property } from '../../../models/property.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-mode',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './edit-mode.component.html',
  styleUrl: './edit-mode.component.scss'
})
export class EditModeComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private toastService = inject(ToastService);

  productForm: FormGroup;
  categories: any[] = [];
  isLoading = true;
  isSaving = false;
  isCreating = false;
  productId: number | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  newCategoryMode = false;
  newCategoryForm: FormGroup;

  // New properties for handling temporary inputs
  newPreviewImageMode = false;
  newPreviewImageForm: FormGroup;
  
  newPropertyMode = false;
  newPropertyForm: FormGroup;

  constructor() {
    // Initialize form with empty values
    this.productForm = this.fb.group({
      nameDutch: ['', Validators.required],
      nameEnglish: ['', Validators.required],
      descriptionDutch: ['', Validators.required],
      descriptionEnglish: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      forSale: [true],
      categoryId: ['', Validators.required],
      previewImages: this.fb.array([]),
      properties: this.fb.array([])
    });

    this.newCategoryForm = this.fb.group({
      nameDutch: ['', Validators.required],
      nameEnglish: ['', Validators.required]
    });

    this.newPreviewImageForm = this.fb.group({
      path: ['', Validators.required]
    });

    this.newPropertyForm = this.fb.group({
      nameDutch: ['', Validators.required],
      nameEnglish: ['', Validators.required],
      valueDutch: ['', Validators.required],
      valueEnglish: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    
    // Check if we're creating a new product or editing an existing one
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.productId = +id;
        this.isCreating = false;
        this.loadProduct(this.productId);
      } else {
        this.isCreating = true;
        this.isLoading = false;
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data: any[]) => {
        this.categories = data;
      },
      error: (error: any) => {
        console.error('Error loading categories:', error);
        this.errorMessage = 'Fout bij het laden van categorieën';
        this.toastService.showError('Fout bij het laden van categorieën');
      }
    });
  }

  loadProduct(productId: number): void {
    this.isLoading = true;
    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        this.previewImages.clear();
        this.properties.clear();
        
        this.productForm.patchValue({
          nameDutch: product.nameDutch,
          nameEnglish: product.nameEnglish,
          descriptionDutch: product.descriptionDutch,
          descriptionEnglish: product.descriptionEnglish,
          price: product.price,
          forSale: product.forSale,
          categoryId: product.category.categoryId
        });

        if (product.previewImages && product.previewImages.length > 0) {
          product.previewImages.forEach(image => {
            this.addPreviewImageToForm(image);
          });
        }

        if (product.properties && product.properties.length > 0) {
          product.properties.forEach(prop => {
            this.addPropertyToForm(prop);
          });
        }

        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading product:', error);
        this.errorMessage = 'Fout bij het laden van het product';
        this.toastService.showError('Fout bij het laden van het product');
        this.isLoading = false;
      }
    });
  }

  get previewImages() {
    return this.productForm.get('previewImages') as FormArray;
  }

  get properties() {
    return this.productForm.get('properties') as FormArray;
  }

  // Method to show the new preview image form
  showAddPreviewImageForm(): void {
    this.newPreviewImageMode = true;
    this.newPreviewImageForm.reset();
  }

  // Method to cancel adding a preview image
  cancelAddPreviewImage(): void {
    this.newPreviewImageMode = false;
  }

  // Method to save preview image and add it to form array
  savePreviewImage(): void {
    if (this.newPreviewImageForm.invalid) {
      this.toastService.showError('Vul een geldig pad in voor de afbeelding');
      return;
    }

    const image: PreviewImage = this.newPreviewImageForm.value;
    this.addPreviewImageToForm(image);
    this.newPreviewImageMode = false;
    this.toastService.showSuccess('Afbeelding toegevoegd');
  }

  // Method to actually add the image to the form array
  private addPreviewImageToForm(image: PreviewImage): void {
    this.previewImages.push(this.fb.group({
      path: [image.path, Validators.required]
    }));
  }

  removePreviewImage(index: number): void {
    this.previewImages.removeAt(index);
    this.toastService.showSuccess('Afbeelding verwijderd');
  }

  // Method to show the new property form
  showAddPropertyForm(): void {
    this.newPropertyMode = true;
    this.newPropertyForm.reset();
  }

  // Method to cancel adding a property
  cancelAddProperty(): void {
    this.newPropertyMode = false;
  }

  // Method to save property and add it to form array
  saveProperty(): void {
    if (this.newPropertyForm.invalid) {
      this.toastService.showError('Vul alle verplichte velden in voor de eigenschap');
      return;
    }

    const property: Property = this.newPropertyForm.value;
    this.addPropertyToForm(property);
    this.newPropertyMode = false;
    this.toastService.showSuccess('Eigenschap toegevoegd');
  }

  // Method to actually add the property to the form array
  private addPropertyToForm(property: Property): void {
    this.properties.push(this.fb.group({
      nameDutch: [property.nameDutch, Validators.required],
      nameEnglish: [property.nameEnglish, Validators.required],
      valueDutch: [property.valueDutch, Validators.required],
      valueEnglish: [property.valueEnglish, Validators.required]
    }));
  }

  removeProperty(index: number): void {
    this.properties.removeAt(index);
    this.toastService.showSuccess('Eigenschap verwijderd');
  }

  toggleNewCategoryMode(): void {
    this.newCategoryMode = !this.newCategoryMode;
  }

  createNewCategory(): void {
    if (this.newCategoryForm.invalid) {
      return;
    }

    this.isSaving = true;
    const categoryData = this.newCategoryForm.value;
    
    this.categoryService.createCategory(categoryData).subscribe({
      next: (newCategory: Category) => {
        this.categories.push(newCategory);
        this.productForm.get('categoryId')?.setValue(newCategory.categoryId);
        this.newCategoryMode = false;
        this.newCategoryForm.reset();
        this.isSaving = false;
        this.toastService.showSuccess('Categorie succesvol toegevoegd!');
      },
      error: (error: any) => {
        console.error('Error creating category:', error);
        this.errorMessage = 'Fout bij het aanmaken van de categorie';
        this.toastService.showError('Fout bij het aanmaken van de categorie');
        this.isSaving = false;
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.errorMessage = 'Vul alle verplichte velden in';
      this.toastService.showError('Vul alle verplichte velden in');
      return;
    }

    this.isSaving = true;
    const productData = this.productForm.value;

    if (this.isCreating) {
      // Create new product
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.showSuccess('Product succesvol aangemaakt!');
          this.router.navigate(['/admin/overview']);
        },
        error: (error) => {
          console.error('Error creating product:', error);
          this.errorMessage = 'Fout bij het aanmaken van het product';
          this.toastService.showError('Fout bij het aanmaken van het product');
          this.isSaving = false;
        }
      });
    } else if (this.productId) {
      // Update existing product
      this.productService.updateProduct(this.productId, productData).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.showSuccess('Product succesvol bijgewerkt!');
          this.router.navigate(['/admin/overview']);
        },
        error: (error) => {
          console.error('Error updating product:', error);
          this.errorMessage = 'Fout bij het bijwerken van het product';
          this.toastService.showError('Fout bij het bijwerken van het product');
          this.isSaving = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/overview']);
  }
}
