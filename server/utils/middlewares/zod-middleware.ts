import type { Response, Request, NextFunction } from "express";
import type { z } from "zod";

export const validateZodSchema =
  <T extends z.Schema<{ params?: any; body?: any; query?: any }>>(schema: T) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await schema.safeParseAsync({
      params: req.params,
      body: req.body,
      query: req.query,
    });

    if (!result.success) {
      return res.status(422).json(result.error);
    }

    req.params = result.data.params;
    req.body = result.data.body;
    req.query = result.data.query;

    return next();
  };
