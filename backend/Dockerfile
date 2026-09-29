FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
