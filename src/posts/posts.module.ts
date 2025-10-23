import { Module } from '@nestjs/common'
import { PostsResolver } from './graphql/resolvers/posts.resolver'
import { DatabaseModule } from '@/database/database.module'

/**
 * Posts Module
 *
 * Este módulo é responsável por gerenciar toda a funcionalidade relacionada aos posts.
 *
 * Estrutura do módulo:
 * - Resolvers: Handlers para queries/mutations GraphQL de posts
 * - Models: Definições de tipos GraphQL (ObjectType, InputType)
 * - Services: Lógica de negócio para posts (se necessário no futuro)
 *
 * @Module() - Define um módulo do NestJS
 * - Organiza funcionalidades relacionadas
 * - Gerencia dependências e injeção de dependência
 * - Pode importar outros módulos ou exportar providers
 *
 * Imports:
 * - DatabaseModule: Para acessar o PrismaService
 *
 * Providers:
 * - PostsResolver: Resolver que implementa as operações CRUD de posts
 */
@Module({
  imports: [DatabaseModule],
  providers: [PostsResolver],
})
export class PostsModule {}
