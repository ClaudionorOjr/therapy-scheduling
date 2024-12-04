import 'reflect-metadata'

import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makePsychologist } from 'test/factories/make-psychologist'
import { InMemoryPsychologistsRepository } from 'test/repositories/in-memory-psychologists-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import {
  RegisterPsychologistUseCase,
  type RegisterPsychologistUseCaseRequest,
} from './register-psychologist'

describe('Register psychologist use case', () => {
  let psychologistsRepository: InMemoryPsychologistsRepository
  let hasher: FakeHasher
  let sut: RegisterPsychologistUseCase
  let payload: RegisterPsychologistUseCaseRequest

  beforeEach(() => {
    psychologistsRepository = new InMemoryPsychologistsRepository()
    hasher = new FakeHasher()
    sut = new RegisterPsychologistUseCase(psychologistsRepository, hasher)

    payload = {
      fullName: 'John Doe',
      email: 'qJwvM@example.com',
      password: '123456',
      phone: '123456789',
      dateOfBirth: new Date(),
      crp: '123456',
    }
  })

  it('should be able to register a psychologist', async () => {
    const result = await sut.execute(payload)

    expect(result.isSuccess()).toBe(true)
    expect(psychologistsRepository.psychologists).toHaveLength(1)
  })

  it('should hash the password upon register', async () => {
    await sut.execute(payload)

    const psychologistPassword =
      psychologistsRepository.psychologists[0].passwordHash

    const isPasswordCorrectlyHashed = await hasher.compare(
      '123456',
      psychologistPassword,
    )

    expect(isPasswordCorrectlyHashed).toBeTruthy()
  })

  it('should not be able to register a psychologist with an existing email', async () => {
    await psychologistsRepository.create(
      makePsychologist({ email: 'qJwvM@example.com' }),
    )

    const result = await sut.execute(payload)

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })
})
