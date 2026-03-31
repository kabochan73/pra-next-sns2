FROM php:8.3-fpm-alpine

# 必要な拡張とツールのインストール
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    oniguruma-dev \
    && docker-php-ext-install \
        pdo_mysql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd

# Composer のインストール
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# www-data ユーザーで実行
RUN chown -R www-data:www-data /var/www/html

USER www-data
