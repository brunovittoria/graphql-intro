import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

/**
 * PrismaService - Serviço de Conexão com o Banco de Dados
 *
 * Este serviço é responsável por gerenciar a conexão com o banco de dados
 * usando o Prisma Client. Ele implementa os lifecycle hooks do NestJS
 * para garantir que a conexão seja estabelecida e fechada corretamente.
 *
 * Lifecycle Hooks do NestJS:
 * - OnModuleInit: Executado quando o módulo é inicializado
 * - OnModuleDestroy: Executado quando o módulo é destruído
 *
 * Por que usar lifecycle hooks?
 * - Garante que a conexão com o banco seja estabelecida antes de usar
 * - Evita vazamentos de memória fechando conexões adequadamente
 * - Segue as melhores práticas do NestJS para gerenciamento de recursos
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  /**
   * onModuleInit - Conecta ao banco de dados quando o módulo é inicializado
   *
   * Este método é chamado automaticamente pelo NestJS quando o módulo
   * que contém este serviço é inicializado. É aqui que estabelecemos
   * a conexão com o banco de dados.
   */
  async onModuleInit() {
    await this.$connect()
  }

  /**
   * onModuleDestroy - Desconecta do banco quando o módulo é destruído
   *
   * Este método é chamado quando a aplicação está sendo encerrada.
   * É importante fechar a conexão para evitar vazamentos de memória
   * e garantir que a aplicação seja encerrada corretamente.
   */
  async onModuleDestroy() {
    await this.$disconnect()
  }
}
