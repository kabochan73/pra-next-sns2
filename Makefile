.PHONY: help build up down restart logs shell-app shell-frontend laravel-install next-install migrate fresh seed

help:
	@echo "使用可能なコマンド:"
	@echo "  make build          - Dockerイメージをビルド"
	@echo "  make up             - コンテナを起動"
	@echo "  make down           - コンテナを停止"
	@echo "  make restart        - コンテナを再起動"
	@echo "  make logs           - ログを表示"
	@echo "  make shell-app      - appコンテナに入る"
	@echo "  make shell-frontend - frontendコンテナに入る"
	@echo "  make laravel-install - Laravelをインストール"
	@echo "  make next-install   - Next.jsをインストール"
	@echo "  make migrate        - マイグレーションを実行"
	@echo "  make fresh          - DBをリセットしてマイグレーション"
	@echo "  make seed           - シーダーを実行"

build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

logs:
	docker compose logs -f

shell-app:
	docker compose exec app sh

shell-frontend:
	docker compose exec frontend sh

laravel-install:
	docker compose exec app composer create-project laravel/laravel . --prefer-dist

next-install:
	docker compose run --rm frontend sh -c "cd /tmp && npx create-next-app@latest myapp --typescript --tailwind --eslint --app --src-dir --import-alias '@/*' --no-git && cp -r /tmp/myapp/. /app/"

migrate:
	docker compose exec app php artisan migrate

fresh:
	docker compose exec app php artisan migrate:fresh --seed

seed:
	docker compose exec app php artisan db:seed
