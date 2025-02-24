import React, { useEffect, useState } from 'react'
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";
import { Button } from '@/components/ui/button';
import { Airplay, BabyIcon, ChevronLeftIcon, ChevronRightIcon, CloudLightning, Heater, Image, Shirt, ShirtIcon, ShoppingBasket, UmbrellaIcon, WashingMachine, WatchIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFilteredProducts, fetchProductDetails } from '@/Store/shop/Product-Slice';
import Shoping_ProductTile from '@/components/Shoping-view/Shoping_ProductTile';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { addToCart, fetchCartItems } from '@/Store/shop/Crat_slice';
import ProductDetailsDialog from '@/components/Shoping-view/ProductDetailsDialog';
import { getFeatureImages } from '@/Store/Common/Common_slice';

const ShoppingHome = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const [openDetailsDialog,setOpenDetailsDialog] = useState(false)
   const { featureImageList} = useSelector((state) => state.commonFeature);
const dispatch = useDispatch();
const navigate = useNavigate()
const {toast} = useToast()

// const slides = [bannerOne,bannerTwo,bannerThree]

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt },
  { id: "adidas", label: "Adidas", icon: WashingMachine },
  { id: "puma", label: "Puma", icon: ShoppingBasket },
  { id: "levi", label: "Levi's", icon: Airplay },
  { id: "zara", label: "Zara", icon: Image },
  { id: "h&m", label: "H&M", icon: Heater },
];

function handleNavigateToListingPgae(getCurrentItem, section){
    sessionStorage.removeItem('filters')
    const currentFilter = {
      [section] : [getCurrentItem.id]
    }

    sessionStorage.setItem('filters', JSON.stringify(currentFilter))
    navigate('/shop/listing');
}


function handleGetProductDetails(getCurrentProductId){
      // console.log(getCurrentProductId);
      dispatch(fetchProductDetails(getCurrentProductId))
      
    }

//add to cart function
    function handleAddtoCart(getCurrentProductId){
        // console.log(getCurrentProductId, 'getCurrentProductId');
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
useEffect(() => {
  const timer = setInterval(() => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
  }, 3000);

  return () => clearInterval(timer);
}, [featureImageList]);


useEffect(()=>{
    dispatch(fetchAllFilteredProducts({ filterParams : {},sortParams : 'price-lowtohigh' }))
},[dispatch])

 useEffect(()=>{
    if(productDetails !== null) setOpenDetailsDialog(true)
  },[productDetails])

useEffect(() => {
    dispatch(getFeatureImages());
}, [dispatch])
// console.log(productList, 'productList');


  return (
    <div className="flex flex-col min-h-screen">
       <div className="relative w-full h-[600px] overflow-hidden">
           {
              featureImageList && featureImageList.length > 0 ? featureImageList.map((slide,index)=> <img src={slide?.image} key={`slide-${index}`} className={`${index === currentSlide ? 'opacity-100' : 'opacity-0'} absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}>
              </img>) : null
           }
           <Button variant='outline' size='icon' className='absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80' onClick={()=>setCurrentSlide(prevSlide=>(prevSlide - 1 + featureImageList.length) % featureImageList.length)}>
              <ChevronLeftIcon className='w-4 h-4'></ChevronLeftIcon>
           </Button>
           <Button variant='outline' size='icon' className='absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80'  onClick={()=>setCurrentSlide(prevSlide=>(prevSlide + 1) % featureImageList.length)}>
              <ChevronRightIcon className='w-4 h-4'></ChevronRightIcon>
           </Button>
       </div>  
        <section className='py-12 bg-gray-50'>
           <div className='container mx-auto px-4'>
                <h2 className='text-3xl font-bold text-center mb-8'>Shop by categoey</h2>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                  {
                    categoriesWithIcon.map((categoryItem)=> <Card key={categoryItem.id} className='cursor-pointer hover:shadow-lg transition-shadow' onClick={()=>handleNavigateToListingPgae(categoryItem,'category')}>
                        <CardContent className='flex flex-col items-center justify-center p-6'>
                        {React.createElement(categoryItem.icon, { className: 'w-12 h-12 mb-4 text-primary' })}

                          {/* <categoryItem.icon className='w-12 h-12 mb-4 text-primary' /> */}
                          <span className='font-bold'>{categoryItem.label}</span>
                        </CardContent>
                    </Card>)
                  }
                </div>
           </div>
        </section>

        <section className='py-12 bg-gray-50'>
           <div className='container mx-auto px-4'>
                <h2 className='text-3xl font-bold text-center mb-8'>Shop by Brand</h2>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
                  {
                    brandsWithIcon.map((brandItem)=> <Card key={brandItem.id} className='cursor-pointer hover:shadow-lg transition-shadow'onClick={()=>handleNavigateToListingPgae(brandItem,'brand')}>
                        <CardContent className='flex flex-col items-center justify-center p-6'>
                        {React.createElement(brandItem.icon, { className: 'w-12 h-12 mb-4 text-primary' })}

                          {/* <categoryItem.icon className='w-12 h-12 mb-4 text-primary' /> */}
                          <span className='font-bold'>{brandItem.label}</span>
                        </CardContent>
                    </Card>)
                  }
                </div>
           </div>
        </section>



        <section className='py-12'>
        <div className='container mx-auto px-4'>
            <h2 className='text-3xl font-bold text-center mb-8'>Feature Products</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                  {
                    productList && productList.length > 0 ? productList.map((productItem, index)=> <Shoping_ProductTile key={index} product={productItem} handleGetProductDetails={handleGetProductDetails} handleAddtoCart={handleAddtoCart} />) : null
                  }
            </div>
        </div>
        </section>
        <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails}></ProductDetailsDialog>
    </div>
  )
}

export default ShoppingHome
