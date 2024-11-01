import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { ThisReceiver } from '@angular/compiler';
import { ProductSubcategory } from '../../common/product-subcategory';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',

  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  listproductos:Product[] = [];
  subCategorias: ProductSubcategory[]=[];
  searchMode: boolean=false;
  currentCategoryId: number= 1;
  
  constructor(private productService: ProductService,
              private route:ActivatedRoute) {

               }

  ngOnInit() {
    this.route.paramMap.subscribe(()=>{
      this.listProductsSubcategorias();
    })
  }

  listProductsSubcategorias() {

    this.searchMode=this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      this.handleSearchProducts();
    }
    else{
      this.handleListProducts();
    }
  }
  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
  //ahora busca productos usando keyword
    this.productService.searchProducts(theKeyword).subscribe(

      data=>{
        this.listproductos=data;
      }
    )
    

  }

  //DEVOLVER PRODUCTOS A BASE DEL ID ENVIADO POR PARAMETRO

  handleListProducts(){
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
    //DEVOLVER SUBCATEGORIAS A BASE DEL ID ENVIADO POR PARAMETRO
    this.productService.getProductSubCategriesId(this.currentCategoryId).subscribe(
      data => {
        
        this.listproductos=[];
        this.subCategorias = data;
        this.subCategorias.forEach(element => {
          console.log(element.id);
           //DEVOLVER PRODUCTOS A BASE DEL ID ENVIADO POR PARAMETRO
          this.listarProductos(element.id);
          
        });
      }
    )
  }

  listarProductos(subcategoriaid:number){
    this.productService.getProductList(subcategoriaid).subscribe(
      data => {
        console.log('Productossssssssss='+ JSON.stringify(data));
        this.products=data
        Array.prototype.push.apply(this.listproductos, this.products);
        console.log(this.listproductos);
       
      }
    )
  }

}
