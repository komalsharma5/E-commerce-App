import { Dialog, DialogContent } from "@/components/ui/dialog"; 
import { Button } from "../ui/button";

import { Avatar, AvatarFallback } from "../ui/avatar";
import { StarIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/Store/shop/Crat_slice";
import { useToast } from "@/hooks/use-toast";
import { setProductDetails } from "@/Store/shop/Product-Slice";
import { Label } from "../ui/label";
import Star_Rating from "../Common/Star_Rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/Store/shop/Review_slice/Index";



 function ProductDetailsDialog({open,setOpen, productDetails}){
const [reviewMsg, setReviewMsg] =useState('')
const [rating, setRating] = useState(0)
const dispatch = useDispatch()
const {user} = useSelector((state)=>state.auth)
const {toast} = useToast()
const { cartItems } = useSelector((state) => state.shopCart);
const { reviews } = useSelector((state) => state.shopReview);

 //add to cart function
    function handleAddToCart(getCurrentProductId, getTotalStock){
        // console.log(getCurrentProductId, 'getCurrentProductId');
        // console.log(cartItems,'cartItems*******');
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

    //rating funcrion
    function handleRatingChange(getRating) {
      console.log(getRating, "getRating");
  
      setRating(getRating);
    }
  
    //add review function
    function handleAddReview() {
      dispatch(
        addReview({
          productId: productDetails?._id,
          userId: user?.id,
          userName: user?.userName,
          reviewMessage: reviewMsg,
          reviewValue: rating,
        })
      ).then((data) => {
        // console.log(data);
        if (data.payload.success) {
          setRating(0);
          setReviewMsg("");
          dispatch(getReviews(productDetails?._id));
          toast({
            title: "Review added successfully!",
          });
        }
      });
    }





    function handleDialogClose(){
        setOpen(false)
        dispatch(setProductDetails())
        setRating(0)
        setReviewMsg('')
    }

    useEffect(() => {
      if (productDetails !== null) dispatch(getReviews(productDetails?._id));
    }, [productDetails]);
  
    console.log(reviews, "reviews");

    const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;



    return(
        <Dialog open={open} onOpenChange={handleDialogClose}>
        
                <DialogContent className='grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]'>
                    <div className="relative overflow-hidden rounded-lg">
                            <img src={productDetails?.image} alt={productDetails?.title} width={600} height={600} className="aspect-square w-full object-cover">
                            </img>
                    </div>
                    <div>
                    <div className="">
                        <h1 className="text-3xl font-extrabold">{productDetails?.title} </h1>
                        <p className="text-muted-foreground text-2xl mb-5 mt-4">{productDetails?.description}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className={`text-3xl font-bold text-primary ${productDetails?.salePrice > 0 ? 'line-through' : ''}`}>${productDetails?.price}</p>
                        {
                            productDetails?.salePrice > 0 ? <p className="text-2xl font-b text-muted-foreground ">${productDetails?.salePrice}</p> : null
                        }
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-0.5">
                          <Star_Rating rating={averageReview}></Star_Rating>
                        </div>
                        <span className="text-muted-foreground">({averageReview.toFixed(2)})</span>
                    </div>
                    <div className="mt-5 mb-5">
            {
            productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">
                Out of Stock
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() =>
                    handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
              >
                Add to Cart
              </Button>
            )}
          </div>
                   <Separator></Separator>
                   <div className="max-h-[300px] overflow-auto">
                        <h2 className="text-xl font-bold mb-4">Reviwes</h2>
                        <div className="grid gap-6">
                        {reviews && reviews.length > 0 ?  (
                reviews.map((reviewItem) => (  <div className="flex gap-4">
                                <Avatar className='w-10 h-10 border'>
                                    <AvatarFallback>{reviewItem?.userName[0].toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="grid gap-1">
                                    <div className="flex items-center gap-2">
                                            <h3 className="font-bold">{reviewItem?.userName}</h3>
                                    </div>
                                    <div className="flex items-center gap-0.5">
                                      <Star_Rating rating={reviewItem?.reviewValue}></Star_Rating>
                                        
                                    </div>
                                    <p className="text-muted-foreground"> {reviewItem.reviewMessage}</p>
                                </div>

                                
                            </div>))) : (<h1>No Reviews</h1>
                         ) }
                               
                                
                        </div>
                        </div>
                        <div className="mt-10 flex-col gap-2">
                          <Label>Write a review</Label>
                          <div className="flex gap-1">
                              <Star_Rating rating={rating} handleRatingChange={handleRatingChange}></Star_Rating>
                          </div>
                          <Input name='reviewMsg' value={reviewMsg} onChange={(event)=>setReviewMsg(event.target.value)} placeholder='write a review...'></Input>

                            <Button className='w-full' onClick={handleAddReview} disabled={reviewMsg.trim() === ""}>
                              Submit
                            </Button>
                        </div>
                        
                   </div>
                  
                </DialogContent>
         
        </Dialog>
    )
}

export default ProductDetailsDialog

