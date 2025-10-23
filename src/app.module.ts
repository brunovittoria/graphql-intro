import { Module } from '@nestjs/common'
import { AppResolver } from './app.resolver'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './database/database.module'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { AuthorsModule } from './authors/authors.module'
import { PostsModule } from './posts/posts.module'
import path from 'path'

/**
 * App Module - Módulo Principal da Aplicação
 *
 * Este é o módulo raiz que configura toda a aplicação NestJS com GraphQL.
 *
 * Configurações implementadas:
 *
 * 1. ConfigModule.forRoot() - Carrega variáveis de ambiente do .env
 * 2. DatabaseModule - Configuração do banco de dados (Prisma)
 * 3. GraphQLModule - Configuração do GraphQL com Apollo Server
 * 4. AuthorsModule - Módulo específico para funcionalidades de autores
 *
 * GraphQL Configuration:
 * - driver: ApolloDriver - Usa Apollo Server como driver GraphQL
 * - autoSchemaFile: Gera automaticamente o schema GraphQL em src/schema.gql
 * - O schema é gerado baseado nos @ObjectType, @InputType e @Resolver decorators
 *
 * ObjectType vs InputType:
 * - @ObjectType: Define tipos que podem ser retornados em queries (ex: Author)
 * - @InputType: Define tipos que podem ser usados como input em mutations (ex: CreateAuthorInput)
 * - Ambos são usados para gerar o schema GraphQL automaticamente
 */
@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: path.resolve(process.cwd(), 'src/schema.gql'),
    }),
    AuthorsModule,
    PostsModule,
  ],
  providers: [AppService, AppResolver],
})
export class AppModule {}
