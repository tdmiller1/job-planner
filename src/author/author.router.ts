import express from 'express';
import type { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import * as AuthorService from './author.service';

export const authorRouter = express.Router();

authorRouter.get('/', async (_, response: Response) => {
  try {
    const authors = await AuthorService.listAuthors();
    response.status(200).json(authors);
  } catch (error: any) {
    response.status(500).json(error.message);
  }
});

authorRouter.get('/:id', async (request: Request, response: Response) => {
  const id: number = parseInt(request.params.id, 10);
  try {
    const author = await AuthorService.getAuthor(id);
    response.status(200).json(author);
  } catch (error) {
    response.status(404).json(error);
  }
});

authorRouter.post(
  '/',
  body('firstName').isString(),
  body('lastName').isString(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      response.status(400).json({ errors: errors.array() });
    } else {
      try {
        const { firstName, lastName } = request.body;
        const author = await AuthorService.createAuthor({
          firstName,
          lastName,
        });
        response.status(200).json(author);
      } catch (error) {
        response.status(500).json(error);
      }
    }
  }
);

authorRouter.put(
  '/:id',
  body('firstName').isString(),
  body('lastName').isString(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      response.status(400).json({ errors: errors.array() });
    } else {
      const id: number = parseInt(request.params.id, 10);
      try {
        const { firstName, lastName } = request.body;
        const author = await AuthorService.updateAuthor(id, {
          firstName,
          lastName,
        });
        response.status(200).json(author);
      } catch (error) {
        response.status(500).json(error);
      }
    }
  }
);

authorRouter.patch(
  '/:id',
  body('firstName').optional().isString(),
  body('lastName').optional().isString(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      response.status(400).json({ errors: errors.array() });
    } else {
      const id: number = parseInt(request.params.id, 10);
      try {
        const { firstName, lastName } = request.body;
        const author = await AuthorService.updateAuthor(id, {
          firstName,
          lastName,
        });
        response.status(200).json(author);
      } catch (error) {
        response.status(500).json(error);
      }
    }
  }
);

authorRouter.delete('/:id', async (request: Request, response: Response) => {
  const id: number = parseInt(request.params.id, 10);
  try {
    const author = await AuthorService.deleteAuthor(id);
    response.status(200).json(author);
  } catch (error) {
    response.status(404).json(error);
  }
});
