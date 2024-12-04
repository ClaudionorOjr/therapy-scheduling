import { makeScheduling } from 'test/factories/make-scheduling'
import { InMemorySchedulingsRepository } from 'test/repositories/in-memory-schedulings-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { GetSchedulingUseCase } from './get-scheduling'

describe('Get scheduling use case', () => {
  let schedulingRepository: InMemorySchedulingsRepository
  let sut: GetSchedulingUseCase

  beforeEach(() => {
    schedulingRepository = new InMemorySchedulingsRepository()
    sut = new GetSchedulingUseCase(schedulingRepository)
  })

  it('should be able to get scheduling', async () => {
    await schedulingRepository.create(
      makeScheduling({ psychologistId: 'psychologist-01' }, 'scheduling-01'),
    )

    const result = await sut.execute({
      schedulingId: 'scheduling-01',
      psychologistId: 'psychologist-01',
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toEqual({
      scheduling: expect.objectContaining({
        id: 'scheduling-01',
        psychologistId: 'psychologist-01',
      }),
    })
  })

  it('should not be able to get scheduling if scheduling does not exist', async () => {
    const result = await sut.execute({
      schedulingId: 'scheduling-01',
      psychologistId: 'psychologist-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toEqual(new Error('Scheduling not found.'))
  })

  it('should not be able to get scheduling of another psychologist', async () => {
    await schedulingRepository.create(
      makeScheduling({ psychologistId: 'psychologist-02' }, 'scheduling-01'),
    )

    const result = await sut.execute({
      schedulingId: 'scheduling-01',
      psychologistId: 'psychologist-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toEqual(
      new Error('Psychologist not assigned to scheduling.'),
    )
  })
})
