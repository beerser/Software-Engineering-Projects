FROM node:18

WORKDIR /Back-end

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5001

CMD ["node", "server.js", "dev"]