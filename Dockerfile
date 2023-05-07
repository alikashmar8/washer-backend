# FROM public.ecr.aws/lambda/nodejs:12
FROM public.ecr.aws/lambda/nodejs:12

COPY . .

RUN npm run build

CMD ["dist/lambda.handler"]