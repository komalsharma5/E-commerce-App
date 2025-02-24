import React from 'react'
import { Button } from '../ui/button'
import { Minus, Plus, Trash } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteCartItem, updateCartQuantity } from '@/Store/shop/Crat_slice'
import { useToast } from '@/hooks/use-toast'

const UserCart_ItemContent = ({ cartItem }) => {
  const {user} = useSelector(state=>state.auth)
const dispatch = useDispatch()
const {toast} = useToast()
const { cartItems } = useSelector((state) => state.shopCart);
const { productList } = useSelector((state=>state.shopProducts))

//add to cart deleat button function
function handleCartItemDelete(getCartItem){
    dispatch(deleteCartItem({userId : user?.id, productId : getCartItem?.productId }))
}

//upadte cart item quantity
function handleUpdateQuantity(getCartItem, typeOfAction) {
  if (typeOfAction == "plus") {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentCartItem = getCartItems.findIndex(
        (item) => item.productId === getCartItem?.productId
      );

      const getCurrentProductIndex = productList.findIndex(
        (product) => product._id === getCartItem?.productId
      );
      const getTotalStock = productList[getCurrentProductIndex].totalStock;

      console.log(getCurrentProductIndex, getTotalStock, "getTotalStock");

      if (indexOfCurrentCartItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }
  }

  dispatch(
    updateCartQuantity({
      userId: user?.id,
      productId: getCartItem?.productId,
      quantity:
        typeOfAction === "plus"
          ? getCartItem?.quantity + 1
          : getCartItem?.quantity - 1,
    })
  ).then((data) => {
    if (data?.payload?.success) {
      toast({
        title: "Cart item is updated successfully",
      });
    }
  });
}


  return (
    <div className='flex items-center space-x-4'>
      <img src={cartItem?.image} alt={cartItem?.title} className='w-20 h-20 rounded object-cover'></img>
      <div className='flex-1'>
          <h3 className='font-extrabold'>{cartItem?.title}</h3>
          <div className='flex items-center gap-2 mt-1'>
              <Button disabled={cartItem?.quantity === 1}variant='outline' size='icon' className='h-8 w-8 rounded-full' onClick={()=>handleUpdateQuantity(cartItem, 'minus')}>
                <Minus className='w-4 h-4'></Minus>
                <span className='sr-only'>Decrease</span>
              </Button>
              <span className='font-semibold'>{cartItem?.quantity}</span>
              <Button variant='outline' size='icon' className='h-8 w-8 rounded-full' onClick={()=>handleUpdateQuantity(cartItem, 'plus')}>
                <Plus className='w-4 h-4'></Plus>
                <span className='sr-only'>Decrease</span>
              </Button>
          </div>
      </div>
      <div className='flex flex-col items-end'>
        <p className='font-semibold'>
            ${((cartItem?.salePrice > 0? cartItem?.salePrice : cartItem?.price) * cartItem?.quantity).toFixed(2)}
        </p>
        <Trash onClick={()=>handleCartItemDelete(cartItem)} className='cursor-pointer mt-1' size={20}></Trash>
      </div>
    </div>
  )
}

export default UserCart_ItemContent
