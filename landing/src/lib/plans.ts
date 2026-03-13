export type PlanType = 'free' | 'creator' | 'pro';

export interface PlanConfig {
    name: string;
    price: number;
    rendersPerMonth: number;
    maxResolution: '720p' | '1080p' | '4k';
    hasWatermark: boolean;
    features: string[];
    isRecommended?: boolean;
}

export const PLANS: Record<PlanType, PlanConfig> = {
    free: {
        name: 'Early Access',
        price: 0,
        rendersPerMonth: 100, // Generous limit for Beta
        maxResolution: '1080p',
        hasWatermark: false,
        features: [
            '100 renders per month',
            'Full HD export quality',
            'No Watermark',
            'All premium themes'
        ]
    },
    creator: {
        name: 'Creator',
        price: 9,
        rendersPerMonth: 100,
        maxResolution: '1080p',
        hasWatermark: false,
        isRecommended: true,
        features: [
            '100 renders per month',
            '1080p high quality',
            'No watermark',
            'All premium themes',
            'Personal share links',
            'Priority support'
        ]
    },
    pro: {
        name: 'Pro',
        price: 19,
        rendersPerMonth: 500,
        maxResolution: '4k',
        hasWatermark: false,
        features: [
            '500 renders per month',
            '4K Ultra HD quality',
            'No watermark',
            'Everything in Creator',
            'Priority rendering queue',
            'Early access features'
        ]
    }
};

export const getPlanConfig = (plan: string = 'free'): PlanConfig => {
    const p = plan.toLowerCase() as PlanType;
    return PLANS[p] || PLANS.free;
};
