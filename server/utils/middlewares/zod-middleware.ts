import type { Response, Request, NextFunction, RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { z } from "zod";

export const validateZodSchema =
  <T extends z.Schema, P extends ParamsDictionary, ResBody>(
    schema: T
  ): RequestHandler<P, ResBody, z.infer<T>> =>
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await schema.safeParseAsync(req.body);

    if (result.success) {
      req.body = result.data;
      return next();
    } else {
      return res.status(422).json(result.error);
    }
  };
