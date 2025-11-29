FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Create directories for data and uploads
RUN mkdir -p data uploads

EXPOSE 3000

CMD ["npm", "start"]
