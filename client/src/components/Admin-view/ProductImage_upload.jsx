import { Label } from '@radix-ui/react-label'
import { FileIcon, UploadCloudIcon, XIcon } from 'lucide-react';
import React, { useEffect, useRef } from 'react'
import { Button } from '../ui/button';
import axios from 'axios';
import { Skeleton } from '../ui/skeleton';

const ProductImage_upload = ({ imageFile, setImageFile, 
    imageLoadingState,uploadedImageUrl, setUploadedImageUrl,setImageLoadingState,
    isEditMode,
    isCustomStyling = false,
 }) => {

    const inpurRef = useRef(null);

    function handleImageFileChange(e) {
        // console.log(e.target.files);
        
        const selectedFile = e.target.files?.[0];
        if (selectedFile)setImageFile(selectedFile);
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleDrop(e) {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) setImageFile(droppedFile);
    }

    function handleRemoveImage() {
        setImageFile(null);
        if(inpurRef.current){
            inpurRef.current.value = '';
        }
    }



    async function uploadeImageToCloudinary() {
        setImageLoadingState(true);
        const data = new FormData();
        data.append('my_file', imageFile);
        const response = await axios.post('http://localhost:5001/api/admin/products/upload-image', data);
    
        console.log(response, 'response');
        
        if(response?.data?.success)setUploadedImageUrl(response.data.result.url);
        setImageLoadingState(false);
    }


    useEffect(() => {
        if(imageFile !== null)uploadeImageToCloudinary();
    },[imageFile])

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? 'w-full' : 'max-w-md mx-auto'}`}>
      <Label className='text-lg font-semibold mb-2 block'>Upload Image</Label>
      <div onDragOver={handleDragOver} onDrop={handleDrop} className={`${isEditMode ? 'opacity-60' : ''}border-2 border-dashed rounded-lg p-4`}>
        <input id='image-upload' type='file' className='hidden' ref={inpurRef} onChange={handleImageFileChange} disabled={isEditMode}></input>
        {
            !imageFile ? 
           ( <Label htmlFor='image-upload' className={`${isEditMode ? "cursor-not-allowed" : ""}flex flex-col items-center justify-center h-32 cursor-pointer`}>
                <UploadCloudIcon className='w-10 h-10 text-muted-foreground mb-2 '></UploadCloudIcon>
                <span>Drag & Drop or click to upload</span>
            </Label>) : 
           imageLoadingState ? 
           (<Skeleton className='h-10 bg-gray-100' />) : 
           (<div className='flex items-center justify-between'> 
                <div className='flex items-center'>
                    <FileIcon className='w-8 h-8 text-primary mr-2 '></FileIcon>
                </div>
                <p className='text-sm font-medium'>{imageFile.name}</p>
                <Button variant='ghost' size='icon' className='text-muted-foreground hover:text-foreground' onClick={handleRemoveImage}>
                    <XIcon className='w-4 h-4'>
                    </XIcon>
                    <span className='sr-only'>Remove File</span>
                </Button>
             </div>)
        }
      </div>
    </div>
  )
}

export default ProductImage_upload
