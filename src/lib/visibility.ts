import { VisibilityType } from '@/Server/VisitService/VisitService';

export const VISIBILITY_OPTIONS: { value: VisibilityType; label: string }[] = [
    { value: 'public', label: 'Public' },
    { value: 'followers', label: 'Followers only' },
    { value: 'private', label: 'Private' },
];

export const VISIBILITY_LABELS: Record<VisibilityType, string> = {
    public: 'Public',
    followers: 'Followers only',
    private: 'Private',
};
