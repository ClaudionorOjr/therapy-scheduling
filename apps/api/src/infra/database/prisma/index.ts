import { PrismaClient } from '@prisma/client'
import { injectable } from 'tsyringe'

import type { DatabaseProvider } from '../database-provider'

@injectable()
export class PrismaService extends PrismaClient implements DatabaseProvider {
  constructor() {
    super({
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'warn', 'error']
          : ['error'],
    })
  }

  connect(): Promise<void> {
    return this.$connect()
  }

  disconnect(): Promise<void> {
    return this.$disconnect()
  }
}
