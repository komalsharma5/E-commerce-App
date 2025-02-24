import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import Common_Form from '../Common/Common_Form'
import { addressFormControls } from '@/Config/Index';
import { useDispatch, useSelector } from "react-redux";
import { addNewAddress, deleteAddress, editaAddress, fetchAllAddresses } from '@/Store/shop/Adress_slice/index.js';
import { useToast } from '@/hooks/use-toast';
import Adrees_Card from './Adrees_Card';


const initialAddressFormData = {
    address: "",
    city: "",
    phone: "",
    pincode: "",
    notes: "",
  };


const Adress = ({setCurrentSelectedAddress, selectedId}) => {

const [formData, setFormData] = useState(initialAddressFormData)
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const { toast } = useToast();


function handleManageAddress(event) {
    event.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
        setFormData(initialAddressFormData);
        toast({
          title: "You can add max 3 addresses",
          variant: "destructive",
        });
  
        return;
      }

    currentEditedId !== null
      ? dispatch(
          editaAddress({
            userId: user?.id,
            addressId: currentEditedId,
            formData,
          })
        ).then((data) => {
            if (data?.payload?.success) {
              dispatch(fetchAllAddresses(user?.id));
              setCurrentEditedId(null);
              setFormData(initialAddressFormData);
              toast({
                title: "Address updated successfully",
              });
            }
          })
        : dispatch(
              addNewAddress({
                ...formData,
                userId: user?.id,
              })
            ).then((data) => {
                      if (data?.payload?.success) {
                        dispatch(fetchAllAddresses(user?.id));
                        setFormData(initialAddressFormData);
                        toast({
                          title: "Address added successfully",
                        });
                      }
                    });
  }

  function handleDeleteAddress(getCurrentAddress) {
    // console.log(getCurrentAddress);
    dispatch(
      deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(user?.id));
        toast({
          title: "Address deleted successfully",
        });
      }
    });
  }

  function handleEditAddress(getCuurentAddress) {
    setCurrentEditedId(getCuurentAddress?._id);
    setFormData({
      ...formData,
      address: getCuurentAddress?.address,
      city: getCuurentAddress?.city,
      phone: getCuurentAddress?.phone,
      pincode: getCuurentAddress?.pincode,
      notes: getCuurentAddress?.notes,
    });
  }
 
  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key].trim() !== "")
      .every((item) => item);
  }


  useEffect(() => {
    dispatch(fetchAllAddresses(user?.id));
  }, [dispatch]);


// console.log(addressList, 'addreslist');

  return <Card>
    <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {
             addressList &&  addressList.length > 0
                ?  addressList.map((singleAddressItem,index) => (
                    <Adrees_Card  key={singleAddressItem.id || singleAddressItem._id || index} //as per changes my code
                    addressInfo={singleAddressItem}
                      handleDeleteAddress={handleDeleteAddress}
                      handleEditAddress={handleEditAddress}
                      setCurrentSelectedAddress={setCurrentSelectedAddress}
                      selectedId={selectedId}
                    />
                  ))
                : null
        }
    </div>
    <CardHeader>
        <CardTitle>{
            currentEditedId !== null ? 'Edit Address' : 'Add New Address'
    }</CardTitle>
    </CardHeader>
    <CardContent className='space-y-3'>
        <Common_Form formControls={addressFormControls} formData={formData} setFormData={setFormData}  buttonText={currentEditedId !== null ? 'Edit' : 'Add'}
          onSubmit={handleManageAddress} isBtnDisabled={!isFormValid()}
         ></Common_Form>
    </CardContent>
  </Card>
  
}

export default Adress
