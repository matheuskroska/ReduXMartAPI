# Products API

- Integração de APIs de terceiros: A API integra duas APIs de produtos de diferentes fornecedores, retornando todos os dados em um formato padrão.

- Tecnologias utilizadas: A API é construída usando Node.js, Express e Axios.

- Recursos adicionais: Limite e offset, controle de cache com Redis, tratamento de erros e implementação de padrões REST para retornos de status HTTP.

- Navegação intuitiva: O conceito de HATEOAS é seguido para guiar o usuário de forma intuitiva na navegação pela API.

- Documentação: Todo o código está documentado com a notação JSDOC para manter a clareza e a organização.

## Recursos relacionados
- self: link para a própria rota.
- next: link para a próxima página de resultados.
- prev: link para a página anterior de resultados.

## Requisições

### Get Products

`GET /products`

#### Parâmetros
- offset: o número de itens a serem ignorados antes de começar a retornar resultados.
- limit: o número máximo de itens a serem retornados.

#### Resposta de sucesso 

HTTP 200 OK

```json

{
    "message": "Products fetched successfully",
    "data": [
        {
            "id": 1,
            "name": "range of formal shirts",
            "category": "Fantastic",
            "department": "Grocery",
            "description": "New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart",
            "image": "http://placeimg.com/640/480/business",
            "material": "Metal",
            "price": "127.00",
            "hasDiscount": false,
            "discountValue": 0,
            "provider": "brazilian_provider"
        }
    ],
    "links": [
        {
            "rel": "self",
            "href": "/products?offset=0&limit=1"
        },
        {
            "rel": "next",
            "href": "/products?offset=1&limit=1"
        },
        {
            "rel": "prev",
            "href": "/products?offset=0&limit=1"
        }
    ]
}

```
#### Resposta de erro

HTTP 500 Internal Server Error

```json
{
"error": "Error fetching products"
}
```
