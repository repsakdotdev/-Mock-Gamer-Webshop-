export interface Property {
  propertyId?: number;
  nameDutch: string;
  nameEnglish: string;
  valueDutch: string;
  valueEnglish: string;
  categoryId?: number; // Adding this since it's required according to the error
}