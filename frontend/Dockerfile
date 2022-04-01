FROM node:14

WORKDIR app

copy build .

RUN npm install -g serve

CMD ["serve", "-s", ".", "-l", "3000"]