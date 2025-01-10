import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  cartItems: CartItem[] = [];
  
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);
  
  
  
  constructor() { }
  
  addToCart(theCartItem: CartItem){
    //REVISA QUE SIEMPRE TENGA UN ITEM EN EL CARRO
    let alreadyExistsInCart: boolean =false ;
    let existingCartItem: CartItem | undefined;
    
    if(this.cartItems.length > 0){
      
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);
      
      // for(let tempCartItem of this.cartItems){
      //   if(tempCartItem.id == theCartItem.id){
        //     existingCartItem = tempCartItem;
        //     break;
        //   }
        // }
        alreadyExistsInCart = (existingCartItem != undefined)
      }
      if(alreadyExistsInCart && existingCartItem != undefined){
        //INCREMENTA CANTIDAD
        existingCartItem.quantity++;
      }
      else{
        //AGREGAR ITEM EN EL ARRAY
        this.cartItems.push(theCartItem);
      }
      //COMPUTAR CONTENIDO TOTAL DE PRECIO Y CANTIDAD DEL CARRO
      this.computeCartTotals();
      
      //BUSCA ITEM EN EL CARRO A BASE DE ITEM ID 
    }
    
    
    computeCartTotals() {
      let totalPriceValue: number = 0 ;
      let totalQuantityValue: number = 0;
      for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }
    
    //publish the new values ... all subscribers will receive the new data 

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    //METODO PARA LOG VALORES
    this.logCartData(totalPriceValue, totalQuantityValue);
    
    
  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('contenido de carro');
    for(let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice= ${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }
    console.log(`totalPrice: ${totalPriceValue.toFixed(2)},totalQuantity: ${totalQuantityValue}`);
    console.log('----')
  }


  decrementQuantity(theCartItem: CartItem) {

    theCartItem.quantity--;

    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    }
    else {
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem) {

    // get index of item in the array
    const itemIndex = this.cartItems.findIndex( tempCartItem => tempCartItem.id === theCartItem.id );

    // if found, remove the item from the array at the given index
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);

      this.computeCartTotals();
    }
  }
}
function createDefaultCartItem(): CartItem {
  return { id:'', name: '',imageUrl:'', unitPrice: 0, quantity: 0 // otros campos según tu definición 
  };
}

