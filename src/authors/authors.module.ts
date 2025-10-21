import { Module } from '@nestjs/common'

/**
 * Authors Module
 *
 * Este módulo é responsável por gerenciar toda a funcionalidade relacionada aos autores.
 *
 * Estrutura do módulo:
 * - Controllers: Handlers para endpoints REST (se necessário)
 * - Services: Lógica de negócio para autores
 * - Resolvers: Handlers para queries/mutations GraphQL
 * - Models: Definições de tipos GraphQL (ObjectType, InputType)
 *
 * @Module() - Define um módulo do NestJS
 * - Organiza funcionalidades relacionadas
 * - Gerencia dependências e injeção de dependência
 * - Pode importar outros módulos ou exportar providers
 */
@Module({})
export class AuthorsModule {}
