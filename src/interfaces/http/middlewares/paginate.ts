import { Request, Response, NextFunction } from 'express';
import { parsePaginationQuery } from '@/utils/pagination';

export function paginate(req: Request, _res: Response, next: NextFunction): void {
  req.pagination = parsePaginationQuery(req.query);
  next();
}
