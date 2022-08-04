import type { Response, Request, NextFunction } from "express";
import type { AnyZodObject } from "zod";

export const validateZodSchema =
  <T extends AnyZodObject>(schema: T) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (err) {
      return res.status(422).json(err);
    }
  };
