import { PrismaService } from '@/database/prisma/prisma.service'
import {
  Query,
  Resolver,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql'
import { Author } from '../models/author'
import { CreateAuthorInput } from '../models/create-author.input'
import { UpdateAuthorInput } from '../models/update-author.input'
import { Post } from '@/posts/graphql/models/post'

/**
 * AuthorsResolver - Resolver para operações de Authors
 *
 * Este resolver implementa todas as operações CRUD para autores:
 * - Create: Criar novo autor
 * - Read: Buscar autores (todos ou por ID)
 * - Update: Atualizar autor existente
 * - Delete: Deletar autor
 *
 * @Resolver(() => Author) - Especifica que este resolver trabalha com o tipo Author
 * - Permite que o GraphQL entenda que este resolver pode retornar objetos Author
 * - Facilita a resolução de campos relacionados (Field Resolvers)
 */

@Resolver(() => Author)
export class AuthorsResolver {
  constructor(private prisma: PrismaService) {}

  /**
   * @Query - Define uma operação de leitura (GET)
   *
   * Queries são operações de leitura que não modificam dados.
   * Elas são equivalentes a GET requests em REST APIs.
   *
   * @Query(() => [Author]) - Retorna array de Author
   * - [Author] significa array de objetos Author
   * - () => [Author] é a função que define o tipo de retorno
   */
  @Query(() => [Author])
  authors() {
    return this.prisma.author.findMany()
  }

  /**
   * @Query - Buscar um autor específico por ID
   *
   * @Args('id') - Define um argumento chamado 'id' para esta query
   * - O cliente pode passar um ID para buscar um autor específico
   * - O tipo String é inferido automaticamente
   */
  @Query(() => Author, { nullable: true })
  author(@Args('id') id: string) {
    return this.prisma.author.findUnique({
      where: { id },
    })
  }

  /**
   * @Mutation - Define uma operação de escrita (POST/PUT/DELETE)
   *
   * Mutations são operações que modificam dados.
   * Elas são equivalentes a POST/PUT/DELETE requests em REST APIs.
   *
   * @Mutation(() => Author) - Retorna um objeto Author criado
   * @Args('input') - Recebe um CreateAuthorInput como argumento
   */
  @Mutation(() => Author)
  createAuthor(@Args('input') input: CreateAuthorInput) {
    return this.prisma.author.create({
      data: input,
    })
  }

  /**
   * @Mutation - Atualizar um autor existente
   *
   * Esta mutation implementa partial update:
   * - Apenas os campos fornecidos no input serão atualizados
   * - Campos não fornecidos mantêm seus valores atuais
   */
  @Mutation(() => Author)
  updateAuthor(@Args('input') input: UpdateAuthorInput) {
    const { id, ...updateData } = input

    return this.prisma.author.update({
      where: { id },
      data: updateData,
    })
  }

  /**
   * @Mutation - Deletar um autor
   *
   * @Mutation(() => Boolean) - Retorna true se deletado com sucesso
   * - Boolean é um tipo primitivo do GraphQL
   * - Usado para confirmar que a operação foi executada
   */
  @Mutation(() => Boolean)
  async deleteAuthor(@Args('id') id: string) {
    try {
      await this.prisma.author.delete({
        where: { id },
      })
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * @ResolveField - Field Resolver para o campo 'posts' do Author
   *
   * Field Resolvers são funções especiais que resolvem campos específicos
   * de um tipo GraphQL. Eles são executados apenas quando o cliente
   * solicita esse campo específico.
   *
   * Como funciona:
   * 1. Cliente faz query: { authors { name posts { title } } }
   * 2. GraphQL executa a query 'authors' (retorna lista de autores)
   * 3. Para cada autor, se o cliente pediu 'posts', executa este resolver
   * 4. Este resolver busca os posts do autor específico
   *
   * @Parent - Recebe o objeto pai (Author) que está sendo resolvido
   * - author.id é usado para buscar os posts relacionados
   *
   * Problema N+1 Queries:
   * - Se temos 10 autores e pedimos posts de todos, este resolver
   *   será executado 10 vezes (1 query por autor)
   * - Solução: DataLoader (veremos na documentação)
   */
  @ResolveField('posts', () => [Post])
  async posts(@Parent() author: Author) {
    return this.prisma.post.findMany({
      where: { authorId: author.id },
    })
  }
}
