FROM node:22-alpine
WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps
RUN npm run build
CMD ["npm", "run", "start"]
