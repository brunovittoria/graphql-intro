import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Author } from '@/authors/graphql/models/author'

/**
 * Post GraphQL Model
 *
 * Este arquivo define o modelo Post para GraphQL usando decorators do NestJS.
 *
 * @ObjectType() - Marca a classe como um tipo de objeto GraphQL
 * - ObjectType define a estrutura de dados que pode ser retornada em queries
 * - É usado para representar entidades no schema GraphQL
 * - Cada campo marcado com @Field() se torna um campo disponível na query
 *
 * @Field() - Marca propriedades como campos GraphQL
 * - Define como cada propriedade será exposta no schema
 * - Pode especificar tipos GraphQL (ID, String, Int, Boolean, etc.)
 * - Controla a serialização/deserialização dos dados
 *
 * Diferença entre ObjectType e InputType:
 * - @ObjectType: Para dados que são RETORNADOS (queries)
 * - @InputType: Para dados que são ENVIADOS (mutations)
 *
 * Por exemplo:
 * - Post (ObjectType): usado quando retornamos um post em uma query
 * - CreatePostInput (InputType): usado quando criamos um post via mutation
 */
@ObjectType()
export class Post {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  slug: string

  @Field()
  content: string

  @Field()
  published: boolean

  @Field()
  createdAt: Date

  /**
   * Campo authorId - ID do autor (não exposto no GraphQL)
   *
   * Este campo é necessário para o Field Resolver funcionar,
   * mas não é exposto no schema GraphQL (sem @Field decorator).
   * É usado internamente para resolver o relacionamento.
   */
  authorId: string

  /**
   * Campo de relacionamento com Author
   *
   * @Field(() => Author) - Define um objeto Author
   * - Este campo será resolvido usando Field Resolvers
   * - Relacionamento N:1 (muitos posts para um autor)
   *
   * Relacionamentos em GraphQL:
   * - Um Post pertence a um Author (N:1)
   * - O campo author será resolvido dinamicamente quando solicitado
   * - Se o cliente não pedir author, a query não será executada (lazy loading)
   */
  @Field(() => Author)
  author: Author
}
