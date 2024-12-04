import 'reflect-metadata'

import { makePsychologist } from 'test/factories/make-psychologist'
import { InMemoryPsychologistsRepository } from 'test/repositories/in-memory-psychologists-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { DeleteAccountUseCase } from './delete-account'

describe('Delete account use case', () => {
  let psychologistsRepository: InMemoryPsychologistsRepository
  let sut: DeleteAccountUseCase

  beforeEach(() => {
    psychologistsRepository = new InMemoryPsychologistsRepository()
    sut = new DeleteAccountUseCase(psychologistsRepository)
  })

  it('should be able to delete an account', async () => {
    await psychologistsRepository.create(
      makePsychologist({}, 'psychologist-01'),
    )

    const result = await sut.execute({
      psychologistId: 'psychologist-01',
    })

    expect(result.isSuccess()).toBe(true)
    expect(psychologistsRepository.psychologists).toHaveLength(0)
  })

  it('should not be able to delete an account that does not exist', async () => {
    const result = await sut.execute({
      psychologistId: 'psychologist-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toEqual(new Error('Psychologist not found.'))
  })
})
