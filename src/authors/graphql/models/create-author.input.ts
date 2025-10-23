import { Field, InputType } from '@nestjs/graphql'

/**
 * CreateAuthorInput - Input para criar um novo autor
 *
 * @InputType() - Marca a classe como um tipo de input GraphQL
 * - InputType define a estrutura de dados que pode ser ENVIADA em mutations
 * - É usado para receber dados do cliente quando criamos/atualizamos recursos
 * - Diferente do ObjectType que é usado para RETORNAR dados
 *
 * Por que usar InputType para mutations?
 * - Separação clara entre dados de entrada e saída
 * - Validação automática dos campos obrigatórios
 * - Melhor organização do schema GraphQL
 * - Permite reutilizar inputs em diferentes mutations
 */
@InputType()
export class CreateAuthorInput {
  @Field()
  name: string

  @Field()
  email: string

  /**
   * Campos obrigatórios para criar um autor:
   * - name: Nome do autor (string obrigatória)
   * - email: Email único do autor (string obrigatória)
   *
   * Note que não incluímos:
   * - id: Gerado automaticamente pelo banco (UUID)
   * - createdAt: Definido automaticamente pelo Prisma
   * - posts: Relacionamento que será criado posteriormente
   */
}
