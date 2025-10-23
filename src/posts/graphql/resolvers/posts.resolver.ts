import { PrismaService } from '@/database/prisma/prisma.service'
import {
  Query,
  Resolver,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql'
import { Post } from '../models/post'
import { CreatePostInput } from '../models/create-post.input'
import { UpdatePostInput } from '../models/update-post.input'
import { Author } from '@/authors/graphql/models/author'

/**
 * PostsResolver - Resolver para operações de Posts
 *
 * Este resolver implementa todas as operações CRUD para posts:
 * - Create: Criar novo post
 * - Read: Buscar posts (todos ou por ID)
 * - Update: Atualizar post existente
 * - Delete: Deletar post
 *
 * @Resolver(() => Post) - Especifica que este resolver trabalha com o tipo Post
 * - Permite que o GraphQL entenda que este resolver pode retornar objetos Post
 * - Facilita a resolução de campos relacionados (Field Resolvers)
 */

@Resolver(() => Post)
export class PostsResolver {
  constructor(private prisma: PrismaService) {}

  /**
   * @Query - Listar todos os posts
   *
   * @Query(() => [Post]) - Retorna array de Post
   * - [Post] significa array de objetos Post
   * - Útil para listar todos os posts disponíveis
   */
  @Query(() => [Post])
  posts() {
    return this.prisma.post.findMany()
  }

  /**
   * @Query - Buscar um post específico por ID
   *
   * @Args('id') - Define um argumento chamado 'id' para esta query
   * - O cliente pode passar um ID para buscar um post específico
   * - nullable: true permite retornar null se o post não existir
   */
  @Query(() => Post, { nullable: true })
  post(@Args('id') id: string) {
    return this.prisma.post.findUnique({
      where: { id },
    })
  }

  /**
   * @Mutation - Criar um novo post
   *
   * @Mutation(() => Post) - Retorna um objeto Post criado
   * @Args('input') - Recebe um CreatePostInput como argumento
   *
   * Esta mutation:
   * - Cria um novo post no banco de dados
   * - Estabelece a relação com o autor via authorId
   * - Retorna o post criado com todos os campos
   */
  @Mutation(() => Post)
  createPost(@Args('input') input: CreatePostInput) {
    return this.prisma.post.create({
      data: input,
    })
  }

  /**
   * @Mutation - Atualizar um post existente
   *
   * Esta mutation implementa partial update:
   * - Apenas os campos fornecidos no input serão atualizados
   * - Campos não fornecidos mantêm seus valores atuais
   * - Útil para atualizar apenas o título, ou apenas o conteúdo, etc.
   */
  @Mutation(() => Post)
  updatePost(@Args('input') input: UpdatePostInput) {
    const { id, ...updateData } = input

    return this.prisma.post.update({
      where: { id },
      data: updateData,
    })
  }

  /**
   * @Mutation - Deletar um post
   *
   * @Mutation(() => Boolean) - Retorna true se deletado com sucesso
   * - Boolean é um tipo primitivo do GraphQL
   * - Usado para confirmar que a operação foi executada
   *
   * Tratamento de erros:
   * - Se o post não existir, retorna false
   * - Se houver erro na deleção, retorna false
   * - Se deletado com sucesso, retorna true
   */
  @Mutation(() => Boolean)
  async deletePost(@Args('id') id: string) {
    try {
      await this.prisma.post.delete({
        where: { id },
      })
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * @ResolveField - Field Resolver para o campo 'author' do Post
   *
   * Field Resolvers são funções especiais que resolvem campos específicos
   * de um tipo GraphQL. Eles são executados apenas quando o cliente
   * solicita esse campo específico.
   *
   * Como funciona:
   * 1. Cliente faz query: { posts { title author { name } } }
   * 2. GraphQL executa a query 'posts' (retorna lista de posts)
   * 3. Para cada post, se o cliente pediu 'author', executa este resolver
   * 4. Este resolver busca o autor do post específico
   *
   * @Parent - Recebe o objeto pai (Post) que está sendo resolvido
   * - post.authorId é usado para buscar o autor relacionado
   *
   * Lazy Loading:
   * - Se o cliente não pedir o campo 'author', este resolver não é executado
   * - Isso economiza queries desnecessárias ao banco de dados
   * - É uma das grandes vantagens do GraphQL sobre REST
   */
  @ResolveField('author', () => Author)
  async author(@Parent() post: Post) {
    return this.prisma.author.findUnique({
      where: { id: post.authorId },
    })
  }
}
