import { Review } from './review.entity.js';
export declare class Book {
    id: number;
    title: string;
    category: string;
    price: number;
    stock: number;
    reviews: Review[];
}
