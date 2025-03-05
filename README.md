# Application Setup

1. **Install Composer dependencies**
   ```bash
   composer i

2. **Install NPM dependencies**
   ```bash
   npm i

3. **Build frontend assets**
   ```bash
   npm run build

4. **Run database migrations**
   ```bash
   php artisan migrate

5. **Run migrations for SQLite testing database**
   ```bash
   php artisan migrate --database=sqlite_testing

6. **Seed the database**
   ```bash
   php artisan db:seed
   
7. **Run tests**
   ```bash
   php artisan test
   
8. **Start the development server**
   ```bash
   php artisan serve