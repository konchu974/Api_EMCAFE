import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

export const validationMiddleware = (type: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToClass(type, req.body);
    const errors: ValidationError[] = await validate(dto);

    if (errors.length > 0) {
      const messages = errors.map((error) => ({
        property: error.property,
        constraints: error.constraints,
      }));

      return res.status(400).json({ errors: messages });
    }

    req.body = dto;
    next();
  };
};
