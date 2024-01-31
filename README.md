# Product Catalog API - TypeScript, Node.js, AWS

Este projeto consiste em uma API desenvolvida em TypeScript e Node.js, utilizando serviços da AWS para escalabilidade e eficiente gerenciamento de dados. Utilizamos os serviços de SNS para gerar uma mensagem contendo os dados de atualização dos nossos endpoints, colocando-a na fila no SQS, e depois consumida por uma função lambda que armazena e atualiza no bucket da S3.

## Sumário

- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Endpoints da API](#endpoints-da-api)
- [Banco de Dados](#banco-de-dados)
- [Demonstração do JSON na S3](#demonstração-do-json-na-s3)
- [Função Lambda](#função-lambda)
- [Contribuição](#contribuição)

## Instalação

1. Clone o repositório:

    ```bash
    git clone https://github.com/seu-usuario/seu-projeto.git
    ```

2. Instale as dependências:

    ```bash
    npm install
    ```

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

## Uso

1. Inicie a aplicação:

    ```bash
    npm run dev
    ```

2. A API estará acessível em http://localhost:3000.

## Endpoints da API

### Produto

- **POST /api/product:** Cria um novo produto

    ```json
    {
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

### Categoria

- **POST /api/category:** Cria uma nova categoria

    ```json
    {
      "id": "98765",
      "title": "Título da Categoria",
      "description": "Descrição da Categoria",
      "ownerId": "12345"
    }
    ```

- **GET /api/category:** Retorna todas as categorias
- **PUT /api/category/{id}:** Atualiza uma categoria
- **DELETE /api/category/{id}:** Deleta uma categoria

## Banco de Dados

Este projeto utiliza o MongoDB para armazenamento de dados. Utilizamos o Atlas para ter uma interface gráfica sem precisar instalar nenhuma dependência. [Link do Atlas](https://www.mongodb.com/cloud/atlas)

## Demonstração do JSON na S3

```json
{
  "categories": [
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
