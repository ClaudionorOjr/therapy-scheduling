import { type Either, failure, success } from '@core/either'
import type { Hasher } from '@domain/account/cryptography/hasher'
import { Psychologist } from '@domain/account/enterprise/entities/psychologist'
import { inject, injectable } from 'tsyringe'

import type { PsychologistsRepository } from '../repositories/psychologists-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

export interface RegisterPsychologistUseCaseRequest {
  fullName: string
  email: string
  password: string
  dateOfBirth: Date
  phone: string
  crp: string
}

type RegisterPsychologistUseCaseResponse = Either<Error, object>

@injectable()
export class RegisterPsychologistUseCase {
  constructor(
    @inject('PsychologistsRepository')
    private psychologistsRepository: PsychologistsRepository,
    @inject('Hasher') private hasher: Hasher,
  ) {}

  async execute({
    fullName,
    email,
    password,
    phone,
    dateOfBirth,
    crp,
  }: RegisterPsychologistUseCaseRequest): Promise<RegisterPsychologistUseCaseResponse> {
    const userAlreadyExists =
      await this.psychologistsRepository.findByEmail(email)

    if (userAlreadyExists) {
      return failure(new UserAlreadyExistsError())
    }

    // TODO Verificar se o CRP informado é válido!

    const passwordHash = await this.hasher.hash(password)

    const psychologist = Psychologist.create({
      fullName,
      email,
      passwordHash,
      phone,
      dateOfBirth,
      crp,
    })

    await this.psychologistsRepository.create(psychologist)

    return success({})
  }
}
