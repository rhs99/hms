FROM node:20.10-slim
WORKDIR /code
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]