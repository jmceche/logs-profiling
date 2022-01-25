##
# You should look at the following URL's in order to grasp a solid understanding
# of Nginx configuration files in order to fully unleash the power of Nginx.
# https://www.nginx.com/resources/wiki/start/
# https://www.nginx.com/resources/wiki/start/topics/tutorials/config_pitfalls/
# https://wiki.debian.org/Nginx/DirectoryStructure
#
# In most cases, administrators will remove this file from sites-enabled/ and
# leave it as reference inside of sites-available where it will continue to be
# updated by the nginx packaging team.
#
# This file will automatically load configuration files provided by other
# applications, such as Drupal or Wordpress. These applications will be made
# available underneath a path with that package name, such as /drupal8.
#
# Please see /usr/share/doc/nginx-doc/examples/ for more detailed examples.
##

# Default server configuration
#

upstream node_app {
    	server 127.0.0.1:8082;
   	server 127.0.0.1:8083;
   	server 127.0.0.1:8084;
   	server 127.0.0.1:8085;
  	}

server {
	listen 80;
	listen [::]:80;


	root /home/juanbbx/coder-back/clase-28/global-processes/views;

	# Add index.php to the list if you are using PHP
	index main.hbs index.html index.htm index.nginx-debian.html;

	server_name nodeapp.com;

	location /info/ {
		root html;
		index index.html;

	}

	location /api/randoms/ {
		proxy_pass   http://node_app;
	}


}


