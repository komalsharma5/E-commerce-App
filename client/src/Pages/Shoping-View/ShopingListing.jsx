import ProductDetailsDialog from '@/components/Shoping-view/ProductDetailsDialog'
import ProductFilter from '@/components/Shoping-view/ProductFilter'
import Shoping_ProductTile from '@/components/Shoping-view/Shoping_ProductTile'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { sortOptions } from '@/Config/Index'
import { useToast } from '@/hooks/use-toast'
import { addToCart, fetchCartItems } from '@/Store/shop/Crat_slice'
import { fetchAllFilteredProducts, fetchProductDetails } from '@/Store/shop/Product-Slice'
import { ArrowUpDownIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'



function createSearchParamsHelper(filterParams){
    const queryParams = []

    for(const [key,value] of Object.entries(filterParams)){
        if(Array.isArray(value) && value.length > 0){
          const paramValue = value.join(',')

          queryParams.push(`${key}=${encodeURIComponent(paramValue)}`)
        }
    }
    // console.log(queryParams, 'queryparams');
    
    return queryParams.join('&')
}


const ShopingListing = () => {
const dispatch = useDispatch()
const { productList, productDetails } = useSelector((state=>state.shopProducts))
const [filters,setFilters] = useState({})
const { cartItems } = useSelector((state) => state.shopCart);
const [sort,setSort] = useState(null)
const [searchParams, setSearchParams] = useSearchParams()
const [openDetailsDialog,setOpenDetailsDialog] = useState(false)
const {user} = useSelector((state)=>state.auth)
const {toast} = useToast()

const categorySearchParam = searchParams.get("category");

function handleSort(value){
  // console.log(value, 'value*****');
  setSort(value)
}

function handleFilter(getSectionId, getCurrentOption){
    // console.log(getSectionId, getCurrentOption, 'getSectionId, getCurrentOption***');

    let copyFilters ={ ...filters }
    const indexOfCurrentSection = Object.keys(copyFilters).indexOf(getSectionId)

    if(indexOfCurrentSection === -1){
      copyFilters = {
        ...copyFilters,
        [getSectionId] :[getCurrentOption],
      }
    } else {
      const indexOfCurrentOption = copyFilters[getSectionId].indexOf(getCurrentOption)

      if(indexOfCurrentOption === -1)copyFilters[getSectionId].push(getCurrentOption)
      else copyFilters[getSectionId].splice(indexOfCurrentOption, 1)
      }
      // console.log(copyFilters);
      setFilters(copyFilters)
      sessionStorage.setItem('filters', JSON.stringify(copyFilters))
    } 

    //product get details
    function handleGetProductDetails(getCurrentProductId){
      // console.log(getCurrentProductId);
      dispatch(fetchProductDetails(getCurrentProductId))
      
    }

    //add to cart function
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

    //category ,brand filter
    useEffect(()=>{
        setSort('price-lowtohigh')
        setFilters(JSON.parse(sessionStorage.getItem('filters')) || {} )
    },[categorySearchParam])


//search params function 
useEffect(()=>{
  if(filters && Object.keys(filters).length > 0){
    const createQueryString = createSearchParamsHelper(filters)
    setSearchParams(new URLSearchParams(createQueryString))
  }
},[filters])


  //fetch list of products
  useEffect(()=>{
    if(filters !== null && sort !== null)
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      );
  },[dispatch,sort, filters])

  useEffect(()=>{
    if(productDetails !== null) setOpenDetailsDialog(true)
  },[productDetails])
  
console.log(productList, 'productList------>')



  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      <div className='bg-background w-full rounded-lg shadow-sm'>
        <div className='p-4 border-b flex items-center justify-between'>
            <h2 className='text-lg font-extrabold'>All Products</h2>
            <div className='flex items-center gap-3'>
              <span className='text-muted-foreground'>{productList?.length} Products</span>
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="outline" size='sm' className='flex items-center gap-1'>
                    <ArrowUpDownIcon className='h-4 w-4' />
                    <span>Sort by</span>
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-[200px]'>
                  <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                    {
                      sortOptions.map((sortItem)=><DropdownMenuRadioItem value={sortItem.id}  key={sortItem.id}>
                        {sortItem.label}
                      </DropdownMenuRadioItem>)
                    }
                  </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>   
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              {
              productList && productList.length > 0
                ? productList.map((productItem, index) =>
                    <Shoping_ProductTile  key={productItem.id ? `product-${productItem.id}` : `product-index-${index}`} 
                      product={productItem} handleGetProductDetails ={handleGetProductDetails} handleAddtoCart={handleAddtoCart}
                    />
                  )
                : null}
            
        </div>
      </div>
      <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails}></ProductDetailsDialog>
    </div>
  )
}

export default ShopingListing
