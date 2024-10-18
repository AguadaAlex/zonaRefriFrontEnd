import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { ThisReceiver } from '@angular/compiler';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',

  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number= 1;
  
  constructor(private productService: ProductService,
              private route:ActivatedRoute) {

               }

  ngOnInit() {
    this.route.paramMap.subscribe(()=>{
      this.listProducts();
    })
  }

  listProducts() {
//CHEQUEA ID ENVIADO POR PARAMETRO
    const hasCategoryId: boolean =this.route.snapshot.paramMap.has('id');
    if(hasCategoryId){
      //CONVIERTE EL ID ENVIADO POR PARAMETRO DE STRING A INTEGER
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }
    else{
      //SI NO HAY ID ENVIADO POR PARAMETRO por defecto deja el id =1
      this.currentCategoryId =1;
    }
    //DEVOLVER PRODUCTO A BASE DEL ID ENVIADO POR PARAMETRO
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    )
  }

}
