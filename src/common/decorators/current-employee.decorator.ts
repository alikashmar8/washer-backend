import { createParamDecorator } from '@nestjs/common';

export const CurrentEmployee = createParamDecorator((data, context) => {
  const req = context.switchToHttp().getRequest();
  return req.employee ? (data ? req.employee[data] : req.employee) : null;
});
