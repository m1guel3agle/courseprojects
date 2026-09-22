import type { BookInterface } from '@/interfaces/BookInterface.js';

export type CreateBookDTO = Omit<BookInterface, 'id'>;
