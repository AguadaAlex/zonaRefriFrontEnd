import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AsyncValidatorFn } from '@angular/forms';
import { ZonaRefriFormService } from '../../services/zona-refri-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { ZonaRefriValidators } from '../../validators/zona-refri-validators';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';
import { JsonPipe } from '@angular/common';
import { response } from 'express';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] =[];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];
  
  constructor(private formBuilder: FormBuilder,
              private zonaRefriFormService: ZonaRefriFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router
  ) {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',[Validators.required, Validators.minLength(2), ZonaRefriValidators.notOnlyWhitespace]),
        lastName: new FormControl('',[Validators.required, Validators.minLength(2), ZonaRefriValidators.notOnlyWhitespace]),
        email: new FormControl('',
                          [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]

        )
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('',[Validators.required, Validators.minLength(2), ZonaRefriValidators.notOnlyWhitespace]),
        city: new FormControl('',[Validators.required, Validators.minLength(2), ZonaRefriValidators.notOnlyWhitespace]),
        state: new FormControl('',[Validators.required]),
        country: new FormControl('',[Validators.required]),
        zipCode: new FormControl('',[Validators.required, Validators.minLength(2), ZonaRefriValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('',[Validators.required, Validators.minLength(2), ZonaRefriValidators.notOnlyWhitespace]),
        city: new FormControl('',[Validators.required, Validators.minLength(2), ZonaRefriValidators.notOnlyWhitespace]),
        state: new FormControl('',[Validators.required]),
        country: new FormControl('',[Validators.required]),
        zipCode: new FormControl('',[Validators.required, Validators.minLength(2), ZonaRefriValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('',[Validators.required]),
        nameOnCard: new FormControl('',[Validators.required, Validators.minLength(2), ZonaRefriValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('',
          [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('',
          [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    // PUBLICAR MESES DE TARJETA DE CREDITO
    const startMonth:number = new Date().getMonth() + 1;
    console.log("startMonth: "+ startMonth);
    this.zonaRefriFormService.getCreditCardMonths(startMonth).subscribe(
      data=> {
        console.log("Retrieved credit card months: "+ JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )
    // PUBLICAR AÑOS DE TARJETA DE CREDITO

    this.zonaRefriFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );
    //PUBLICAR PAICES
      this.zonaRefriFormService.getCountries().subscribe(
        data => {
          console.log("Retrieved countries: " + JSON.stringify(data));
          this.countries = data;
        }
      );
   }

  ngOnInit(): void {
    
    this.reviewCartDetails();
    
  }
  reviewCartDetails() {
    //SUBSCRIBE A CART SERVICE TOTAL QUANTITY
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    //SUBSCRIBE A CART SERVICE TOTAL PRICE
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );

  }

  get firstName(){ return this.checkoutFormGroup.get('customer.firstName');}
  get lastName(){ return this.checkoutFormGroup.get('customer.lastName');}
  get email(){ return this.checkoutFormGroup.get('customer.email');}
  get shippingAddressStreet(){ return this.checkoutFormGroup.get('shippingAddress.street');}
  get shippingAddressCity(){ return this.checkoutFormGroup.get('shippingAddress.city');}
  get shippingAddressState(){ return this.checkoutFormGroup.get('shippingAddress.state');}
  get shippingAddressZipCode(){ return this.checkoutFormGroup.get('shippingAddress.zipCode');}
  get shippingAddressCountry(){ return this.checkoutFormGroup.get('shippingAddress.country');}

  get billingAddressStreet(){ return this.checkoutFormGroup.get('billingAddress.street');}
  get billingAddressCity(){ return this.checkoutFormGroup.get('billingAddress.city');}
  get billingAddressState(){ return this.checkoutFormGroup.get('billingAddress.state');}
  get billingAddressZipCode(){ return this.checkoutFormGroup.get('billingAddress.zipCode');}
  get billingAddressCountry(){ return this.checkoutFormGroup.get('billingAddress.country');}

  get creditCardType(){ return this.checkoutFormGroup.get('creditCard.cardType');}
  get creditCardNameOnCard(){ return this.checkoutFormGroup.get('creditCard.nameOnCard');}
  get creditCardNumber(){ return this.checkoutFormGroup.get('creditCard.cardNumber');}
  get creditCardSecurityCode(){ return this.checkoutFormGroup.get('creditCard.securityCode');}

  copyShippingAddressToBillingAddress(event:Event) {
    const inputElement = event.target as HTMLInputElement; 
    if (inputElement && inputElement.checked) 
      { this.checkoutFormGroup.get('billingAddress')?.setValue(this.checkoutFormGroup.get('shippingAddress')?.value);
        //BUG PARA ESTADOS
        this.billingAddressStates = this.shippingAddressStates;
       }
     else { this.checkoutFormGroup.get('billingAddress')?.reset();
      //BUG PARA ESTADOS
      this.billingAddressStates = [];
      }
    
  }

  onSubmit() {
    console.log("Handling the submit button");
    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    }

    // setear orden 
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // devolver tarjeta con items
    const cartItems= this.cartService.cartItems;

    // crear orden de items a base de tarjeta de items
    /*
    let orderItems: OrderItem[] = [];
    for(let i=0; i < cartItems.length; i++){
      orderItems[i] = new OrderItem(cartItems[i]);
    }
      */


    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));
    // setear compra

    let purchase = new Purchase();

    // publicar compra del cliente
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;
    
    
    // publicar compra - dirección de envio
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress?.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress?.country));
    if (purchase.shippingAddress) { 
      purchase.shippingAddress.state = shippingState.name; 
      purchase.shippingAddress.country = shippingCountry.name;
    }
    // publicar compra - dirección de facturación 

    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress?.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress?.country));
    if (purchase.billingAddress) { 
      purchase.billingAddress.state = billingState.name; 
      purchase.billingAddress.country = billingCountry.name;
    }
    // publicar compra - orden y orden item

    purchase.order = order;
    purchase.orderItems = orderItems;

    // Llama a API rest via checkoutService

    this.checkoutService.placeOrder(purchase).subscribe({
      next: response => {
        alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

        // reset cart
        this.resetCart();

      },
      error: err => {
        alert(`There was an error: ${err.message}`);
      }
    }
  );


  }
  resetCart() {
    // reset datos en la tarjeta 
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    // reset formulario
    this.checkoutFormGroup.reset();
    // navegar atras en los productos de la pagina
    this.router.navigateByUrl("/products");
  }

  handleMonthsAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number= Number(creditCardFormGroup?.value.expirationYear);

    let startMonth: number;
    if(currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1; 
    }
    else {
      startMonth = 1;
    }
    this.zonaRefriFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
    }
    getStates(formGroupName:string){
      const formGroup = this.checkoutFormGroup.get(formGroupName);
      const countryCode = formGroup?.value.country.code;
      const countryName = formGroup?.value.country.name;
      console.log(`${formGroupName} country code: ${countryCode}`);
      console.log(`${formGroupName} country name: ${countryName}`);
      this.zonaRefriFormService.getStates(countryCode).subscribe(
        data => {
          if(formGroupName === 'shippingAddress'){

            this.shippingAddressStates = data;
          }
          else {
            this.billingAddressStates = data;
          }
          // SELECCIONAR PRIMER ITEM POR DEFECTO
          formGroup?.get('state')?.setValue(data[0]);
        }
      )

    }
  }
