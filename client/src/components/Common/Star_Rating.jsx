import { StarIcon } from 'lucide-react';
import React from 'react'
import { Button } from '../ui/button';

const Star_Rating = ({ rating, handleRatingChange }) => {
    console.log(rating, "rating");

    return [1, 2, 3, 4, 5].map((star) => (
      <Button
        className={`p-2 rounded-full transition-colors ${
          star <= rating
            ? "text-yellow-500 hover:bg-black"
            : "text-black hover:bg-primary hover:text-primary-foreground"
        }`}
        variant="outline"
        size="icon"
        onClick={handleRatingChange ? () => handleRatingChange(star) : null}
      >
        <StarIcon 
          className={`w-6 h-6 ${
            star <= rating ? "fill-yellow-500" : "fill-black"
          }`}
        />
      </Button>
    ));
}
export default Star_Rating
 