# === STAGE 1: Build Angular app ===
FROM node:16-alpine AS build

WORKDIR /app

# Copy dependency files first (better caching)
COPY package*.json ./

# Clean, reproducible install
RUN npm ci

# Copy source code
COPY . .

# Build Angular 13 in production mode
RUN npx ng build --configuration production
# or (also valid for Angular 13)
# RUN npx ng build --prod

# === STAGE 2: Nginx ===
FROM nginx:alpine

# Angular SPA routing support
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ⚠️ Replace with your real app name from angular.json
COPY --from=build /app/dist/reporting-ui /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]