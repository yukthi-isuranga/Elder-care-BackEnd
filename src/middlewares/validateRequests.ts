// import { NextFunction, Request, Response } from 'express';
// import * as z from 'zod';

// export const validateRequest = (schema: z.ZodSchema) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     const result = schema.safeParse(req.body);

//     if (!result.success) {
//       const formattedErrors = result.error.format();

//       const flatErrors = Object.values(formattedErrors)
//         .flat()
//         .filter(Boolean)
//         .map((err) => err?._errors)
//         .flat()
//         .filter(Boolean);

//       return res.status(400).json({
//         error: flatErrors.join(', '),
//       });
//     }

//     // optional: replace body with parsed data (clean data)
//     req.body = result.data;

//     next();
//   };
// };

import { NextFunction, Request, Response } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateRequest =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // Flatten errors safely using Zod built-in helper
      const formattedErrors = result.error.flatten();

      const errorMessages = [
        ...formattedErrors.formErrors,
        ...Object.values(formattedErrors.fieldErrors).flat().filter(Boolean),
      ];

      res.status(400).json({
        error: errorMessages.join(', '),
      });
      return;
    }

    // Replace body with validated & typed data
    req.body = result.data;

    next();
  };
