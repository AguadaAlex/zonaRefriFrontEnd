import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css'
})
export class CartDetailsComponent implements OnInit{
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number =0;
  
  constructor(private cartService: CartService){}
  
  ngOnInit(): void {
    this.listCartDetails()
    
  }
  listCartDetails() {
    // OBTENER CUENTA PARA ARTICULOS DE CARRITO 
    this.cartItems=this.cartService.cartItems;
    
    //AGREGA AL CARRO EL PRECIO TOTAL
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
    
    // AGREGA AL CARRO LA CANTIDAD TOTAL 
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
    
    
    //CALCULAR CANTIDAD TOTAL Y PRECIO
    
    this.cartService.computeCartTotals();
  }

  incrementQuantity(theCartItem: CartItem){
    this.cartService.addToCart(theCartItem);
  }
  
  decrementQuantity(theCartItem: CartItem){
    this.cartService.decrementQuantity(theCartItem);
  }
  
  remove(theCartItem: CartItem) {
  this.cartService.remove(theCartItem);
}




}