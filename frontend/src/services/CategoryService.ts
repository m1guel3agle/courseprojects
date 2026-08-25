import { BookService } from './BookService.js';

export default class CategoryService {
  public static getUniqueBookCategories(): string[] {
    const books = BookService.getBooks();
    const categories = books.map((book) => book.category).filter(Boolean);
    return Array.from(new Set(categories));
  }
}