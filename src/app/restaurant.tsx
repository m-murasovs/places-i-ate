import { PrimaryButton, SecondaryButton } from '@/components/button';
import useSearchRestaurants from '@/hooks/use_search_restaurant';
import useUpdateRestaurant from '@/hooks/use_update_restaurant';
import { IRestaurant } from '@/Server/Service/RestaurantService/IRestaurantService';
import { ItemId } from '@/Server/Service/types';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import { DebounceInput } from 'react-debounce-input';

const RestaurantForm = (
    {
        restaurantId,
        reviewStars,
        reviewText
    }: {
        restaurantId: ItemId;
        reviewStars: number;
        reviewText: string;
    }
) => {
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [editReviewStars, setEditReviewStars] = useState<number>(reviewStars || 3);
    const [editReviewText, setEditReviewText] = useState(reviewText || '');

    const { error, mutate, isLoading, isSuccess } = useUpdateRestaurant();

    const handleStarsChange = (e: ChangeEvent<HTMLInputElement>) => setEditReviewStars(parseInt(e.target.value));
    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => setEditReviewText(e.target.value);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate(
            {
                _id: restaurantId,
                query: {
                    projection: {
                        reviewStars: editReviewStars,
                        reviewText: editReviewText,
                        updatedAt: new Date()
                    }
                }
            }
        );
    };

    // @ts-ignore
    if (error) {
        // @ts-ignore
        return <span>{`An error has occurred: ${error.message}`}</span>;
    }

    return <>
        {showReviewForm
            ? <form onSubmit={handleSubmit}>
                <label htmlFor='reviewStars'>
                    How many stars do you give this restaurant?
                </label>
                <DebounceInput
                    type='number'
                    min={1}
                    max={5}
                    value={reviewStars}
                    name='reviewStars'
                    className='p-1 border-2 ml-2 border-gray-400 rounded'
                    onChange={handleStarsChange}
                    required
                />
                <br />
                <label htmlFor='reviewText'>
                    Describe the restaurant
                </label>
                <DebounceInput
                    minLength={5}
                    value={reviewText}
                    name='reviewText'
                    className='p-1 border-2 ml-2 border-gray-400 rounded'
                    onChange={handleTextChange}
                    required
                />
                <br />
                <PrimaryButton type='submit'>
                    Submit review
                </PrimaryButton>
            </form>
            : <SecondaryButton onClick={() => setShowReviewForm(true)}>
                Add review
            </SecondaryButton>
        }
        {isLoading ? <p>Loading...</p> : null}
        {isSuccess ? <p>Successfully updated</p> : null}
    </>;
};

const FoundRestaurants = ({ searchInput }: { searchInput: string; }) => {
    const { data: foundRestaurants, isLoading, isFetching, isError } = useSearchRestaurants(searchInput);
    const restaurantNotFound = (!searchInput.length && !foundRestaurants && !isFetching) || isError;

    if (!searchInput.length) return;
    if (isLoading || isFetching) return <p>Loading...</p>;
    if (restaurantNotFound) return <p>
        Nothing found for <b>{searchInput}</b>. I guess you should add it?
    </p>;

    return foundRestaurants?.map((restaurant: IRestaurant | undefined, index) => {
        if (!restaurant) return;

        const { title, imageUrl, address, reviewStars, reviewText } = restaurant;
        const addressParts = address?.split(',');

        return <div key={`${title}-${index}`} className='my-6'>
            <Image
                alt={title || 'Restaurant image'}
                src={imageUrl ? imageUrl : '/placeholder_restaurant_img.png'}
                width={50}
                height={50}
            />
            <h3>{title}</h3>
            {addressParts ? <p>{addressParts[0]}</p> : null}
            <RestaurantForm
                restaurantId={restaurant._id}
                reviewStars={reviewStars}
                reviewText={reviewText}
            />
        </div>;
    });
};

export default FoundRestaurants;
