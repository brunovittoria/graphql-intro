import { Field, ID, InputType } from '@nestjs/graphql'

/**
 * UpdateAuthorInput - Input para atualizar um autor existente
 *
 * Este input é usado em mutations de atualização (updateAuthor).
 *
 * Características importantes:
 * - id: Campo obrigatório para identificar qual autor atualizar
 * - name e email: Campos opcionais (partial update)
 * - Apenas os campos fornecidos serão atualizados
 *
 * Partial Updates:
 * - Permite atualizar apenas alguns campos de um registro
 * - Campos não fornecidos mantêm seus valores atuais
 * - Mais flexível que exigir todos os campos
 */
@InputType()
export class UpdateAuthorInput {
  @Field(() => ID)
  id: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  email?: string

  /**
   * nullable: true - Torna o campo opcional
   *
   * Quando nullable: true:
   * - O campo pode ser omitido na mutation
   * - Se fornecido, o valor será atualizado
   * - Se não fornecido, o valor atual será mantido
   *
   * Exemplo de uso:
   * - Atualizar apenas o nome: { id: "123", name: "Novo Nome" }
   * - Atualizar apenas o email: { id: "123", email: "novo@email.com" }
   * - Atualizar ambos: { id: "123", name: "Novo Nome", email: "novo@email.com" }
   */
}
