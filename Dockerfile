FROM mysql:8.0

ENV MYSQL_ROOT_PASSWORD test
ENV MYSQL_DATABASE workly
ENV MYSQL_USER employee
ENV MYSQL_PASSWORD test1234

COPY ./my.cnf /etc/mysql/conf.d/my.cnf