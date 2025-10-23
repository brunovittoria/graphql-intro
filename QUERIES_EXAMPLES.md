# GraphQL POC - Exemplos de Queries e Mutations

Este arquivo contém exemplos práticos de como usar a API GraphQL da POC.

## 🚀 Como testar

1. **Inicie a aplicação**:

   ```bash
   npm run start:dev
   ```

2. **Acesse o GraphQL Playground**:
   - URL: `http://localhost:3000/graphql`
   - Interface visual para testar queries e mutations

3. **Execute os exemplos abaixo** no playground

---

## 📖 Queries (Consultas)

### 1. Buscar todos os autores

```graphql
query {
  authors {
    id
    name
    email
    createdAt
  }
}
```

**O que faz**: Retorna uma lista com todos os autores cadastrados.

### 2. Buscar um autor específico

```graphql
query {
  author(id: "ID_DO_AUTOR") {
    id
    name
    email
    createdAt
  }
}
```

**O que faz**: Busca um autor específico pelo ID.

### 3. Buscar autores com seus posts

```graphql
query {
  authors {
    id
    name
    posts {
      id
      title
      slug
      published
    }
  }
}
```

**O que faz**: Busca todos os autores e seus posts relacionados.
**Importante**: Esta query demonstra Field Resolvers em ação!

### 4. Buscar todos os posts

```graphql
query {
  posts {
    id
    title
    slug
    content
    published
    createdAt
  }
}
```

**O que faz**: Retorna uma lista com todos os posts.

### 5. Buscar um post específico

```graphql
query {
  post(id: "ID_DO_POST") {
    id
    title
    slug
    content
    published
    createdAt
  }
}
```

**O que faz**: Busca um post específico pelo ID.

### 6. Buscar posts com seus autores

```graphql
query {
  posts {
    id
    title
    author {
      id
      name
      email
    }
  }
}
```

**O que faz**: Busca todos os posts e seus autores relacionados.
**Importante**: Esta query demonstra Field Resolvers em ação!

### 7. Query complexa - Posts com autores e posts dos autores

```graphql
query {
  posts {
    id
    title
    author {
      id
      name
      posts {
        id
        title
      }
    }
  }
}
```

**O que faz**: Busca posts, seus autores, e todos os posts de cada autor.
**Demonstra**: Relacionamentos aninhados e Field Resolvers.

---

## ✏️ Mutations (Mutações)

### 1. Criar um novo autor

```graphql
mutation {
  createAuthor(input: { name: "João Silva", email: "joao@email.com" }) {
    id
    name
    email
    createdAt
  }
}
```

**O que faz**: Cria um novo autor no banco de dados.
**Retorna**: O autor criado com todos os campos.

### 2. Atualizar um autor

```graphql
mutation {
  updateAuthor(input: { id: "ID_DO_AUTOR", name: "João Santos" }) {
    id
    name
    email
  }
}
```

**O que faz**: Atualiza apenas o nome do autor.
**Importante**: Campos não fornecidos mantêm seus valores atuais.

### 3. Atualizar email do autor

```graphql
mutation {
  updateAuthor(input: { id: "ID_DO_AUTOR", email: "novo@email.com" }) {
    id
    name
    email
  }
}
```

**O que faz**: Atualiza apenas o email do autor.

### 4. Deletar um autor

```graphql
mutation {
  deleteAuthor(id: "ID_DO_AUTOR")
}
```

**O que faz**: Remove o autor do banco de dados.
**Retorna**: `true` se deletado com sucesso, `false` se houver erro.

### 5. Criar um novo post

```graphql
mutation {
  createPost(
    input: {
      title: "Meu Primeiro Post"
      slug: "meu-primeiro-post"
      content: "Este é o conteúdo do meu primeiro post..."
      published: true
      authorId: "ID_DO_AUTOR"
    }
  ) {
    id
    title
    slug
    content
    published
    createdAt
  }
}
```

**O que faz**: Cria um novo post associado a um autor.
**Retorna**: O post criado com todos os campos.

### 6. Atualizar um post

```graphql
mutation {
  updatePost(
    input: { id: "ID_DO_POST", title: "Título Atualizado", published: true }
  ) {
    id
    title
    slug
    content
    published
  }
}
```

**O que faz**: Atualiza o título e status de publicação do post.

### 7. Deletar um post

```graphql
mutation {
  deletePost(id: "ID_DO_POST")
}
```

**O que faz**: Remove o post do banco de dados.
**Retorna**: `true` se deletado com sucesso, `false` se houver erro.

---

## 🔄 Fluxo Completo de Exemplo

### Passo 1: Criar um autor

```graphql
mutation {
  createAuthor(input: { name: "Maria Santos", email: "maria@email.com" }) {
    id
    name
    email
  }
}
```

### Passo 2: Criar posts para o autor

```graphql
mutation {
  createPost(
    input: {
      title: "Post 1"
      slug: "post-1"
      content: "Conteúdo do post 1"
      published: true
      authorId: "ID_RETORNADO_NO_PASSO_1"
    }
  ) {
    id
    title
  }
}
```

```graphql
mutation {
  createPost(
    input: {
      title: "Post 2"
      slug: "post-2"
      content: "Conteúdo do post 2"
      published: false
      authorId: "ID_RETORNADO_NO_PASSO_1"
    }
  ) {
    id
    title
  }
}
```

### Passo 3: Buscar autor com todos os posts

```graphql
query {
  author(id: "ID_RETORNADO_NO_PASSO_1") {
    id
    name
    email
    posts {
      id
      title
      published
    }
  }
}
```

### Passo 4: Buscar posts com seus autores

```graphql
query {
  posts {
    id
    title
    published
    author {
      id
      name
    }
  }
}
```

---

## 🎯 Dicas Importantes

### 1. **Lazy Loading**

- Campos só são buscados quando solicitados
- Se não pedir `posts` na query do autor, não será executada a query dos posts

### 2. **Field Resolvers**

- Os campos `posts` e `author` são resolvidos dinamicamente
- Cada relacionamento pode ter sua própria lógica

### 3. **Partial Updates**

- Em mutations de atualização, apenas os campos fornecidos são atualizados
- Campos não fornecidos mantêm seus valores atuais

### 4. **Tratamento de Erros**

- Mutations de deleção retornam `Boolean`
- `true` = sucesso, `false` = erro

### 5. **IDs**

- Todos os IDs são UUIDs gerados automaticamente
- Use os IDs retornados nas mutations para fazer queries

---

## 🚨 Problemas Comuns

### 1. **Erro: "Cannot query field"**

- Verifique se o campo existe no schema
- Verifique se está usando a sintaxe correta

### 2. **Erro: "Variable was not provided"**

- Verifique se todos os campos obrigatórios estão sendo fornecidos
- Verifique se os tipos estão corretos

### 3. **Erro: "Field resolve error"**

- Verifique se o ID existe no banco de dados
- Verifique se as relações estão corretas

### 4. **Performance lenta**

- Evite queries muito aninhadas
- Use paginação para listas grandes
- Considere implementar DataLoader para resolver N+1 queries

---

_Use estes exemplos como referência para testar e entender como funciona a API GraphQL da POC!_
