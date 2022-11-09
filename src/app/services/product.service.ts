import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

private baseUrl = environment.apiUrl + '/products';

private categoryUrl = environment.apiUrl + '/product-category';

  constructor(private httpClient: HttpClient) { }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  //returns an observable of product array
  //maps json data from spring rest to product array
  getProductList(theCategoryId: number): Observable<Product[]> {

    //build URL based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

  return this.getProducts(searchUrl);
  }

  //add support for pagination
  getProductListPaginate(thePage: number, thePageSize: number,
                            theCategoryId: number): Observable<GetResponseProducts> {

    //build URL based on category id for pagination
    //Spring REST API supports pagination out the box, so just pass page # and size
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                    + `&page=${thePage}&size=${thePageSize}`;
  return this.httpClient.get<GetResponseProducts>(searchUrl);
  }


  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
      );
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(thePage: number, 
                        thePageSize: number,
                        theKeyword: string): Observable<GetResponseProducts> {

    //build URL based on keyword
    //Spring REST API supports pagination out the box, so just pass page # and size
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
                      + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
    }

  getProduct(theProductId: number): Observable<Product> {
    //build URL based on product id
    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
  }


}

//helps unwrap JSON data
interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: { //add pagination
    size: number,
    totalElements: number,
    totalPages: number,
    number: number

  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}