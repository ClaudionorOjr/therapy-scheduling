import 'reflect-metadata'

import { makePsychologist } from 'test/factories/make-psychologist'
import { InMemoryPsychologistsRepository } from 'test/repositories/in-memory-psychologists-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { EditPsychologistUseCase } from './edit-psychologist'

describe('Edit psychologist use case', () => {
  let psychologistsRepository: InMemoryPsychologistsRepository
  let sut: EditPsychologistUseCase

  beforeEach(() => {
    psychologistsRepository = new InMemoryPsychologistsRepository()
    sut = new EditPsychologistUseCase(psychologistsRepository)
  })

  it('should be able to edit a psychologist', async () => {
    await psychologistsRepository.create(
      makePsychologist({}, 'psychologist-01'),
    )

    const result = await sut.execute({
      psychologistId: 'psychologist-01',
      fullName: 'John Doe',
      phone: '123456789',
      dateOfBirth: new Date('1995-01-11'),
    })

    expect(result.isSuccess()).toBe(true)
    expect(psychologistsRepository.psychologists[0]).toMatchObject({
      id: 'psychologist-01',
      fullName: 'John Doe',
      phone: '123456789',
      dateOfBirth: new Date('1995-01-11'),
    })
  })

  it('should not be able to edit a psychologist that does not exist', async () => {
    const result = await sut.execute({
      psychologistId: 'psychologist-01',
      fullName: 'John Doe',
      phone: '123456789',
      dateOfBirth: new Date('1995-01-11'),
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toEqual(new Error('Psychologist not found.'))
  })
})
