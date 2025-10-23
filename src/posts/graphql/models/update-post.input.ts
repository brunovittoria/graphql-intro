import { Field, ID, InputType } from '@nestjs/graphql'

/**
 * UpdatePostInput - Input para atualizar um post existente
 *
 * Este input é usado em mutations de atualização (updatePost).
 *
 * Características importantes:
 * - id: Campo obrigatório para identificar qual post atualizar
 * - Todos os outros campos são opcionais (partial update)
 * - Apenas os campos fornecidos serão atualizados
 *
 * Partial Updates:
 * - Permite atualizar apenas alguns campos de um post
 * - Campos não fornecidos mantêm seus valores atuais
 * - Mais flexível que exigir todos os campos
 */
@InputType()
export class UpdatePostInput {
  @Field(() => ID)
  id: string

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  slug?: string

  @Field({ nullable: true })
  content?: string

  @Field({ nullable: true })
  published?: boolean

  /**
   * Note que não incluímos authorId aqui:
   * - Mudar o autor de um post é uma operação rara
   * - Se necessário, pode ser uma operação separada
   * - Mantém a simplicidade do update
   */
}
