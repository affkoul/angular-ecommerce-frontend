import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {

  totalPrice: number = 0.00;
  totalQuantity:  number = 0;

  constructor(private cartService: CartService) { } //by injecting the cart service

  ngOnInit(): void {
    this.updateCartStatus();
  }

  updateCartStatus() {
    //subscrie to the cart totalPrice
    this.cartService.totalPrice.subscribe( //component subscribes to the service which publishes 
      data => this.totalPrice = data      // the total price +
    );

    //subscribe to the cart totalQunatity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data //total quantity
    );
    
  }

}
