# react-fertilizer-calculator

Онлайн калькулятор растворов

https://apkawa.github.io/react-fertilizer-calculator/

базируется на логике других калькуляторов:

* http://chile-forum.ru/index.php/topic,2699.0.html
* [siv237/HPG](https://github.com/siv237/HPG)

# Справка 

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

## 0.1

* [x] Сохранение состояния в localStorage
* [x] Добавление/удаление новых удобрений
    * [x] редактирование 
* [x] Добавление/удаление рецептов
    * [x] редактирование
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
    * [x] Добавить макроэлементы
        * [x] S (Сера)
    * [x] Оптимизация расчетов. Была использована модель из (HPG)[https://github.com/siv237/HPG]
    * [x] Расчет концетратов и разбавления
    * [x] Фиксация содержания фосфора при любом ppm
        т.е. при ppm 1 и ppm 2 фосфор всегда равен 40
    
* [x] Справка
* [x] Мобильная версия
* [ ] Покрутить цвета

## 0.2

Практическая.

* [ ] вывод отчета и его печать
* [ ] Документация
    * [ ] модели jupyter по расчетам
    * [ ] справка по гидропонике
* [ ] Расчет себестоимости растворов
* [x] Микроэлементы/хелаты
* [ ] Экспорт/импорт всей конфигурации в различные форматы
    * [ ] Yaml
    * [ ] json
    * [ ] xlsx [SheetJS](https://github.com/SheetJS/sheetjs)
    

## При необходимости

* [ ] Апи миксера (автоматическое смешивание концетратов)
    * [ ] Документация


# Полезная информация

* https://www.yara.nl/siteassets/toolbox/nutrient-solutions/nutrient-solutions-for-greenhouse-crops-dec2017.pdf/
* http://chile-forum.ru/index.php/topic,2512.0.html
* https://agrovesti.net/lib/tech/fertilizer-tech/mineralnye-udobreniya-prakticheskoe-posobie-po-svojstvam-i-osobennostyam-primeneniya.html
* https://floragrowing.com/ru/encyclopedia/sostavlenie-i-prigotovlenie-pitatelnogo-rastvora
* http://www.ponics.ru/2009/10/table_for_hydro/
* http://forum.ponics.ru/index.php?topic=2533.0
