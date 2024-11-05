import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit{
  product!:Product;
  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private location: Location){


  }
  ngOnInit():void {
    this.route.paramMap.subscribe(()=>{
      this.handleProductDetails();
    }

    )

  }

  
  handleProductDetails() {
    //devuelve el ID por param string. Convierte string a numero usando el simbolo +
    const theProductId:number = +this.route.snapshot.paramMap.get('id')!;

    this.productService.getProduct(theProductId).subscribe(
      data=>{
        this.product = data;
        console.log('detalle de producto ='+ JSON.stringify(data));
      }
    )
  }

  volver() { this.location.back();}

}
