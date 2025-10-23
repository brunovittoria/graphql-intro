# GraphQL - Core Concepts e Conceitos Avançados

## 📚 Core Concepts do GraphQL

### 1. Queries (Consultas)

**O que são**: Operações de leitura que não modificam dados.

```graphql
# Query simples
query {
  authors {
    id
    name
    email
  }
}

# Query com argumentos
query {
  author(id: "123") {
    name
    posts {
      title
    }
  }
}
```

**Características**:

- Sempre retornam dados (nunca modificam)
- Podem ser aninhadas (buscar posts de um autor)
- Suportam argumentos para filtrar/buscar dados específicos

**📁 Exemplos na POC**:

- [`src/authors/graphql/resolvers/authors.resolver.ts`](src/authors/graphql/resolvers/authors.resolver.ts#L35-L38) - Query `authors()`
- [`src/authors/graphql/resolvers/authors.resolver.ts`](src/authors/graphql/resolvers/authors.resolver.ts#L47-L52) - Query `author(id)`
- [`src/posts/graphql/resolvers/posts.resolver.ts`](src/posts/graphql/resolvers/posts.resolver.ts#L40-L43) - Query `posts()`
- [`src/posts/graphql/resolvers/posts.resolver.ts`](src/posts/graphql/resolvers/posts.resolver.ts#L52-L57) - Query `post(id)`

### 2. Mutations (Mutações)

**O que são**: Operações que modificam dados (criar, atualizar, deletar).

```graphql
# Mutation de criação
mutation {
  createAuthor(input: { name: "João Silva", email: "joao@email.com" }) {
    id
    name
  }
}

# Mutation de atualização
mutation {
  updateAuthor(input: { id: "123", name: "João Santos" }) {
    id
    name
  }
}
```

**Características**:

- Sempre modificam dados
- Retornam o resultado da operação
- Podem ter efeitos colaterais

**📁 Exemplos na POC**:

- [`src/authors/graphql/resolvers/authors.resolver.ts`](src/authors/graphql/resolvers/authors.resolver.ts#L63-L68) - Mutation `createAuthor()`
- [`src/authors/graphql/resolvers/authors.resolver.ts`](src/authors/graphql/resolvers/authors.resolver.ts#L77-L85) - Mutation `updateAuthor()`
- [`src/authors/graphql/resolvers/authors.resolver.ts`](src/authors/graphql/resolvers/authors.resolver.ts#L95-L105) - Mutation `deleteAuthor()`
- [`src/posts/graphql/resolvers/posts.resolver.ts`](src/posts/graphql/resolvers/posts.resolver.ts#L70-L75) - Mutation `createPost()`
- [`src/posts/graphql/resolvers/posts.resolver.ts`](src/posts/graphql/resolvers/posts.resolver.ts#L85-L93) - Mutation `updatePost()`
- [`src/posts/graphql/resolvers/posts.resolver.ts`](src/posts/graphql/resolvers/posts.resolver.ts#L107-L117) - Mutation `deletePost()`

### 3. Types (Tipos)

**O que são**: Definições da estrutura de dados.

```graphql
type Author {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
  createdAt: DateTime!
}
```

**Tipos de campos**:

- `!` = obrigatório (non-null)
- `[Type]` = array
- `String`, `Int`, `Boolean`, `ID` = tipos primitivos

**📁 Exemplos na POC**:

- [`src/authors/graphql/models/author.ts`](src/authors/graphql/models/author.ts#L19-L47) - Type `Author` com relacionamento
- [`src/posts/graphql/models/post.ts`](src/posts/graphql/models/post.ts#L27-L70) - Type `Post` com relacionamento

### 4. Inputs (Entradas)

**O que são**: Tipos especiais para receber dados em mutations.

```graphql
input CreateAuthorInput {
  name: String!
  email: String!
}

input UpdateAuthorInput {
  id: ID!
  name: String
  email: String
}
```

**Diferença entre Type e Input**:

- **Type**: Para dados que são RETORNADOS
- **Input**: Para dados que são ENVIADOS

**📁 Exemplos na POC**:

- [`src/authors/graphql/models/create-author.input.ts`](src/authors/graphql/models/create-author.input.ts#L17-L35) - Input para criar autor
- [`src/authors/graphql/models/update-author.input.ts`](src/authors/graphql/models/update-author.input.ts#L18-L42) - Input para atualizar autor
- [`src/posts/graphql/models/create-post.input.ts`](src/posts/graphql/models/create-post.input.ts#L19-L42) - Input para criar post
- [`src/posts/graphql/models/update-post.input.ts`](src/posts/graphql/models/update-post.input.ts#L18-L41) - Input para atualizar post

### 5. Resolvers (Resolvedores)

**O que são**: Funções que implementam a lógica para cada campo.

```typescript
@Query(() => [Author])
authors() {
  return this.prisma.author.findMany()
}

@Mutation(() => Author)
createAuthor(@Args('input') input: CreateAuthorInput) {
  return this.prisma.author.create({ data: input })
}
```

**📁 Exemplos na POC**:

- [`src/authors/graphql/resolvers/authors.resolver.ts`](src/authors/graphql/resolvers/authors.resolver.ts) - Resolver completo de Authors
- [`src/posts/graphql/resolvers/posts.resolver.ts`](src/posts/graphql/resolvers/posts.resolver.ts) - Resolver completo de Posts
- [`src/database/prisma/prisma.service.ts`](src/database/prisma/prisma.service.ts) - Serviço de banco de dados

## 🔗 Field Resolvers (Resolvedores de Campo)

### O que são Field Resolvers?

Field Resolvers são funções especiais que resolvem campos específicos de um tipo GraphQL.

### Como funcionam?

```typescript
@ResolveField('posts', () => [Post])
async posts(@Parent() author: Author) {
  return this.prisma.post.findMany({
    where: { authorId: author.id }
  })
}
```

### Vantagens:

1. **Lazy Loading**: Campos só são resolvidos quando solicitados
2. **Flexibilidade**: Cada campo pode ter sua própria lógica
3. **Performance**: Evita queries desnecessárias

### Exemplo prático:

```graphql
# Cliente pede apenas nomes dos autores
query {
  authors {
    name
  }
}
# Resultado: 1 query ao banco (só busca autores)

# Cliente pede autores com posts
query {
  authors {
    name
    posts {
      title
    }
  }
}
# Resultado: 1 query para autores + 1 query por autor para posts
```

## ⚡ DataLoader - Solução para N+1 Queries

### O problema N+1:

```typescript
// ❌ Problema: Se temos 10 autores, fazemos 11 queries
// 1 query para buscar autores + 10 queries para buscar posts de cada autor
authors.forEach(author => {
  posts = await prisma.post.findMany({ where: { authorId: author.id } })
})
```

### Como o DataLoader resolve:

```typescript
// ✅ Solução: DataLoader agrupa e faz batch das queries
const authorLoader = new DataLoader(async authorIds => {
  const posts = await prisma.post.findMany({
    where: { authorId: { in: authorIds } },
  })
  return authorIds.map(id => posts.filter(post => post.authorId === id))
})
```

### Vantagens do DataLoader:

1. **Batch Loading**: Agrupa múltiplas queries em uma
2. **Caching**: Evita queries duplicadas
3. **Performance**: Reduz drasticamente o número de queries

### Exemplo de implementação:

```typescript
// 1. Criar o loader
const authorLoader = new DataLoader(async (authorIds) => {
  const authors = await prisma.author.findMany({
    where: { id: { in: authorIds } }
  })
  return authorIds.map(id => authors.find(author => author.id === id))
})

// 2. Usar no Field Resolver
@ResolveField('author', () => Author)
async author(@Parent() post: Post) {
  return authorLoader.load(post.authorId)
}
```

**📁 Problema N+1 na POC**:

- [`src/authors/graphql/resolvers/authors.resolver.ts`](src/authors/graphql/resolvers/authors.resolver.ts#L123-L127) - Comentário sobre problema N+1
- [`src/posts/graphql/resolvers/posts.resolver.ts`](src/posts/graphql/resolvers/posts.resolver.ts#L140-L145) - Field Resolver que pode causar N+1

## 🔄 Subscriptions (Assinaturas)

### O que são Subscriptions?

Subscriptions permitem conexões em tempo real entre cliente e servidor.

### Casos de uso:

- **Chat em tempo real**: Novas mensagens aparecem instantaneamente
- **Notificações**: Alertas de novos posts, comentários
- **Dashboard**: Métricas atualizadas em tempo real
- **Colaboração**: Múltiplos usuários editando o mesmo documento

### Como funcionam:

```typescript
@Subscription(() => Post)
postCreated() {
  return pubSub.asyncIterator('POST_CREATED')
}

@Mutation(() => Post)
async createPost(@Args('input') input: CreatePostInput) {
  const post = await this.prisma.post.create({ data: input })

  // Notifica todos os subscribers
  pubSub.publish('POST_CREATED', { postCreated: post })

  return post
}
```

### Exemplo de uso no cliente:

```graphql
subscription {
  postCreated {
    id
    title
    author {
      name
    }
  }
}
```

### Tecnologias utilizadas:

- **WebSockets**: Conexão persistente
- **Server-Sent Events (SSE)**: Mais simples que WebSockets
- **GraphQL Subscriptions**: Padrão para subscriptions em GraphQL

## 🏗️ Best Practices

### 1. Organização de Código

```
src/
├── authors/
│   ├── graphql/
│   │   ├── models/          # ObjectTypes e InputTypes
│   │   └── resolvers/       # Resolvers
│   └── authors.module.ts
├── posts/
│   ├── graphql/
│   │   ├── models/
│   │   └── resolvers/
│   └── posts.module.ts
└── database/
    └── prisma/
```

**📁 Estrutura implementada na POC**:

- [`src/authors/`](src/authors/) - Módulo de Authors completo
- [`src/posts/`](src/posts/) - Módulo de Posts completo
- [`src/database/`](src/database/) - Configuração do banco de dados
- [`src/app.module.ts`](src/app.module.ts) - Módulo principal da aplicação

### 2. Naming Conventions

- **Types**: PascalCase (`Author`, `Post`)
- **Inputs**: PascalCase + "Input" (`CreateAuthorInput`)
- **Queries**: camelCase (`authors`, `author`)
- **Mutations**: camelCase + verbo (`createAuthor`, `updateAuthor`)

**📁 Exemplos na POC**:

- [`src/authors/graphql/models/author.ts`](src/authors/graphql/models/author.ts#L19) - Type `Author`
- [`src/posts/graphql/models/post.ts`](src/posts/graphql/models/post.ts#L27) - Type `Post`
- [`src/authors/graphql/models/create-author.input.ts`](src/authors/graphql/models/create-author.input.ts#L17) - Input `CreateAuthorInput`
- [`src/authors/graphql/resolvers/authors.resolver.ts`](src/authors/graphql/resolvers/authors.resolver.ts#L35) - Query `authors()`
- [`src/authors/graphql/resolvers/authors.resolver.ts`](src/authors/graphql/resolvers/authors.resolver.ts#L63) - Mutation `createAuthor()`

### 3. Error Handling

```typescript
@Mutation(() => Author)
async createAuthor(@Args('input') input: CreateAuthorInput) {
  try {
    return await this.prisma.author.create({ data: input })
  } catch (error) {
    throw new Error('Erro ao criar autor: ' + error.message)
  }
}
```

**📁 Exemplos na POC**:

- [`src/authors/graphql/resolvers/authors.resolver.ts`](src/authors/graphql/resolvers/authors.resolver.ts#L95-L105) - Error handling em `deleteAuthor()`
- [`src/posts/graphql/resolvers/posts.resolver.ts`](src/posts/graphql/resolvers/posts.resolver.ts#L107-L117) - Error handling em `deletePost()`

### 4. Validação de Dados

```typescript
@InputType()
export class CreateAuthorInput {
  @Field()
  @IsEmail()
  email: string

  @Field()
  @IsNotEmpty()
  @MinLength(2)
  name: string
}
```

**📁 Exemplos na POC**:

- [`src/authors/graphql/models/create-author.input.ts`](src/authors/graphql/models/create-author.input.ts) - Input com validação básica
- [`src/posts/graphql/models/create-post.input.ts`](src/posts/graphql/models/create-post.input.ts) - Input com campos obrigatórios

### 5. Paginação

```typescript
@Query(() => [Author])
authors(
  @Args('skip', { defaultValue: 0 }) skip: number,
  @Args('take', { defaultValue: 10 }) take: number
) {
  return this.prisma.author.findMany({
    skip,
    take
  })
}
```

**📁 Implementação atual na POC**:

- [`src/authors/graphql/resolvers/authors.resolver.ts`](src/authors/graphql/resolvers/authors.resolver.ts#L35-L38) - Query `authors()` (sem paginação)
- [`src/posts/graphql/resolvers/posts.resolver.ts`](src/posts/graphql/resolvers/posts.resolver.ts#L40-L43) - Query `posts()` (sem paginação)
- **Nota**: Paginação pode ser adicionada facilmente seguindo o exemplo acima

## 🚀 Quando usar cada conceito?

### Field Resolvers:

- ✅ Relacionamentos entre entidades
- ✅ Campos calculados
- ✅ Dados de fontes externas

### DataLoader:

- ✅ Múltiplos relacionamentos
- ✅ Queries que podem ser agrupadas
- ✅ Aplicações com muitos usuários

### Subscriptions:

- ✅ Aplicações em tempo real
- ✅ Notificações
- ✅ Colaboração
- ✅ Dashboards dinâmicos

## 📖 Recursos para Aprender Mais

1. **GraphQL.org**: Documentação oficial
2. **Apollo GraphQL**: Ferramentas e tutoriais
3. **Prisma**: ORM para Node.js
4. **NestJS**: Framework para Node.js
5. **DataLoader**: Biblioteca para resolver N+1 queries

## 🎯 **Arquivos da POC para Estudo**

### **Core Concepts Implementados**:

- [`src/authors/graphql/resolvers/authors.resolver.ts`](src/authors/graphql/resolvers/authors.resolver.ts) - Resolver completo com Queries e Mutations
- [`src/posts/graphql/resolvers/posts.resolver.ts`](src/posts/graphql/resolvers/posts.resolver.ts) - Resolver completo com Queries e Mutations
- [`src/authors/graphql/models/author.ts`](src/authors/graphql/models/author.ts) - Type Author com relacionamentos
- [`src/posts/graphql/models/post.ts`](src/posts/graphql/models/post.ts) - Type Post com relacionamentos

### **Inputs e Validação**:

- [`src/authors/graphql/models/create-author.input.ts`](src/authors/graphql/models/create-author.input.ts) - Input para criar autor
- [`src/authors/graphql/models/update-author.input.ts`](src/authors/graphql/models/update-author.input.ts) - Input para atualizar autor
- [`src/posts/graphql/models/create-post.input.ts`](src/posts/graphql/models/create-post.input.ts) - Input para criar post
- [`src/posts/graphql/models/update-post.input.ts`](src/posts/graphql/models/update-post.input.ts) - Input para atualizar post

### **Field Resolvers e Relacionamentos**:

- [`src/authors/graphql/resolvers/authors.resolver.ts`](src/authors/graphql/resolvers/authors.resolver.ts#L128-L133) - Field Resolver para posts do autor
- [`src/posts/graphql/resolvers/posts.resolver.ts`](src/posts/graphql/resolvers/posts.resolver.ts#L140-L145) - Field Resolver para autor do post

### **Configuração e Infraestrutura**:

- [`src/database/prisma/prisma.service.ts`](src/database/prisma/prisma.service.ts) - Serviço de banco de dados
- [`src/app.module.ts`](src/app.module.ts) - Configuração principal da aplicação
- [`src/authors/authors.module.ts`](src/authors/authors.module.ts) - Módulo de Authors
- [`src/posts/posts.module.ts`](src/posts/posts.module.ts) - Módulo de Posts

### **Exemplos Práticos**:

- [`QUERIES_EXAMPLES.md`](QUERIES_EXAMPLES.md) - Exemplos de queries e mutations para testar

---

_Este documento foi criado como parte da POC GraphQL para demonstrar os conceitos fundamentais e avançados do GraphQL de forma didática e prática._
