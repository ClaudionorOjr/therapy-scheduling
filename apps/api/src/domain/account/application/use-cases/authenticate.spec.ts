import 'reflect-metadata'

import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makePsychologist } from 'test/factories/make-psychologist'
import { InMemoryPsychologistsRepository } from 'test/repositories/in-memory-psychologists-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { AuthenticateUseCase } from './authenticate'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

describe('Authenticate use case', () => {
  let psychologistsRepository: InMemoryPsychologistsRepository
  let hasher: FakeHasher
  let encrypter: FakeEncrypter
  let sut: AuthenticateUseCase

  beforeEach(() => {
    psychologistsRepository = new InMemoryPsychologistsRepository()
    hasher = new FakeHasher()
    encrypter = new FakeEncrypter()
    sut = new AuthenticateUseCase(psychologistsRepository, hasher, encrypter)
  })

  it('should be able to authenticate', async () => {
    await psychologistsRepository.create(
      makePsychologist({
        email: 'qJwvM@example.com',
        passwordHash: await hasher.hash('123456'),
      }),
    )

    const result = await sut.execute({
      email: 'qJwvM@example.com',
      password: '123456',
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toMatchObject({
      accessToken: expect.any(String),
    })
  })

  it('should not be able to authenticate with wrong email', async () => {
    const result = await sut.execute({
      email: 'qJwvM@example.com',
      password: '123456',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await psychologistsRepository.create(
      makePsychologist({ email: 'qJwvM@example.com' }),
    )

    const result = await sut.execute({
      email: 'qJwvM@example.com',
      password: '123457',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})
