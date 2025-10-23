import { Field, InputType } from '@nestjs/graphql'

/**
 * CreatePostInput - Input para criar um novo post
 *
 * @InputType() - Marca a classe como um tipo de input GraphQL
 * - InputType define a estrutura de dados que pode ser ENVIADA em mutations
 * - É usado para receber dados do cliente quando criamos posts
 *
 * Campos obrigatórios para criar um post:
 * - title: Título do post
 * - slug: URL amigável única do post
 * - content: Conteúdo do post
 * - authorId: ID do autor que está criando o post
 *
 * Campos opcionais:
 * - published: Se o post está publicado (padrão: false)
 */
@InputType()
export class CreatePostInput {
  @Field()
  title: string

  @Field()
  slug: string

  @Field()
  content: string

  @Field({ nullable: true })
  published?: boolean

  @Field()
  authorId: string

  /**
   * Relacionamento com Author:
   * - authorId: Referência ao autor que criou o post
   * - Este campo estabelece a relação entre Post e Author
   * - O Prisma usará este ID para criar a associação no banco
   */
}
