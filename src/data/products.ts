import type { Product } from '../types/product'


export const products: Product[] = [
    {
        id: 'vitamin-c-001',
        name: 'Vitamin C 1000mg',
        slug: 'vitamin-c-1000mg',
        isPublished: true,
        description: 'Vitamin C supplement for daily nutritional support.',
        price: 15000,
        stockQuantity: 25,
        stockStatus: 'in-stock',

        images: [
            {
                id: 'vitamin-c-001-image-1',
                url: 'https://placehold.co/600x600?text=Front+Image',
                alt: 'Vitamin C 1000mg',
                isPrimary: true,
            },
            {
                id: 'vitamin-c-001-image-2',
                url: 'https://placehold.co/600x600?text=Side+Image',
                alt: 'Vitamin C 1000mg side view',
                isPrimary: false,
            },
        ],

        attributes: [
            {
                name: 'Strength',
                value: '1000mg',
            },
            {
                name: 'Form',
                value: 'Tablets',
            },
        ],
    },
]