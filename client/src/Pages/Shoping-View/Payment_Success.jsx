// import React from 'react'

// const Payment_Success = () => {
//   return (
//     <div>
//       Payment Successfull......
//     </div>
//   )
// }

// export default Payment_Success

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Payment_Success = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.removeItem("currentOrderId");
    }, [dispatch]);

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <Card className="w-[400px] text-center shadow-lg p-6 bg-white">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-green-600">
                         Payment Successful!
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600 mb-4">Thank you for your purchase.</p>
                    <Button 
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => navigate("/shop/account")}
                    >
                        Back to Home
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default Payment_Success;

