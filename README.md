# Product Catalog API - TypeScript, Node.js, AWS

Este projeto consiste em uma API desenvolvida em TypeScript e Node.js, utilizando serviços da AWS para escalabilidade e eficiente gerenciamento de dados. Utilizamos os serviços de SNS para gerar uma mensagem contendo os dados de atualização dos nossos endpoints, colocando-a na fila no SQS, e depois consumida por uma função lambda que armazena e atualiza no bucket da S3.

## Sumário

- [Instalação](#instalação)
- [Uso](#uso)
- [AWS](#AWS)
- [Endpoints da API](#endpoints-da-api)
- [Banco de Dados](#banco-de-dados)
- [Demonstração do JSON na S3](#Resultado-json-na-s3)

## Instalação

1. Clone o repositório:

    ```bash
    git clone https://github.com/seu-usuario/seu-projeto.git
    ```

2. Instale as dependências:

    ```bash
    npm install
    ```
#### ou se você usa docker siga para proxima etapa

3. Configure as variáveis de ambiente. Crie um arquivo `.env` com suas credenciais da AWS:

    ```dotenv
    CONNECTIONSTRING=sua-chave-CONNECTIONSTRING
    JWT_SECRET=sua-chave-JWT_SECRET
    REFRESH_TOKEN_SECRET=sua-chave-REFRESH_TOKEN_SECRET
    AWS_SERVICE_KEY=sua-chave-AWS_SERVICE_KEY
    AWS_SECRET_KEY=sua-chave-AWS_SECRET_KEY
    AWS_REGION=sua-chave-AWS_REGION
    AWS_SNS_TOPIC_ARN=sua-chave-AWS_SNS_TOPIC_ARN
    ```
    ou no arquivo `docker-compose.yml`

     ```dotenv
    CONNECTIONSTRING=sua-chave-CONNECTIONSTRING
    JWT_SECRET=sua-chave-JWT_SECRET
    REFRESH_TOKEN_SECRET=sua-chave-REFRESH_TOKEN_SECRET
    AWS_SERVICE_KEY=sua-chave-AWS_SERVICE_KEY
    AWS_SECRET_KEY=sua-chave-AWS_SECRET_KEY
    AWS_REGION=sua-chave-AWS_REGION
    AWS_SNS_TOPIC_ARN=sua-chave-AWS_SNS_TOPIC_ARN
    ```

## Uso

1. Inicie a aplicação com npm:

    ```bash
    npm run dev
    ```
ou

2. Inicie a aplicação com docker

    ```bash
    docker compose up --build -d
    ```

3. A API estará acessível em http://localhost:3000.

## AWS

#### Configuração dos Serviços da AWS

    Crie um Usuário IAM:
    1.1. Crie um usuário IAM no console da AWS.
    1.2. Copie e cole a região, a chave de acesso e a chave secreta do usuário IAM nas variáveis de ambiente do seu projeto.
    1.3. Dê as seguintes permissões ao usuário IAM:
        S3 Full Access
        SQS Full Access
        SNS Full Access

    Crie um Tópico com SNS:
    2.1. Crie um tópico no console do SNS.
    2.2. Copie o ARN fornecido para o tópico e cole nas variáveis de ambiente do seu projeto.

    Crie um Serviço de Fila com SQS:
    3.1. Crie uma fila no console do SQS.
    3.2. Configure uma assinatura do SNS para a fila no console do SQS.

    Crie um Bucket na S3:
    4.1. Crie um bucket no console do S3.

    Crie uma Função Lambda:
    5.1. Crie uma função Lambda no console da AWS.
    5.2. Dê as seguintes permissões à função Lambda:
        S3: Execute operations
        SQS: Full Access



## Endpoints da API

### Users

Aqui incluimos autenticação com JWT, validações de email, senhas.

- **POST /api/users:** Cria um novo produto

    ```json
    {
      "id": "ef1v1g81ynb1t84nt50b8v5",
      "name": "Nome do usuário",
      "email": "email do user",
      "password": "Senha"
    }
    ```

- **GET /api/users:** Retorna todos os produtos
- **PUT /api/users/{id}:** Atualiza um produto
- **DELETE /api/users/{id}:** Deleta um produto

### Categoria

- **POST /api/category:** Cria uma nova categoria

    ```json
    {
      "id": "ef1v1g81ynb1t84nt50b8v5",
      "title": "Título da Categoria",
      "description": "Descrição da Categoria",
      "ownerId": "12345"
    }
    ```

- **GET /api/category:** Retorna todas as categorias
- **PUT /api/category/{id}:** Atualiza uma categoria
- **DELETE /api/category/{id}:** Deleta uma categoria

### Produto

- **POST /api/product:** Cria um novo produto

    ```json
    {
      "id": "ef1v1g81ynb1t84nt50b8v5",
      "title": "Título do Produto",
      "description": "Descrição do Produto",
      "ownerId": "12345",
      "categoryId": "67890",
      "price": 10000
    }
    ```

- **GET /api/product:** Retorna todos os produtos
- **PUT /api/product/{id}:** Atualiza um produto
- **DELETE /api/product/{id}:** Deleta um produto


## Banco de Dados

Este projeto utiliza o MongoDB para armazenamento de dados. Utilizamos o Atlas para ter uma interface gráfica sem precisar instalar nenhuma dependência. [Link do Atlas](https://www.mongodb.com/cloud/atlas)

## Resultado JSON na S3

```json
{
  "categories": [
    {
      "id": "9865bngr7r4310v68b65",
      "title": "Título da Categoria1",
      "description": "Descrição da Categoria",
      "products": [
        {
          "title": "Título do Produto1",
          "description": "Descrição do Produto",
          "ownerId": "12345",
          "categoryId": "67890",
          "price": 10000
        },
        {
          "title": "Título do Produto2",
          "description": "Descrição do Produto",
          "categoryId": "67890",
          "price": 10000
        }
      ]
    },
    {
      "id": "98765",
      "title": "Título da Categoria1",
      "description": "Descrição da Categoria",
      "products": [
        {
          "title": "Título do Produto1",
          "description": "Descrição do Produto",
          "ownerId": "12345",
          "categoryId": "67890",
          "price": 10000
        },
        {
          "title": "Título do Produto2",
          "description": "Descrição do Produto",
          "categoryId": "67890",
          "price": 10000
        }
      ]
    }
  ]
}
