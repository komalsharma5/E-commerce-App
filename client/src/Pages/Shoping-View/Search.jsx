import ProductDetailsDialog from '@/components/Shoping-view/ProductDetailsDialog'
import Shoping_ProductTile from '@/components/Shoping-view/Shoping_ProductTile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { addToCart, fetchCartItems } from '@/Store/shop/Crat_slice'
import { fetchProductDetails } from '@/Store/shop/Product-Slice'
import { getSearchResults, resetSearchResults } from '@/Store/shop/Search_Slice/Index'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'

const Search = () => {

const [keyword, setKeyword] = useState("")
const [searchParams, setSearchParams] = useSearchParams()
const { searchResults } = useSelector((state) => state.shopSearch);
const dispatch = useDispatch();
const { cartItems } = useSelector((state) => state.shopCart);
const {toast} = useToast();
const {user} = useSelector((state)=>state.auth)
const [openDetailsDialog,setOpenDetailsDialog] = useState(false)
const { productDetails } = useSelector((state=>state.shopProducts))





function handleAddtoCart(getCurrentProductId, getTotalStock){
      console.log(cartItems,'cartItems*******');
      let getCartItems = cartItems.items || [];

      if(getCartItems.length){
        const indexOfCurrentItem = getCartItems.findIndex(item => item.productId === getCurrentProductId)

        if(indexOfCurrentItem > -1){
          const getQuantity = getCartItems[indexOfCurrentItem].quantity

          if(getQuantity + 1 > getTotalStock){
              toast({
                title: `Only ${getQuantity} quantity can be added for this item`,
                variant: 'destructive'
              })
              return
          }
        }
      }
        dispatch(addToCart({userId : user?.id, productId : getCurrentProductId, quantity : 1 })).then((data)=> {
          // console.log(data);
          if(data?.payload?.success){
            dispatch(fetchCartItems(user?.id))
            toast({
              title: 'Product Added to Cart',
            })
          }
          
        })
    }
 function handleGetProductDetails(getCurrentProductId){
      // console.log(getCurrentProductId);
      dispatch(fetchProductDetails(getCurrentProductId)) 
     }


useEffect(()=>{
        if(keyword && keyword.trim() !== "" && keyword.trim().length > 3){
            setTimeout(() => {
                setSearchParams(new URLSearchParams(`?keyword=${keyword}`))
            }, 1000);
            dispatch(getSearchResults(keyword))
        }else{
            setSearchParams(new URLSearchParams(`?keyword=${keyword}`))
            dispatch(resetSearchResults())
        }
    },[keyword])

useEffect(()=>{
    if(productDetails !== null) setOpenDetailsDialog(true)
  },[productDetails])

console.log(keyword,'keyword----->>>');


return (
    <div className="container mx-auto md:px-6 px-4 py-8">
          <div className="flex justify-center mb-8">
            <div className="w-full flex items-center">
                <Input className='py-6' value={keyword} name="keyword" onChange={(event)=>setKeyword(event.target.value)} placeholder="Search Products"></Input>
            </div>
        </div>
        {!searchResults.length ? (
        <h1 className="text-5xl font-extrabold">No result found!</h1>
      ) : null}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
      {searchResults.map((item) => (
          <Shoping_ProductTile product={item} handleAddtoCart={handleAddtoCart} handleGetProductDetails={handleGetProductDetails} />
        ))}
      </div>
      <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails}></ProductDetailsDialog>
    </div>
  )
}

export default Search
