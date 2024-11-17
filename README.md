# Заказной сервис

Это веб-приложение для создания и управления заказами для клиентов и администраторов. Клиенты могут создавать заказы, загружать фото и описания, просматривать свои заказы, а администраторы могут управлять ценами, импортировать данные, выдавать товары и управлять клиентами.

## Установка

1. Клонируйте репозиторий на ваш локальный компьютер:

   ```bash
   git clone https://github.com/AbdullaevN/arzan-al.git
Перейдите в каталог проекта:
cd arzan-al
Установите зависимости:

Для использования npm:
 
npm install
Для использования yarn:
 
yarn install
Запуск проекта
После установки зависимостей, вы можете запустить проект локально.

Для запуска локального сервера, используйте команду:
npm run dev
Или для использования yarn:
 
yarn dev
Теперь приложение будет доступно по адресу http://localhost:3000.

Структура проекта
src — исходный код приложения.
components — компоненты интерфейса.
assets — изображения и другие ресурсы.
pages — страницы приложения для клиентов и администраторов.
styles — файлы стилей.
public — публичные ресурсы (например, иконки).
Основной функционал
Для клиента:
Регистрация и логин.
Создание заказов с фото и описанием.
Просмотр всех заказов.
Поиск заказов по коду.
Архив заказов.
Информация о текущем статусе заказов.
Для администратора:
Управление ценами.
История всех заказов с фильтрацией.
Импорт документов (например, CSV/Excel).
Страница для выдачи товаров клиентам.
Управление данными клиентов.
Базовые команды для разработки
npm run dev — запуск приложения в режиме разработки.
npm run build — создание сборки проекта для продакшн.
npm run start — запуск продакшн-сервера.
Технологии
React — библиотека для построения пользовательского интерфейса.
Vite — сборщик для разработки на JavaScript.
Tailwind CSS — утилитарный фреймворк для CSS.
Node.js — среда выполнения JavaScript на серверной стороне.
Лицензия
Этот проект лицензирован на условиях MIT License. Подробности см. в файле LICENSE.


### Описание файла:
- В `README.md` указаны основные шаги для установки и запуска проекта.
- Приведены команды для разработки и сборки.
- Описан функционал для пользователей (клиентов и администраторов).
- Указаны используемые технологии (React, Vite, Tailwind CSS и т. д.).

Этот файл будет полезен для всех, кто хочет начать работать с проектом или понять, как его настроить.




Запуск json server
 json-server --watch db.json --port 5000
 