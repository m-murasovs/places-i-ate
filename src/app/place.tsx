import { PrimaryButton, SecondaryButton } from '@/components/button';
import useSearchPlaces from '@/hooks/use_search_places';
import useUpdatePlace from '@/hooks/use_update_place';
import { IPlace } from '@/Server/Service/PlaceService/IPlaceService';
import { ItemId } from '@/Server/Service/types';
import Image from 'next/image';
import { ChangeEvent, useEffect, useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { invalidateQueries } from './react_query_provider';

const PlaceForm = (
    {
        placeId,
        reviewStars,
        reviewText
    }: {
        placeId: ItemId;
        reviewStars: number;
        reviewText: string;
    }
) => {
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [editReviewStars, setEditReviewStars] = useState<number>(3);
    const [editReviewText, setEditReviewText] = useState('');

    useEffect(() => {
        setEditReviewStars(reviewStars);
        setEditReviewText(reviewText);
    }, []);

    const { error, mutate, isLoading, isSuccess } = useUpdatePlace();

    const handleStarsChange = (e: ChangeEvent<HTMLInputElement>) => setEditReviewStars(parseInt(e.target.value));
    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => setEditReviewText(e.target.value);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate(
            {
                _id: placeId,
                query: {
                    projection: {
                        reviewStars: editReviewStars,
                        reviewText: editReviewText,
                        updatedAt: new Date()
                    }
                }
            }
        );
        // Refetch the visited places on homepage but allow time for it to update
        setTimeout(() => {
            invalidateQueries(['fetchVisitedPlaces']);
        }, 1000);
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
                    How many stars do you give this place?
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
                    Describe the place
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

const FoundPlaces = ({ searchInput }: { searchInput: string; }) => {
    const { data: foundPlaces, isLoading, isFetching, isError } = useSearchPlaces(searchInput);
    const placeNotFound = (!searchInput.length && !foundPlaces && !isFetching) || isError;

    if (!searchInput.length) return;
    if (isLoading || isFetching) return <p>Loading...</p>;
    if (placeNotFound) return <p>
        Nothing found for <b>{searchInput}</b>. I guess you should add it?
    </p>;

    return foundPlaces?.map((place: IPlace | undefined, index) => {
        if (!place) return;

        const { title, imageUrl, address, reviewStars, reviewText } = place;
        const addressParts = address?.split(',');

        return <div key={`${title}-${index}`} className='my-6'>
            <Image
                alt={title || 'Place image'}
                src={imageUrl ? imageUrl : '/placeholder_place_img.png'}
                width={50}
                height={50}
            />
            <h3>{title}</h3>
            {addressParts ? <p>{addressParts[0]}</p> : null}
            <PlaceForm
                placeId={place._id}
                reviewStars={reviewStars}
                reviewText={reviewText}
            />
        </div>;
    });
};

export default FoundPlaces;
