# top3-market-tickers
Получает актуальный тикер ТОП3 бирж крипто-валют:<br>
    -https://exmo.me   <br>
    -https://btc-e.nz <br>
    -https://poloniex.com   <br>
раз в 30 секунд.<br>
                                                                          
<hr>
###Обновите индекс пакетов<br>
$ sudo apt-get update<br>


###Установить CURL<br>
$ sudo apt-get install curl<br>


###Установите nodejs из репозитория<br>
$ curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -<br>
$ sudo apt-get install nodejs<br>


###Установить POSTGRESQL<br>
$# echo 'deb http://apt.postgresql.org/pub/repos/apt/ xenial-pgdg main' >> /etc/apt/sources.list.d/pgdg.list<br>
$# wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -<br>
$# sudo apt-get update<br>
$# sudo apt-get install postgresql postgresql-contrib<br>
$# sudo su - postgres<br>
$# psql<br>
$# \password postgres //Установите пароль 1234<br>
$# \q<br>


###Установите YARN<br>
$ curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -<br>
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list<br>
$sudo apt-get update && sudo apt-get install yarn<br>


###Установите GIT<br>
$ sudo apt-get install git<br>


###Скопируйте репозиторий<br>
$ sudo git clone https://github.com/zdzhamaldinov/top3-market-tickers.git<br>

###Сделайте миграцию в базу данных<br>
$cd zdzhamaldinov/top3-market-tickers/scr<br>
$ ../node_modules/.bin/sequelize db:migrate<br>


###Подключить зависимости<br>
$ cd top3-market-tickers<br>
$ sudo yarn install<br>


###Запустить приложение<br>
$ node index.js<br>
