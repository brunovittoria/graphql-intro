import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Post } from '@/posts/graphql/models/post'

/**
 * Author GraphQL Model
 *
 * Este arquivo define o modelo Author para GraphQL usando decorators do NestJS.
 *
 * @ObjectType() - Marca a classe como um tipo de objeto GraphQL
 * - ObjectType define a estrutura de dados que pode ser retornada em queries
 * - É usado para representar entidades no schema GraphQL
 * - Cada campo marcado com @Field() se torna um campo disponível na query
 *
 * @Field() - Marca propriedades como campos GraphQL
 * - Define como cada propriedade será exposta no schema
 * - Pode especificar tipos GraphQL (ID, String, Int, etc.)
 * - Controla a serialização/deserialização dos dados
 */
@ObjectType()
export class Author {
  @Field(() => ID)
  id: string

  @Field()
  name: string

  @Field()
  email: string

  @Field()
  createdAt: Date

  /**
   * Campo de relacionamento com Posts
   *
   * @Field(() => [Post]) - Define um array de Posts
   * - [Post] significa array de objetos Post
   * - Este campo será resolvido usando Field Resolvers
   *
   * Relacionamentos em GraphQL:
   * - Um Author pode ter muitos Posts (1:N)
   * - O campo posts será resolvido dinamicamente quando solicitado
   * - Se o cliente não pedir posts, a query não será executada (lazy loading)
   */
  @Field(() => [Post])
  posts: Post[]
}
