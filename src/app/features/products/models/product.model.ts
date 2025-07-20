export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  isDeleted: boolean;
  productQR: string;
  imageUrl?: string;
  condition: number;
  sellerId: number;
  isPublished: boolean;
  isHiddenSellerInfo: boolean;
}
