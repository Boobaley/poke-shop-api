import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Paginate = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  const { page, limit } = request.query;

  const defaultPageSize: number = 25;
  const defaultPageNumber: number = 0;
  const maxPageLimit: number = 100;
  const isLimitValid: boolean = limit > 0 && limit <= maxPageLimit;

  const pageSize: number = limit && isLimitValid ? +limit : defaultPageSize;
  const currentPage: number = !page || page <= 1 ? defaultPageNumber : (+page - 1) * pageSize;

  return { page: currentPage, limit: pageSize };
});
