import React from 'react'
import accImg from "../../assets/account.jpg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Adress from '@/components/Shoping-view/Adress';
import Shoping_Orders from '@/components/Shoping-view/Shoping_Orders';


const ShopingAccount = () => {
  return (
    <div className='flex flex-col'>
      <div className='relative h-[350px] w-full overflow-hidden'>
          <img  src={accImg}
          className="h-full w-full object-cover object-center"></img>
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-8 py-8">
        <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
        <Tabs defaultValue="orders">
            <TabsList>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
            </TabsList>
            <TabsContent value="orders">
              <Shoping_Orders></Shoping_Orders>
            </TabsContent>
            <TabsContent value="address">
              <Adress></Adress>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default ShopingAccount

