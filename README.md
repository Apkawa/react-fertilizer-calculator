# react-fertilizer-calculator

Онлайн калькулятор растворов

https://apkawa.github.io/react-fertilizer-calculator/

базируется на логике из http://chile-forum.ru/index.php/topic,2699.0.html

* [Описание методики расчетов](src/docs/technique.md)
* [Краткая справка](src/docs/how_to_use.md)

# Технологии

* typescript
* react
* react-router
* styled-components
* redux
* redux-forms
* redux-saga


# TODO

Для 0.1

* [x] Сохранение состояния в localStorage
* [x] Добавление/удаление новых удобрений
* [x] Добавление/удаление рецептов
* [x] Темная тема
* [x] Экспорт и импорт
    * [x] удобрения
    * [x] рецепты
* [ ] Логика расчетов
    * [x] Добавить % концентрацию раствора
    * [x] Расчет итогового EC / ppm
    * [x] Расчет амонийного и нитратного азота \
        https://gidroponika.com/content/view/772/237/ \
        Иначе раствор будет постоянно подщелачиваться
    * [x] Балансирование профиля [инфа](http://forum.ponics.ru/index.php?topic=336.msg134010#msg134010)
    * [ ] Добавить макроэлементы
        * [x] S (Сера)
        * [ ] Fe (Железо)
    * [x] Оптимизация расчетов
    * [ ] Учет ppm воды 
        
    
* [x] Справка
* [x] Мобильная версия
* [ ] вывод и печать расчетного профиля (https://github.com/MrRio/jsPDF)
* [ ] Покрутить цвета

# Полезная информация

* https://www.yara.nl/siteassets/toolbox/nutrient-solutions/nutrient-solutions-for-greenhouse-crops-dec2017.pdf/
* http://chile-forum.ru/index.php/topic,2512.0.html
* https://agrovesti.net/lib/tech/fertilizer-tech/mineralnye-udobreniya-prakticheskoe-posobie-po-svojstvam-i-osobennostyam-primeneniya.html
* https://floragrowing.com/ru/encyclopedia/sostavlenie-i-prigotovlenie-pitatelnogo-rastvora
* http://www.ponics.ru/2009/10/table_for_hydro/
* http://forum.ponics.ru/index.php?topic=2533.0
