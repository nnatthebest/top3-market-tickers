# top3-market-tickers
Получает актуальный тикер ТОП3 бирж крипто-валют:\n\r
    -https://exmo.me
    -https://btc-e.nz
    -https://poloniex.com   
раз в 30 секунд.
                                                                          

Обновите индекс пакетов
$ sudo apt-get update


Установить CURL
$ sudo apt-get install curl


Установите nodejs из репозитория
$ curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
$ sudo apt-get install nodejs


Установить POSTGRESQL
$# echo 'deb http://apt.postgresql.org/pub/repos/apt/ xenial-pgdg main' >> /etc/apt/sources.list.d/pgdg.list
$# wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
$# sudo apt-get update
$# sudo apt-get install postgresql postgresql-contrib
$# sudo su - postgres
$# psql
$# \password postgres //Установите пароль 1234
$# \q


Установите YARN
$ curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
$sudo apt-get update && sudo apt-get install yarn


Установите GIT
$ sudo apt-get install git


Скопируйте репозиторий
$ sudo git clone https://github.com/zdzhamaldinov/top3-market-tickers.git

Сделайте миграцию в базу данных
$cd zdzhamaldinov/top3-market-tickers/scr
$ ../node_modules/.bin/sequelize db:migrate


Перейти в папку
$ cd top3-market-tickers

Подключить зависимости
$ sudo yarn install


Запустить приложение
$ node index.js
