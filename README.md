# API simples com TypeScript/NestJS

## Descrição

Uma API RESTful simples fazendo uso de:
- TypeScript
- Node.js
- NestJS
- TypeORM
- MariaDB
- Autenticação JWT
- Validação de senhas com Argon2

## Dependências

- docker-compose, ou:
- npm e mariadb/mysql.

## Iniciando

Clone este repositório:

```
$ git clone https://github.com/rfsc-mori/product-orders.git
```

## Configuração

Crie um arquivo `.env` baseado no arquivo de exemplo `.env.example`.

As variáveis de ambiente `DB_*` dependem da configuração de seu sistema, por exemplo:
- DB_HOST: `localhost` ou o endereço onde o servidor de banco de dados espera por conexões;
- DB_PORT: `3306` ou a porta configurada para o mariadb/mysql;
- DB_USER: o usuário do banco de dados, preferencialmente com permissões limitadas;
- DB_PASSWORD: a senha de autenticação para o usuário do banco de dados;
- DB_NAME: o nome da database/schema que a aplicação usará.

As variáveis `JWT_*` correspondem ao sistema de autenticação de usuário da API:
- JWT_SECRET: usado para assinar o token de autenticação;
- JWT_EXPIRES: a duração do token de autenticação, em texto (ex: 60s, 1d).

A variável `APP_PORT` define a porta em que a API receberá conexões, por padrão utiliza a porta `3000`.

## Via Docker

Execute o comando abaixo e a API estará disponível após a inicialização do container:

```
$ docker-compose up
```

---

## Manualmente

Instale as dependências localmente via npm:

```
$ npm install
```

## Preparando

Após finalizar a configuração e salvar o arquivo `.env` execute:

```
$ npm run build
```

Para preparar o banco de dados, novamente execute o próximo comando:

```
$ npm run-script migration:run
```

## Importando dados da API do Mercado Livre

Execute o comando e aguarde até que a operação termine:

```
$ npm run-script db:populate
```

Este comando aceita dois parâmetros posicionais:
- O número de produtos a importar de cada categoria (mínimo 4);
- O endereço base da API que fornecerá as categorias e produtos.

Exemplo:

```
$ npm run-script db:populate 6 https://api.mercadolibre.com/sites/MLB/
```

No modo container, através do docker, este passo é executado automaticamente com os valores padrão. Se necessário edite o arquivo `docker-compose.yml` ou aplique a configuração através de um `docker-compose.override.yml`.

## Iniciando a aplicação

```bash
# ambiente de desenvolvimento
$ npm run start

# ambiente de produção
$ npm run start:prod
```

---

## Rotas

- `POST` `/api/users/register`: Cadastro de usuários.  

Exemplo de entrada:
```json
{
  "name": "test",
  "email": "test@test.com",
  "password": "test"
}
```

- `GET` `/api/users/:id`: Retorna os dados de um usuário por id.


- `POST` `/api/auth/login`: Rota de login.  

Exemplo de entrada:
```json
{
  "email": "test@test.com",
  "password": "test"
}
```

Quando ou o email ou a senha estão errados a API retorna erro 401 e uma mensagem indicando que as credenciais utilizadas não são válidas.

Em caso de sucesso, o token de autenticação é enviado no campo `access_token`:

```json
{
  "access_token": "token...",
  "token_type": "JWT",
  "expires_in": 86400000
}
```

Para todas as rotas a seguir a requisição HTTP deve conter o cabeçário de autenticação:

```
Authorization: Bearer token...
```

- `GET` `/api/categories`: Rota que retorna 4 categorias fixas de acordo com o teste proposto.

São elas:
```
Câmeras e Acessórios
Celulares e Telefones
Eletrônicos, Áudio e Vídeo
Games
```

- `GET` `/api/products?category_id=:id`: Retorna todos os produtos cadastrados nesta categoria.

- `GET` `/api/product?id=:id`: Retorna um produto identificado pelo parâmetro id.

- `GET` `/api/categories/:categoryId/prices`: Retorna todos os produtos da categoria identificada pelo categoryId, ordenado do menor preço para o maior preço.

- `POST` `/api/orders`: Registra um novo pedido para o usuário atualmente autenticado (via JWT). Os produtos solicitados tem seu estoque disponível reduzido por 1 após esta operação.

Exemplo de entrada:
```json
{
  "productIds": [
    "MLB1858757316"
  ]
}
```

- `GET` `/api/orders`: Retorna uma lista de todos os pedidos e produtos com o nome do usuário atual.

- `GET` `/api/orders/:id`: Retorna um dos pedidos do usuário autenticado.

---

## Notas

A DDL do banco de dados está na pasta `sql` do projeto, assim como o diagrama que representa as tabelas, campos e relacionamentos.

---

## Licença

Este projeto é distribuído sob a licença [MIT](LICENSE.MIT).

Copyright (c) 2022 Rafael Fillipe Silva
