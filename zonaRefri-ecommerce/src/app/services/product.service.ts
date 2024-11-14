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
  
  getProduct(theProductId: number): Observable<Product> {
    //necesito una url basado en el product id
    const productUrl= `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
  }
  
  getProductList(theCategoryId: number): Observable<Product[]> {
    //construir url basado en categoryId 
    const searchUrl = `${this.baseUrl}/search/findBySubCategoryId?id=${theCategoryId}`;
  
    return this.getProducts(searchUrl);
  }
  getProductListPaginate(thePage:number,
                        thePageSize:number,
                        theCategoryId: number): Observable<GetResponse> {
    //construir url basado en categoryId 
    const searchUrl = `${this.baseUrl}/search/buscarPorCategoria?id=${theCategoryId}`
    + `&page=${thePage}&size=${thePageSize}`;
    console.log('url para paginación= '+ searchUrl);                     
    return this.httpClient.get<GetResponse>(searchUrl);
  }
  
  
  searchProducts(theKeyword: string): Observable<Product[]> {
    //construir url a base de keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
    
    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(thePage:number,
    thePageSize:number,
    theKeyword: string): Observable<GetResponse> {
//construir url basado en categoryId 
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
                + `&page=${thePage}&size=${thePageSize}`;
    console.log('url para paginación= '+ searchUrl);                     
    return this.httpClient.get<GetResponse>(searchUrl);
    }
  
  
  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponse>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
  
  getProductSubCategriesId(theSubCategoryId: number): Observable<ProductSubcategory[]> {
    //construir url basado en categoryId 
    const searchUrl = `${this.subCategoryUrl}/search/findByCategoryId?id=${theSubCategoryId}`;
    
    //console.log(searchUrl +'aca es el problema');
    
    //console.log('llamado a subcategoria= '+ searchUrl);
    
    return this.httpClient.get<GetResponseProductSubCategory>(searchUrl).pipe(
      map(response => response._embedded.productSubCategory)
    );
  }
  getProductSubCategries(): Observable<ProductSubcategory[]> {
    console.log('llamado a subcategoria');
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
  },
  page:{
    size:number,
    totalElements:number,
    totalPages:number,
    number:number
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