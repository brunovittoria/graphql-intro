import { PrismaService } from '@/database/prisma/prisma.service'
import { Query, Resolver } from '@nestjs/graphql'
import { Author } from '../models/author'

// Nos resolvers faremos a implementação da lógica do negócio (UseCases)

@Resolver(() => Author)
export class AuthorsResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => [Author])
  authors() {
    return this.prisma.author.findMany()
  }
}
