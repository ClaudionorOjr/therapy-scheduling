import { type Either, failure, success } from '@core/either'
import type { Encrypter } from '@domain/account/cryptography/encrypter'
import type { Hasher } from '@domain/account/cryptography/hasher'
import { inject, injectable } from 'tsyringe'

import type { PsychologistsRepository } from '../repositories/psychologists-repository'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

type AuthenticateUseCaseResponse = Either<Error, { accessToken: string }>

@injectable()
export class AuthenticateUseCase {
  constructor(
    @inject('PsychologistsRepository')
    private psychologistsRepository: PsychologistsRepository,
    @inject('Hasher')
    private hasher: Hasher,
    @inject('Encrypter')
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const psychologist = await this.psychologistsRepository.findByEmail(email)

    if (!psychologist) {
      return failure(new WrongCredentialsError())
    }

    const doesPasswordMatch = await this.hasher.compare(
      password,
      psychologist.passwordHash,
    )

    if (!doesPasswordMatch) {
      return failure(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: psychologist.id,
    })

    return success({ accessToken })
  }
}
