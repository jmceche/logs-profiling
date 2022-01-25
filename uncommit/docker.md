# En la carpeta ~/my-docker/

sudo docker run -i -t -p "80:80" -p "3306:3306" -v ${PWD}/app:/app -v ${PWD}/mysql:/var/lib/mysql 2d9935d1db98