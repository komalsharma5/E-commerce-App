import AdminProduct_tile from '@/components/Admin-view/AdminProduct_tile';
import ProductImage_upload from '@/components/Admin-view/ProductImage_upload';
import Common_Form from '@/components/Common/Common_Form';
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent, 
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductFormElements } from '@/Config/Index';
import { useToast } from '@/hooks/use-toast';
import { addNewProduct, deleteProduct, editProduct, fetchAllProducts } from '@/Store/admin/products_slice/Index';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';


const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "", 
  totalStock: "",
  averageReview: 0,
};



const AdminProducts = () => {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
  useState(false)
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const {productList} = useSelector((state)=>state.adminProducts)

  const {toast} = useToast()
  const dispatch = useDispatch();


//add button functionality
function onSubmit(event) {
  event.preventDefault();

  currentEditedId !== null
    ? dispatch(
        editProduct({
          id: currentEditedId,
          formData,
        })
      ).then((data) => {
        console.log(data, "edit");

        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setFormData(initialFormData);
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
        }
      })
    : dispatch(
        addNewProduct({
          ...formData,
          image: uploadedImageUrl,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setOpenCreateProductsDialog(false);
          setImageFile(null);
          setFormData(initialFormData);
          toast({
            title: "Product add successfully",
          });
        }
      });
}


//delete byn functionality
function handleDelete(getCurrentProductId) {
  // console.log(getCurrentProductId);
  dispatch(deleteProduct(getCurrentProductId)).then((data) => {
    if (data?.payload?.success) {
      dispatch(fetchAllProducts());
    }
  });
}


//add btn disable functionality
function isFormValid() {
  return Object.keys(formData).map((key) => formData[key] !== "")
    .every((item) => item);
}


  useEffect(() => {
    dispatch(fetchAllProducts())
  },[dispatch])

  // console.log(formData, 'productList');
  
  return (
    <>
      <div className='mb-5 w-full flex justify-end'>
      <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProduct_tile key={productItem._id} product={productItem}
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog} setCurrentEditedId={setCurrentEditedId} handleDelete={handleDelete} />
            ))
          : null}
      </div>
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false)
          setCurrentEditedId(null)
          setFormData(initialFormData);
        }}
      >
      <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {
            
              currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
          <ProductImage_upload imageFile={imageFile} setImageFile={setImageFile} uploadedImageUrl={uploadedImageUrl} setUploadedImageUrl={setUploadedImageUrl} 
          setImageLoadingState={setImageLoadingState}
          imageLoadingState={imageLoadingState} 
          isEditMode={currentEditedId !== null}
          ></ProductImage_upload>
          <div className='py-6'>
            <Common_Form onSubmit={onSubmit} formData={formData} setFormData={setFormData} buttonText={currentEditedId !== null ? 'Edit' : 'Add'} formControls={addProductFormElements}
            isBtnDisabled ={!isFormValid()}
            ></Common_Form>
          </div>
      </SheetContent>
      </Sheet> 
    </>
  )
}

export default AdminProducts

