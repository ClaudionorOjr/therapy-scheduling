import { makeScheduling } from 'test/factories/make-scheduling'
import { InMemorySchedulingsRepository } from 'test/repositories/in-memory-schedulings-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { ReschedulingUseCase } from './rescheduling'

describe('Rescheduling use case', () => {
  let schedulingRepository: InMemorySchedulingsRepository
  let sut: ReschedulingUseCase

  beforeEach(() => {
    schedulingRepository = new InMemorySchedulingsRepository()
    sut = new ReschedulingUseCase(schedulingRepository)
  })

  it('should be able to reschedule', async () => {
    await schedulingRepository.create(
      makeScheduling({ psychologistId: 'psychologist-01' }, 'scheduling-01'),
    )

    const result = await sut.execute({
      schedulingId: 'scheduling-01',
    })

    expect(result.isSuccess()).toBe(true)
    expect(schedulingRepository.schedulings[0]).toEqual(
      expect.objectContaining({
        status: 'RESCHEDULING',
      }),
    )
  })
})
