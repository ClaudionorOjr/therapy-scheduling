import 'reflect-metadata'
import '@infra/container'

import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorHandler } from './error-handler'
import { routes } from './routes'

export const app = fastify()

app.withTypeProvider<ZodTypeProvider>()

// ? Serialização é o processo de transformação dos dados de entrada e saída dos endpoints
app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors)

/* ROUTES */
app.register(routes)

/* GLOBAL ERROR HANDLER */
app.setErrorHandler(errorHandler)

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP Server running on http://localhost:3333')
})
