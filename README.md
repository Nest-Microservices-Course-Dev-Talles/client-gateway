## Client gateway

Es el punto de comunicación entre nuestros clientes y nuestros servicios.

## Dev

1. Clonar el repositorio
2. Instalar dependencias
3. Crear un archivo `.env` basado en el `.env.template`
4. Levantar el servidor de NATS

```
docker run -d --name nats-server -p 4222:4222 -p 8222:8222 nats
```

5. Tener levantados los microservicios
6. Ejecutar `npm run start:dev`

## Nats

```

docker run -d --name nats-server -p 4222:4222 -p 8222:8222 nats
```
