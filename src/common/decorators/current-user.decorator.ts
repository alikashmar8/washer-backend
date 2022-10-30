import { createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data, context) => {
  const req = context.switchToHttp().getRequest();
  return req.user ? (data ? req.user[data] : req.user) : null;
});
