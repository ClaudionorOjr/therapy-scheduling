import { makeScheduling } from 'test/factories/make-scheduling'
import { InMemorySchedulingsRepository } from 'test/repositories/in-memory-schedulings-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { ConfirmSchedulingUseCase } from './confirm-scheduling'

describe('Confirm scheduling use case', () => {
  let schedulingRepository: InMemorySchedulingsRepository
  let sut: ConfirmSchedulingUseCase

  beforeEach(() => {
    schedulingRepository = new InMemorySchedulingsRepository()
    sut = new ConfirmSchedulingUseCase(schedulingRepository)
  })

  it('should be able to confirm scheduling', async () => {
    await schedulingRepository.create(makeScheduling({}, 'scheduling-01'))

    const result = await sut.execute({
      schedulingId: 'scheduling-01',
    })

    expect(result.isSuccess()).toBe(true)
    expect(schedulingRepository.schedulings[0]).toEqual(
      expect.objectContaining({
        status: 'CONFIRMED',
      }),
    )
  })

  it('should not be able to confirm scheduling if scheduling does not exist', async () => {
    const result = await sut.execute({
      schedulingId: 'scheduling-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toEqual(new Error('Scheduling not found.'))
  })

  it('should not be able to confirm scheduling if scheduling is already confirmed', async () => {
    await schedulingRepository.create(
      makeScheduling({ status: 'CONFIRMED' }, 'scheduling-01'),
    )

    const result = await sut.execute({
      schedulingId: 'scheduling-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toEqual(new Error('Scheduling already confirmed.'))
  })
})
