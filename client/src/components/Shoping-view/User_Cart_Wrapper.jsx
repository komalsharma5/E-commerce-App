import React from 'react'
import { SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import { Button } from '../ui/button'
import UserCart_ItemContent from './UserCart_ItemContent'
import { useNavigate } from 'react-router-dom'

const User_Cart_Wrapper = ({ cartItems, setOpenCartSheet }) => {
const navigate = useNavigate()


const totalCartAmount = cartItems && cartItems.length > 0? cartItems.reduce((sum, currentItem)=> sum + (
    currentItem?.salePrice > 0 ?  currentItem?.salePrice : currentItem.price
)* currentItem?.quantity, 0) : 0

  return (
    <SheetContent className='sm:max-w-md' aria-describedby={undefined}>
        <SheetHeader>
            <SheetTitle>
                 Your Cart
            </SheetTitle>
        </SheetHeader>
        <div className='mt-8 space-y-4'>
            {
                cartItems && cartItems.length > 0 ? cartItems.map((item,index)=> <UserCart_ItemContent key={item.id ? item.id : `cart-item-${index}`} cartItem={item} />) : null
            }
        </div>
        <div className='mt-8 space-y-4'>
            <div className='flex justify-between'>
                <span className='font-bold'>Total Amount</span>
                <span className='font-bold'>${totalCartAmount}</span>
            </div>
        </div>
        <Button onClick={()=>{navigate('/shop/checkout')
                setOpenCartSheet(false)
        }} className='w-full mt-6'>
            Checkout
        </Button>
    </SheetContent>
  )
}

export default User_Cart_Wrapper
