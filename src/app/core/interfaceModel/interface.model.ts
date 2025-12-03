export interface IRegister {
  username: string;
  email: string;
  password: string;
  phone_number: string;
  role: string;
  address: string[];
}
export interface ILogin {
  email?: string;
  phoneNumber?: string;
  password: string;
}
export interface ILoginResponse {
  message: string;
  token: string;
}
export interface ITokenData {
  id: string;
  role: string;
  username: string;
}
export interface IResetPassword {
  email: string;
  resetCode: string;
  newPassword: string;
}
///////////////////////////////
export interface IProducts {
  _id?: string;
  product_title: string;
  product_image: string;
  price: number;
  product_description: string;
  category_name: string;
  stock: number;
  routeProduct: string;
  minStock: number;
  isActive: boolean;
  subcategory: ISubcategory;
  brand: IBrand;
}
export interface IBrand {
  brand_name: string;
}

export interface ISubcategory {
  subcategory_name: string;
}

export interface ICartResponse {
  _id?: string;
  productId:IProducts;
  product_title?: string;
  userId: string;
  quantity: number;
  originalPrice: number;
  currentPrice: number;
  priceChanged?: boolean;
  removedAt: Date;
  isPurchased: boolean;
}

export interface ICart {
  productId: string;
  quantity: number;
}
export interface Testimonial {
  _id?: string;
  name: string;
  comment: string;
  rating: number;
  isActive?: boolean;
  userId?: string;
}
export interface IProfile {
  _id: string;
  username: string;
  email: string;
  phone_number: string;
  role: string;
  isVerified: boolean;
  address: [];
}
export interface IOrders {
  _id?: string;
  orderNumber:string;
  shippingData: {
    address: string[];
    phone: string;
  };
  userId: {
    _id:string,
    username:string,
    email:string
  };
  products: [
    {
      productId: {
        _id?: string;
        product_title: string;
        product_image: string;
        price: number;
        product_description: string;
        category_name: string;
        isActive: boolean;
        routeProduct: string;
      };
      quantity: number;
      price: number;
      _id?: string;
    }
  ];
  status: string;
  paymentMethod: string;
  createdAt:string
}
/////////////////////////////
export interface SidebarItem {
  icon: string;
  label: string;
  href: string;
  active: boolean;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
}

export interface Product {
  id: number;
  name: string;
  quantitySold: number;
  price: number;
  revenue: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  joinDate: string;
  status: string;
}