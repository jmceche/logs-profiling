# INSTRUCCIONES

## Levantar servidor con node:

### FORK
```bash
  node server.js --mode=fork
```

### CLUSTER
```bash
  node server.js --mode=cluster
```

## Levantar servidor con forever:

```bash
  forever start server.js
```

## Detener proceso en forever:

```bash
  forever stopall
```

## Levantar servidor con pm2:

### FORK
```bash
  pm2 start server.js
```

### CLUSTER
```bash
  pm2 start server.js --watch -i max
```

## Deter proceso en pm2:
```bash
  pm2 stop server.js
```

# NGINX
Utilice ubuntu para realizar este entregable, el nginx.conf de ubuntu tiene un include para cada site creado, estas son las configuraciones especificas de la app.