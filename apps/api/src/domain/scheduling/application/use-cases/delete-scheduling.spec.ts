import { makePsychologist } from 'test/factories/make-psychologist'
import { makeScheduling } from 'test/factories/make-scheduling'
import { InMemoryPsychologistsRepository } from 'test/repositories/in-memory-psychologists-repository'
import { InMemorySchedulingsRepository } from 'test/repositories/in-memory-schedulings-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { DeleteSchedulingUseCase } from './delete-scheduling'

describe('Delete scheduling use case', () => {
  let schedulingsRepository: InMemorySchedulingsRepository
  let psychologistsRepository: InMemoryPsychologistsRepository
  let sut: DeleteSchedulingUseCase

  beforeEach(() => {
    schedulingsRepository = new InMemorySchedulingsRepository()
    psychologistsRepository = new InMemoryPsychologistsRepository()
    sut = new DeleteSchedulingUseCase(
      schedulingsRepository,
      psychologistsRepository,
    )
  })

  it('should be able to delete scheduling', async () => {
    await psychologistsRepository.create(
      makePsychologist({}, 'psychologist-01'),
    )

    await schedulingsRepository.create(
      makeScheduling(
        {
          psychologistId: 'psychologist-01',
        },
        'scheduling-01',
      ),
    )

    const result = await sut.execute({
      psychologistId: 'psychologist-01',
      schedulingId: 'scheduling-01',
    })

    expect(result.isSuccess()).toBe(true)
    expect(schedulingsRepository.schedulings).toHaveLength(0)
  })

  it('should not be able to delete scheduling if psychologist does not exist', async () => {
    const result = await sut.execute({
      psychologistId: 'psychologist-01',
      schedulingId: 'scheduling-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toEqual(new Error('Psychologist not found.'))
  })

  it('should not be able to delete scheduling if scheduling does not exist', async () => {
    await psychologistsRepository.create(
      makePsychologist({}, 'psychologist-01'),
    )

    const result = await sut.execute({
      psychologistId: 'psychologist-01',
      schedulingId: 'scheduling-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toEqual(new Error('Scheduling not found.'))
  })

  it('should not be able to delete scheduling if psychologist is not assigned to scheduling', async () => {
    await psychologistsRepository.create(
      makePsychologist({}, 'psychologist-01'),
    )

    await schedulingsRepository.create(
      makeScheduling(
        {
          psychologistId: 'psychologist-02',
        },
        'scheduling-01',
      ),
    )

    const result = await sut.execute({
      psychologistId: 'psychologist-01',
      schedulingId: 'scheduling-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toEqual(
      new Error('Psychologist not assigned to scheduling.'),
    )
  })
})
