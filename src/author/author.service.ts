import { db } from '../utils/db.server';

type Author = {
  id: number;
  firstName: string;
  lastName: string;
};

export const listAuthors = async (): Promise<Author[]> => db.author.findMany();

export const getAuthor = async (id: number): Promise<Author> =>
  db.author.findUniqueOrThrow({
    where: { id },
    select: { id: true, firstName: true, lastName: true },
  });

export const createAuthor = async (
  author: Omit<Author, 'id'>
): Promise<Author> => db.author.create({ data: { ...author } });

export const updateAuthor = async (
  id: number,
  author: Omit<Partial<Author>, 'id'>
): Promise<Author> =>
  db.author.update({
    where: { id },
    data: { ...author },
  });

export const deleteAuthor = async (id: number): Promise<Author> =>
  db.author.delete({
    where: { id },
  });
