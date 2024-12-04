import { makeScheduling } from 'test/factories/make-scheduling'
import { InMemorySchedulingsRepository } from 'test/repositories/in-memory-schedulings-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { CancelSchedulingUseCase } from './cancel-scheduling'

describe('Cancel scheduling use case', () => {
  let schedulingRepository: InMemorySchedulingsRepository
  let sut: CancelSchedulingUseCase

  beforeEach(() => {
    schedulingRepository = new InMemorySchedulingsRepository()
    sut = new CancelSchedulingUseCase(schedulingRepository)
  })

  it('should be able to cancel scheduling', async () => {
    await schedulingRepository.create(makeScheduling({}, 'scheduling-01'))

    const result = await sut.execute({
      schedulingId: 'scheduling-01',
    })

    expect(result.isSuccess()).toBe(true)
    expect(schedulingRepository.schedulings[0]).toEqual(
      expect.objectContaining({
        status: 'CANCELED',
      }),
    )
  })

  it('should not be able to cancel scheduling if scheduling does not exist', async () => {
    const result = await sut.execute({
      schedulingId: 'scheduling-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toEqual(new Error('Scheduling not found.'))
  })

  it('should not be able to cancel scheduling if scheduling is already canceled', async () => {
    await schedulingRepository.create(
      makeScheduling({ status: 'CANCELED' }, 'scheduling-01'),
    )

    const result = await sut.execute({
      schedulingId: 'scheduling-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toEqual(new Error('Scheduling already canceled.'))
  })
})
