import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0); //Subject is  subclass of observable and can be used to publish events to all subscribers
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0); 

  //storage: Storage = sessionStorage;
  storage: Storage = localStorage;

  constructor() { 
    // read data from storage
    let data = JSON.parse(this.storage.getItem('cartItems'));

    if (data != null) {
      this.cartItems = data;

      // compute totals based on the data that is read from storage 

      this.computeCartTotals();
    }
  }

  addToCart(theCartItem: CartItem) {
    //check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if(this.cartItems.length > 0) {
    //find the item in the cart based on id

    //check if we found it
    //find returns undefined 
    existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);
  

    alreadyExistsInCart = (existingCartItem != undefined);
  }

  if(alreadyExistsInCart) {
    existingCartItem.quantity++;
  }
  else {
    //just add item to the array
    this.cartItems.push(theCartItem);
  }

  //computer cart total price and total quantity
  this.computeCartTotals();
}

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    //publish the new values...all subscribers will receive new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    //log cart data just for debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue);

    // persist cart data
    this.persistCartItems();
  }

  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the cart');
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, totalQuantity=${totalQuantityValue}, imageUrl=${tempCartItem.imageUrl}`);
    }
  }

  decrementQuantity(theCartItem: CartItem){
    theCartItem.quantity--;
  
      if(theCartItem.quantity === 0) {
        this.remove(theCartItem);
      }
      else{
        this.computeCartTotals();
      }
  
  }
  
  remove(theCartItem: CartItem) {
      //get index of item in array
      const itemIndex = this.cartItems.findIndex(
                            tempCartItem => tempCartItem.id == theCartItem.id);
  
      if(itemIndex > -1) {
        this.cartItems.splice(itemIndex, 1);
  
        this.computeCartTotals();
      }
    }

}
