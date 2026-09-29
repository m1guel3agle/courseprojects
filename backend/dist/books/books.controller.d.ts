import { BooksService } from './books.service.js';
import { Book } from './entities/book.entity.js';
import { CreateBookDto } from './dto/create-book.dto.js';
export declare class BooksController {
    private readonly booksService;
    constructor(booksService: BooksService);
    findAll(): Promise<Book[]>;
    findOne(id: string): Promise<Book | null>;
    create(createBookDto: CreateBookDto): Promise<Book>;
}
