import { Category } from "./category.model";
import { PreviewImage } from "./preview-image.model";
import { Property } from "./property.model";

export interface Product {
  productId: number;
  nameDutch: string;
  nameEnglish: string;
  descriptionDutch: string;
  descriptionEnglish: string;
  price: number;
  forSale?: boolean;
  category: Category;
  properties: Property[];
  previewImages: PreviewImage[];
}