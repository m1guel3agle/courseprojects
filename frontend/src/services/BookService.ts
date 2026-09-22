import type { BookInterface } from '@/interfaces/BookInterface';
import type { CreateBookDTO } from '@/dtos/CreateBookDTO.js';
import axios from 'axios';

export class BookService {
  private static readonly API_URL = 'http://localhost:3000/api/books';

  public static async getBooks(): Promise<BookInterface[]> {
    const { data } = await axios.get(this.API_URL);
    return data;
  }

  public static async getBookById(id: number): Promise<BookInterface> {
    const { data } = await axios.get(`${this.API_URL}/${id}`);
    return data;
  }

  public static async createBook(book: CreateBookDTO): Promise<BookInterface> {
    const { data } = await axios.post(this.API_URL, book);
    return data;
  }
}
