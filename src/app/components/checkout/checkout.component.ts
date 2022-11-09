import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';
import { isTypeOnlyImportOrExportDeclaration } from 'typescript';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup; //collection of form controls

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  states: State[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = []

  storage: Storage = sessionStorage;

  constructor(private formBuilder: FormBuilder,
              private luv2ShopFormService: Luv2ShopFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router) { }

  ngOnInit(): void {

    this.reviewCartDetails();

    // read the user's email address from browser storage
    const theEmail = JSON.parse(this.storage.getItem('userEmail'));

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', 
                              [Validators.required, 
                                Validators.minLength(2), 
                                Luv2ShopValidators.notOnlyWhitespace]),
        lastName: new FormControl('', 
                              [Validators.required, 
                                Validators.minLength(2), 
                                Luv2ShopValidators.notOnlyWhitespace]),
        email: new FormControl(theEmail, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]) //.email only hecks for text @ text
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), 
                                    Luv2ShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), 
                                    Luv2ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), 
          Luv2ShopValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), 
                                    Luv2ShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), 
                                    Luv2ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), 
                                      Luv2ShopValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), 
                                          Luv2ShopValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      }),
    });

    //populate credit card months
    const startMonth: number = new Date().getMonth() + 1; //get the current month, JS is 0 based so add 1
    console.log("startMonth: " + startMonth);

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
        data => {
          console.log("Retrieved credit card month: " + JSON.stringify(data));
          console.log(data);
          this.creditCardMonths = data;
        }
    );

    //populate credit card years

    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved creidt card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    //ppulate countries
    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        console.log("the countries are: " + JSON.stringify(data));
        this.countries = data;
      }
    );
   
  }
  
  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe(
        totalQuantity => this.totalQuantity = totalQuantity
    );

    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
  }

  // getters to access form controls
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }
  get creditCardName() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  //get cardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }

  copyShippingToBillingAddress(event){
    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
            .setValue(this.checkoutFormGroup.controls.shippingAddress.value);

            //bug fix for states

            this.billingAddressStates = this.shippingAddressStates;
          }
          else {
            this.checkoutFormGroup.controls.billingAddress.reset();

            //bug fix for states
            this.billingAddressStates = [];
          }
  }

  onSubmit() {
    console.log("Handling form submission");

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

   // set up order
   let order = new Order();
   order.totalPrice = this.totalPrice;
   order.totalQuantity = this.totalQuantity;

   // get cart items
   const cartItems = this.cartService.cartItems;

   // create orderItems from cartItems
   let orderItems: OrderItem[] = [];
   for (let i=0; i < cartItems.length; i++) {
     orderItems[i] = new OrderItem(cartItems[i]);

   }

   // set up purchase
   let orderItemsShort: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));
    let purchase = new Purchase();

   // populate purchase - customer
   purchase.customer = this.checkoutFormGroup.controls['customer'].value; 
   
   //populate purchase - shipping address
   purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
   const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state))
   const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country))
   purchase.shippingAddress.state = shippingState.name;
   purchase.shippingAddress.country = shippingCountry.name;

   // populate purchase - billing address
   purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
   const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state))
   const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country))
   purchase.billingAddress.state = billingState.name;
   purchase.billingAddress.country = billingCountry.name;

   // populate purchase  - order and orderItems
   purchase.order = order;
   purchase.orderItems = orderItems;
   console.log(`is the url transferring: ${JSON.stringify(purchase.orderItems)}`)

   // call REST API via the CheckoutService 
   this.checkoutService.placeOrder(purchase).subscribe(
     {
       // error handling
       next: response => {
         alert(`Your order has been recieved.\nOrder tracking number: ${response.orderTrackingNumber}`);
         // reset the cart
        this.resetCart();
        
       },
       error: err => {
         alert(`There was an error: ${err.message}`);
       }
     }
   );
  }

  resetCart() {
    //reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset the form
    this.checkoutFormGroup.reset();

    // remove cartItems from session
    this.storage.removeItem('cartItems');

    // navigate back to the products page 
    this.router.navigateByUrl("/products");
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard'); //create a handle to credit card form group
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    //if current year equals selected year, then start with the current year 
    let startMonth: number;

    if(currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: ");
        this.creditCardMonths = data;
      }
    )
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {
        if(formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        }
        else {
          this.billingAddressStates = data;
        }

        //select first item by default
        formGroup.get('state').setValue(data[0]); 
      }
    );
  }


}
