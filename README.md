Внимание, я не создала, и не причастна к созданию wallace toolbox. Я, только создала перевод. Поддержите автора оригинального приложения. (https://gitlab.com/suborg/wallace-toolbox)
# Wallace/Ginrou Toolbox

## Про Wallace Toolbox

Универсальный набор инструментов для настройки KaiOS - 15 полезных функций в одном небольшом приложении.

Основанно на [LibWallace](https://gist.github.com/plugnburn/00fa61006513cdb0a12adf61a6e425e1) и нескольких независимых исследований

## Текущая версия

Wallace toolbox : 0.0.6
Перевод : 1.0

## Текущий список функция

- `1`: ADB root (Требует Busybox. Лучше установить OmniBB если у вас его ещё нет.)
- `2`: Запись звонков вкл/авто/выкл (Работает на KaiOS 2.5.2 и выше, протестировано на Nokia 2720 Flip и Nokia 800 Tough)
- `3`: Установка пакета приложения (OmniSD/GerdaPkg совместимые, работает когда включено меню разработчика. Протестировано только на Nokia.)
- `4`: Перезаписывание TTL при Тетеринге до перезагрузки (Только для Qualcomm устройств)
- `5`: Редактирование IMEI1 (Только Nokia и MediaTek устройств)
- `6`: Редактирование IMEI2 (Только для Nokia и MediaTek устройств с двумя сим-картами)
- `7`: Переключение прокси вкл/выкл
- `8`: Установка прокси для браузера хост и порт
- `9`: Перезаписывание агента пользователя (Небезопасно: влияет на работу KaiOS Store, не может быть отменено до сброса до заводских настроек или ручного редактирования в WebIDE)
- `0`: Переключение диагностического порта (Только для Qualcomm устройств.)
- `*`: Запуск скрипта разгона (Только для Qualcomm устройств)
- `#`: Включить меню разработчика, и привилегированный режим (с помощью cache инъекции)
- `Кнопка Звонка`: Редактирование Wi-Fi MAC адреса (Только для Nokia и MediaTek устройств, и временно для Mediatek)
- Левая мягкая кнопка: Редактирование Bluetooth MAC адреса (Только для Nokia устройств)
- Правая мягкая кнопка: Сделать все предустановленные приложения удаляемыми из меню приложений, не затрагивая системный раздел (Требуется Busybox)

Правая, и левая мягкая кнопка подрузамивает кнопки над кнопкой назад, и горячей кнопкой. Пример : ![image](https://github.com/Cobeta-beta/ginrou-toolbox/assets/140401724/f843d652-d6cf-4dea-abb6-6045209906e9)

## Установка

Используйте WebIDE (старые версии Firefox или Pale Moon), или [gdeploy](https://gitlab.com/suborg/gdeploy) чтобы установить напрямую.

## Титры

Созданно, и улучшенно [BananaHackers](https://bananahackers.net) группой пользователей:

- Luxferre - основные исследования и кодирование;
- Anthill - Unisoc-совместимая root версия `adbd`;
- fabio_malagas - тестирование на Unisoc-устройствах.

Перевела : Cobeta https://4pda.to/forum/index.php?showuser=11373575
