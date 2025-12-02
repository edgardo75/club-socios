import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.errors.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('. ');
      return res.status(400).json({ error: errorMessages });
    }
    return res.status(400).json({ error: 'Error de validación' });
  }
};
