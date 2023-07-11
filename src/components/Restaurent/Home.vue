<template>
    <main>
        <div class="flex" v-cloak id="dribbleShot">
            <div class="main w-full px-16 border-gray-200">
                <div class="h-12 mt-8 flex items-center">
                <h6 class="font-bold text-lg mx-10 flex"><div class="dilfoods mt-1"></div>{{ title }}</h6>
                <div class="flex items-center ml-auto bg-gray-100 self-stretch custom-rounded px-4 w-2/3">
                    <i class="fa fa-search"></i>
                    <input type="text" class="px-4 self-stretch bg-transparent flex-grow outline-none" placeholder="Search" v-model="search">
                </div>
                <div @click="logout" class="bg-custom-50 text-white p-2 ml-2 rounded-lg cursor-pointer">
                    Logout <i class="ml-3 fa fa-sign-out-alt"></i>
                </div>
                </div>
                <div class="grid grid-cols-9 gap-6 mt-12">
                <div @click="activeCategory = cat.id" class=" border rounded-full p-4 flex flex-col items-center shadow-xl cursor-pointer transition-colors duration-700 ease-in-out " :class="{'bg-custom-50 text-white': cat.id == activeCategory}" v-for="(cat, idx) in categories">
                    <p class="m-auto font-bold  text-xs">{{cat.name}}</p>
                </div>
                </div>
                <div v-if="foodItems.length == 0" class="flex justify-center mt-40 items-center">
                    <div class="loader"></div>
                </div>
                <div v-else>
                    <p class="m-5 shadow-black">Recommended Items</p>                    
                    <div class="mt-12 grid grid-cols-3 gap-10">
                        <div class="flex flex-col" v-for="food in recommended">
                            <div class="shadow-lg relative h-40 custom-rounded" :style="{ backgroundSize: 'cover', backgroundRepeat: 'no-repeat' , backgroundImage: 'url(\'' + food.image_name + '\')' }">
                            </div>
                            <p class="mt-4 font-medium">{{food.title}}</p>
                            <div class="mt-2 flex justify-between">
                                <span class="text-xs"><i class="fa fa-star"></i> {{food.average_rating}}</span>
                                <span class="text-gray-600 font-hairline text-xs mx-4">{{food.category?.name}}</span>
                                <span class="text-gray-600 font-hairline text-xs mx-4">₹ {{food.price}}</span>
                            </div>
                            <div class="flex justify-between pt-1 text-xs font-bold">
                                <div v-if="cartStore.cart.length > 0 && cartStore.cart.filter(c => c?.id == food.id).length > 0" class="ml-auto flex flex-col">
                                    <div class="flex items-center mt-3">
                                        <span class="border border-r-0 p-2 rounded-l-lg cursor-pointer"  @click="setCartItems(food,-1)">-</span>
                                        <span class="border-b border-t p-2 ">{{cartStore.cart.filter(c => c?.id == food.id)[0].quantity}}</span>
                                        <span class="border border-l-0 p-2 rounded-r-lg cursor-pointer" @click="setCartItems(food,1)">+</span>
                                    </div>
                                </div>
                                <div v-else class="ml-auto bg-custom-50 text-white p-4 rounded-lg cursor-pointer" @click="setCartItems(food,1)">
                                    Add
                                </div>
                            </div>
                        </div>            
                    </div>
                    <hr class="m-4" />
                    <div class="mt-12 grid grid-cols-3 gap-10">
                        <div class="flex flex-col" v-for="food in remaining_items">
                            <div class="shadow-lg relative h-40 custom-rounded" :style="{ backgroundSize: 'cover', backgroundRepeat: 'no-repeat' , backgroundImage: 'url(\'' + food.image_name + '\')' }">
                            </div>
                            <p class="mt-4 font-medium">{{food.title}}</p>
                            <div class="mt-2 flex justify-between">
                                <span class="text-xs"><i class="fa fa-star"></i> {{food.average_rating}}</span>
                                <span class="text-gray-600 font-hairline text-xs mx-4">{{food.category?.name}}</span>
                                <span class="text-gray-600 font-hairline text-xs mx-4">₹ {{food.price}}</span>
                            </div>
                            <div class="flex justify-between pt-1 text-xs font-bold">
                                <div v-if="cartStore.cart.length > 0 && cartStore.cart.filter(c => c?.id == food.id).length > 0" class="ml-auto flex flex-col">
                                    <div class="flex items-center mt-3">
                                        <span class="border border-r-0 p-2 rounded-l-lg cursor-pointer"  @click="setCartItems(food,-1)">-</span>
                                        <span class="border-b border-t p-2 ">{{cartStore.cart.filter(c => c?.id == food.id)[0].quantity}}</span>
                                        <span class="border border-l-0 p-2 rounded-r-lg cursor-pointer" @click="setCartItems(food,1)">+</span>
                                    </div>
                                </div>
                                <div v-else class="ml-auto bg-custom-50 text-white p-4 rounded-lg cursor-pointer" @click="setCartItems(food,1)">
                                    Add
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            <div class="bg-gray-100 sidebar flex flex-col" v-if="cartStore.cart.length > 0">
                <div class="px-6">
                <div class="mt-12">
                    <p class="font-medium text-xl">My Order</p>
                </div>
                <div v-for="(item, index) in cartStore.cart" class="grid grid-cols-4 gap-1 mb-5" :class="{'mt-12' : index == 0}">
                    <div class="h-10 rounded-lg" :style="{ backgroundSize: 'cover', backgroundRepeat: 'no-repeat' , backgroundImage: 'url(\'' + item.image_name + '\')' }"></div>
                    <div class="col-span-2 grid grid-cols-3 text-xxs font-semibold ">
                    <p class="flex justify-center items-center">{{item.quantity}} <span class="ml-1">x</span></p>
                    <p class="col-span-2 flex items-center">{{item.title}}</p>
                    </div>
                    <div class="flex justify-end items-center text-gray-600 font-hairline text-xs">
                        ₹ {{item.price}}
                    </div>
                </div>
                </div>
                <div class="flex-grow flex flex-col pl-6">
                    <div class="flex justify-between items-center border-b-2 pb-2">
                    <span>Total:</span>
                    <span class="text-xl font-medium pr-6">₹ {{ calculateTotal() }}</span>
                    </div>
                    <div class="flex justify-between pt-4 text-xs font-bold cursor-pointer">
                        <div class="mr-auto bg-custom-50 text-white p-6 rounded-lg" @click="makeOrder">
                            Order <i class="ml-3 fa fa-arrow-right"></i>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            <div class="flex h-10">
            <div class="flex-grow px-16 main border-r border-gray-200"></div>
            <div class="sidebar bg-gray-100"></div>
            </div>
    </main>
