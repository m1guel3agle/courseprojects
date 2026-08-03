export class Book {
  constructor(
    public id: number,
    public title: string,
    public Category: string,
    public price: number,
    public stock: number
  ) { }

  public static findById(books: Book[], id: number): Book {
    const book = books.find(book => book.id === id);
    if (!book) {
      throw new Error(`Book with id ${id} not found`);
    }
    return book;
  }
}