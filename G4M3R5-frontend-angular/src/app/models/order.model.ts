export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED'
}

export interface Order {
  orderId: number;
  orderDate: string;
  totalPrice: number;
  orderStatus: OrderStatus;
  orderItems: OrderItem[];
  deliveryAddress: DeliveryAddress;
}

export interface OrderItem {
  orderItemId: number;
  product: Product;  // This was missing causing the errors
  quantity: number;
}

export interface Product {
  productId: number;
  nameDutch: string;
  nameEnglish: string;
  descriptionDutch: string;
  descriptionEnglish: string;
  price: number;
  category: Category;
  properties: Property[];
  previewImages: PreviewImage[];
  forSale: boolean;
}

export interface Category {
  categoryId: number;
  nameDutch: string;
  nameEnglish: string;
}

export interface Property {
  propertyId: number;
  nameDutch: string;
  nameEnglish: string;
  valueDutch: string;
  valueEnglish: string;
}

export interface PreviewImage {
  previewImageId: number;
  path: string;
}

export interface DeliveryAddress {
  deliveryAddressId: number;
  zipCode: string;
  city: string;
  street: string;
  houseNumber: string;
  receiverName: string;
  user: any | null;
}

