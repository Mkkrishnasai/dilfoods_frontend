import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
    state: () => ({
        cart: JSON.parse(localStorage.getItem('cart') || '[]'),
    }),
    actions: {
        storeCart(itemData: any, quantity: any) {
          const existingItem = this.cart.find((item: any) => item.id === itemData.id);
          if (existingItem) {
            existingItem.quantity += quantity;
            if(parseInt(existingItem.quantity) <= 0){
              this.cart = this.cart.filter((f: any) => f.id != itemData.id);
            }
          } else {
            this.cart.push({ ...itemData, quantity });
          }
          localStorage.setItem('cart', JSON.stringify(this.cart));
        },
        clearCart() {
          this.cart = [];
          localStorage.removeItem('cart');
        },
        getCart() {
          return this.cart;
        },
      },
});