</template>

<script>
import axios from 'axios';
import {userRoutes} from '../../router/routes';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import Swal from 'sweetalert2';

export default {
    data(){
        return {
            title: 'DilFoods',
            activeCategory: 1,
            baseUrl: import.meta.env.VITE_BASE_URL,
            categories: [],
            foodItems: [],
            cartStore: useCartStore(),
            authStore: useAuthStore(),
            cartItems: [],
            search : '',
            recommended_ids : []
        }
    },
    watch :{ 
        activeCategory(v){
            this.getItems(v);
        },
        search(v){
            this.getItems();
        }
    },
    computed:{
        recommended(){
            return this.foodItems.filter(f => this.recommended_ids.includes(f.id));
        },
        remaining_items(){
            return this.foodItems.filter(f => !this.recommended_ids.includes(f.id));
        }
    },
    mounted(){
        this.cartItems = this.cartStore.getCart();
        this.getCategories();
        this.getItems();
    },
    methods :{ 
        async getItems(category=null){
            try {
                let filter = {
                    search : this.search
                };
                if(category && category != 1){
                    filter.category_id = category;
                }
                let result = await axios.get(this.baseUrl + userRoutes.getItems,{
                    params : filter
                });
                if(result.data.status== true){
                    this.foodItems = result.data.data.items;
                    this.recommended_ids = result.data.data.recommended;
                }
            } catch (error) {
                console.log(error);
            }
        },
        async getCategories(){
            try {
                this.categories = [{
                    id: 1,
                    name: 'All',
                    icon: 'https://image.flaticon.com/icons/svg/1046/1046874.svg',
                    isActive: true
                }];
                let result = await axios.get(this.baseUrl + userRoutes.getCategories);
                if(result.data.status == true){
                    this.categories.push(...result.data.data);
                }
            } catch (error) {
                console.log(error);
            }
        },
        setCartItems(item,qty){
            this.cartStore.storeCart(item,qty);
        },
        calculateTotal(){
            let totalPrice = 0;
            for (const item of this.cartStore.cart) {
                totalPrice += item.price * item.quantity;
            }
            return totalPrice;
        },
        async makeOrder(){
            try {
                let res = await axios.post(this.baseUrl + userRoutes.makeOrder,{
                    'total_amount' : this.calculateTotal(),
                    'items' : this.cartStore.cart
                });
                if(res.data.status == true){
                    Swal.fire({
                        title: 'Successfully Ordered !',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    });
                    this.cartStore.clearCart();
                }
            } catch (error) {
                console.log(error);
            }
        },  
        logout(){
            this.cartStore.clearCart();
            this.authStore.logout();
            location.reload();
        }
    }
}
</script>

<style>
.loader {
  width: 50px;
  height: 50px;
  position: relative;
  animation: heartbeat 1s infinite, spin 2s linear infinite;
}

.loader::before,
.loader::after {
  content: "";
  position: absolute;
  top: 0;
  width: 25px;
  height: 40px;
  border-radius: 50px 50px 0 0;
  background-color: #e41857;
}

.loader::before {
  left: 25px;
  transform: rotate(-45deg);
  transform-origin: 0 100%;
}

.loader::after {
  left: 0;
  transform: rotate(45deg);
  transform-origin: 100% 100%;
}



.dilfoods {
  width: 30px;
  height: 50px;
  position: relative;
  animation: heartbeat 1s infinite;
}

.dilfoods::before,
.dilfoods::after {
  content: "";
  position: absolute;
  top: 0;
  width: 12.5px;
  height: 20px;
  border-radius: 50px 50px 0 0;
  background-color: #e41857;
}

.dilfoods::before {
  left: 12.5px;
  transform: rotate(-45deg);
  transform-origin: 0 100%;
}

.dilfoods::after {
  left: 0;
  transform: rotate(45deg);
  transform-origin: 100% 100%;
}

@keyframes heartbeat {
  0% {
    transform: scale(1) translateY(0);
  }
  15% {
    transform: scale(0.9) translateY(-5px);
  }
  30% {
    transform: scale(1) translateY(0);
  }
  45% {
    transform: scale(0.9) translateY(-5px);
  }
  60% {
    transform: scale(1) translateY(0);
  }
  100% {
    transform: scale(1) translateY(0);
  }
}
@keyframes spin {
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(180deg);
  }
  100% {
    transform: rotateY(360deg);
  }
}
</style>