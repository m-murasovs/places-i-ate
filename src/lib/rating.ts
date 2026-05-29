export function ratingToNumber(rating: string): number {
    return rating === 'S' ? 6 : Number(rating);
}
