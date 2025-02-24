import { filterOptions } from '@/Config/Index'
import { Label } from '@radix-ui/react-label'
import React from 'react'
import { Checkbox } from '../ui/checkbox'
import { Separator } from '../ui/separator'

const ProductFilter = ({ filters, handleFilter }) => {
  return (
    <div className='bg-background rounded-lg shadow-sm'>
      <div className='p-4 border-b'>
        <h2 className='text-lg font-extrabold'>Filters</h2>
      </div>
      <div className='p-4 space-y-4'>
        {
          // Filter options
          Object.keys(filterOptions).map((keyItem) => (
            <div key={keyItem}> 
              <h3 className='text-base font-bold'>{keyItem}</h3>
              <div className='grid gap-2 mt-2'>
                {
                  filterOptions[keyItem].map((option) => (
                    <Label key={option.id} className='flex items-center gap-2 font-medium'>
                      <Checkbox checked=
                      {
                        filters && Object.keys(filters).length > 0 && filters[keyItem] && filters[keyItem].indexOf(option.id) > -1
                      } 
                      onCheckedChange={() => handleFilter(keyItem, option.id)} />
                      {option.label}
                    </Label>
                  ))
                }
              </div>
              <Separator />
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default ProductFilter
