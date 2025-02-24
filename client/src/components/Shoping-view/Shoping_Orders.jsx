
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../ui/dialog'
import ShopingOrderDetailsView from './ShopingOrderDetailsView'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrdersByUserId, getOrderDetails, resetOrderDetails } from '@/Store/shop/Order_Slice/Index'
import { Badge } from '../ui/badge'

const Shoping_Orders = () => {
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const { orderList, orderDetails } = useSelector((state) => state.shopOrder)

    function handleFetchOrderDetailes(getId) {
        dispatch(getOrderDetails(getId))
    }

    useEffect(() => {
        dispatch(getAllOrdersByUserId(user?.id))
    }, [dispatch])

    useEffect(() => {
        if (orderDetails !== null) setOpenDetailsDialog(true)
    }, [orderDetails])

    
    console.log(orderDetails, 'orderDetailes********');
    return (
        <Card>
            <CardHeader>
                <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Order Date</TableHead>
                            <TableHead>Order Status</TableHead>
                            <TableHead>Order Price</TableHead>
                            <TableHead>
                                <span className="sr-only">Details</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orderList && orderList.length > 0 ? (
                            orderList.map((orderItem) => (
                                <TableRow key={orderItem?._id}>
                                    <TableCell>{orderItem?._id}</TableCell>
                                    <TableCell>{orderItem?.orderDate.split('T')[0]}</TableCell>
                                    <TableCell>
                                        <Badge
                                            className={`py-1 px-3 ${
                                                orderItem?.orderStatus === "confirmed"
                                                                   ? "bg-green-500"
                                                                   : orderItem?.orderStatus === "rejected"
                                                                   ? "bg-red-600"
                                                                   : "bg-black"
                                            }`}
                                        >
                                            {orderItem?.orderStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>${orderItem?.totalAmount}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleFetchOrderDetailes(orderItem?._id)}>View Details</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : null}
                    </TableBody>
                </Table>
            </CardContent>

            {/* Dialog Component */}
            <Dialog
                open={openDetailsDialog}
                onOpenChange={() => {
                    setOpenDetailsDialog(false)
                    dispatch(resetOrderDetails())
                }}
            >
                <DialogContent>
                    <DialogTitle>Order Details</DialogTitle>
                    <DialogDescription>Details about the selected order.</DialogDescription>
                    <ShopingOrderDetailsView orderDetails={orderDetails} />
                </DialogContent>
            </Dialog>
        </Card>
    )
}

export default Shoping_Orders
