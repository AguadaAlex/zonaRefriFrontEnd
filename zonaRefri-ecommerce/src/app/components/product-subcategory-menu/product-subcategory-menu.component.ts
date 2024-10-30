import { Component, OnInit } from '@angular/core';
import { ProductSubcategory } from '../../common/product-subcategory';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-subcategory-menu',
  templateUrl: './product-subcategory-menu.component.html',
  styleUrl: './product-subcategory-menu.component.css'
})
export class ProductSubcategoryMenuComponent implements OnInit{
  
  productSubCategories: ProductSubcategory[]=[];
  constructor(private productService:ProductService){

  };
  ngOnInit(): void {
    this.listProductSubCategories();
  }
  listProductSubCategories() {
    this.productService.getProductSubCategries().subscribe(
      data=>{
        console.log('Product Categories='+ JSON.stringify(data));
        this.productSubCategories= data;
      }
    );
  }
}
