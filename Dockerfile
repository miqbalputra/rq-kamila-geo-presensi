# Stage 1: Build React App
FROM node:20-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with PHP and Apache
FROM php:8.2-apache
RUN docker-php-ext-install pdo pdo_mysql

# Enable Apache Mod Rewrite
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy Frontend Build
COPY --from=build-stage /app/dist /var/www/html

# Copy Backend API
COPY ./api /var/www/html/api

# Copy other necessary files
COPY .htaccess /var/www/html/

# Permissions
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80
