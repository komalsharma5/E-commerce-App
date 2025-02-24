import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth-slice/Index'
import adminProductsSlice from './admin/products_slice/Index'
import adminOrderSlice from './admin/Order_Slice/Index'
import shopProductSlice from './shop/Product-Slice/index'
import shopCartSlice from './shop/Crat_slice/index'
import shopAddressSlice from './shop/Adress_slice/index'
import shopOrderSlice from './shop/Order_Slice/Index'
import shopSearchSlice from './shop/Search_Slice/Index'
import shopReviewSlice from './shop/Review_slice/Index'
import commonFeatureSlice from './Common/Common_slice'



const Store = configureStore({
    reducer: {
        auth : authReducer,

        adminProducts: adminProductsSlice,
        adminOrder: adminOrderSlice,
        
        shopProducts: shopProductSlice,
        shopCart : shopCartSlice,
        shopAddress : shopAddressSlice,
        shopOrder : shopOrderSlice,
        shopSearch :  shopSearchSlice,
        shopReview : shopReviewSlice,
        commonFeature : commonFeatureSlice,
    }
})

export default Store
