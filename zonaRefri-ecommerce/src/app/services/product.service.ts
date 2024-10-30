import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../common/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductSubcategory } from '../common/product-subcategory';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  

  private baseUrl = 'http://localhost:8080/api/products';
  private CategoryUrl ='http://localhost:8080/api/product-category';
  private subCategoryUrl ='http://localhost:8080/api/product-subcategory';

  constructor(private httpClient: HttpClient) { }

  getProductList(theCategoryId: number): Observable<Product[]> {
    //construir url basado en categoryId 
    const searchUrl = `${this.baseUrl}/search/findBySubCategoryId?id=${theCategoryId}`;

    return this.httpClient.get<GetResponse>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
  getProductSubCategriesId(theSubCategoryId: number): Observable<ProductSubcategory[]> {
    //construir url basado en categoryId 
    const searchUrl = `${this.subCategoryUrl}/search/findByCategoryId?id=${theSubCategoryId}`;

    console.log(searchUrl +'aca es el problema');

    return this.httpClient.get<GetResponseProductSubCategory>(searchUrl).pipe(
      map(response => response._embedded.productSubCategory)
    );
  }
  getProductSubCategries(): Observable<ProductSubcategory[]> {
   
    return this.httpClient.get<GetResponseProductSubCategory>(this.subCategoryUrl).pipe(
      map(response => response._embedded.productSubCategory)
    );
  }
  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.CategoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }
}


interface GetResponse {
  _embedded: {
    products: Product[];
  }
  
}
interface GetResponseProductSubCategory {
  _embedded: {
    productSubCategory: ProductSubcategory[];
  }
  
}
interface GetResponseProductCategory {
  _embedded: {
    productCategory: any;
    productSubCategory: ProductCategory[];
  }
  
}