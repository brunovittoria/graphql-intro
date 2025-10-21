import { Field, ID, ObjectType } from '@nestjs/graphql'

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
}
