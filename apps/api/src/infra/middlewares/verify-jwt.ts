import type { FastifyReply, FastifyRequest } from 'fastify'
import { verify } from 'jsonwebtoken'

interface Payload {
  sub: string
}

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  const { authorization } = request.headers

  if (!authorization) {
    return reply.status(401).send({
      message: 'Token missing!',
    })
  }

  const [, token] = authorization.split(' ')

  try {
    const { sub } = verify(token, 'secret') as Payload

    request.user = { sub }
  } catch (error) {
    return reply.status(401).send({
      message: 'Invalid token!',
    })
  }
}
