FROM node:22-alpine
WORKDIR /index
COPY package.json /index
RUN npm install
COPY . /index
CMD ["node", "index.cjs"]
