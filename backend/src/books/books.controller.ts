import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { BooksService } from './books.service.js';
import { Book } from './entities/book.entity.js';
import { CreateBookDto } from './dto/create-book.dto.js';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  findAll(): Promise<Book[]> {
    return this.booksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Book | null> {
    return this.booksService.findOne(Number(id));
  }

  @Post()
  create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.booksService.create(createBookDto);
  }
}
