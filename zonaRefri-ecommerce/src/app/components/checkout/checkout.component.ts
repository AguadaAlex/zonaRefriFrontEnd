import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ZonaRefriFormService } from '../../services/zona-refri-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';

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
              private zonaRefriFormService: ZonaRefriFormService
  ) {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
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
    
    
  }

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
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log("The email address is " + this.checkoutFormGroup.get('customer')?.value.email);
    console.log("The shipping address country is " + this.checkoutFormGroup.get('shippingAddress')?.value.country.name);
    console.log("The shipping address state is " + this.checkoutFormGroup.get('shippingAddress')?.value.state.name);


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
