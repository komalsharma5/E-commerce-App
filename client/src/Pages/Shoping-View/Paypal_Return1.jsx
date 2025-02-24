
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { capturePayment } from '@/Store/shop/Order_Slice/Index'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

const Paypal_Return1 = () => {

const dispatch = useDispatch()
const location = useLocation()
const params = new URLSearchParams(location.search)
const token = params.get('token')



useEffect(()=>{
    if(token){
      const orderId = JSON.parse(sessionStorage.getItem('currentOrderId'))
      console.log(orderId, 'orderid*****');
      
      if (!orderId) {
        console.error("Order ID is missing in sessionStorage.");
        return;
    }

      dispatch(capturePayment({token,orderId})).then(data=>{
        if(data?.payload?.success){
          sessionStorage.removeItem("currentOrderId")
          window.location.href = '/shop/payment-success'
        } else {
          console.error("Payment capture failed:", data?.payload);
      }
      })
    }
},[token,dispatch])


  return <Card>
      <CardHeader>
        <CardTitle>
            Processing Payment.....Please wait!!
        </CardTitle>
      </CardHeader>
  </Card>
}

export default Paypal_Return1







