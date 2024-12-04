import type { FastifyInstance } from 'fastify'

import { accountRoutes } from './account.routes'

export async function routes(app: FastifyInstance) {
  app.register(accountRoutes)
}
