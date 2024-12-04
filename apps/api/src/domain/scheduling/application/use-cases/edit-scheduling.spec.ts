import { makePsychologist } from 'test/factories/make-psychologist'
import { makeScheduling } from 'test/factories/make-scheduling'
import { InMemoryPsychologistsRepository } from 'test/repositories/in-memory-psychologists-repository'
import { InMemorySchedulingsRepository } from 'test/repositories/in-memory-schedulings-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { EditSchedulingUseCase } from './edit-scheduling'

describe('Edit scheduling use case', () => {
  let schedulingsRepository: InMemorySchedulingsRepository
  let psychologistsRepository: InMemoryPsychologistsRepository
  let sut: EditSchedulingUseCase

  beforeEach(() => {
    schedulingsRepository = new InMemorySchedulingsRepository()
    psychologistsRepository = new InMemoryPsychologistsRepository()
    sut = new EditSchedulingUseCase(
      schedulingsRepository,
      psychologistsRepository,
    )
  })

  it('should be able to edit scheduling', async () => {
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

    const appointmentDatetime = new Date(Date.now() + 1000 * 60 * 60 * 24)

    const result = await sut.execute({
      schedulingId: 'scheduling-01',
      psychologistId: 'psychologist-01',
      appointmentDatetime,
      appointmentLocation: '7917 Miller Park Apt. 410',
      typeOfService: 'INPERSON',
    })

    expect(result.isSuccess()).toBe(true)
    expect(schedulingsRepository.schedulings[0]).toEqual(
      expect.objectContaining({
        id: 'scheduling-01',
        psychologistId: 'psychologist-01',
        appointmentDatetime,
        appointmentLocation: '7917 Miller Park Apt. 410',
        typeOfService: 'INPERSON',
      }),
    )
  })

  it('should not be able to edit scheduling if psychologist does not exist', async () => {
    const result = await sut.execute({
      schedulingId: 'scheduling-01',
      psychologistId: 'psychologist-01',
      appointmentDatetime: new Date(Date.now() + 1000 * 60 * 60 * 24),
      appointmentLocation: '7917 Miller Park Apt. 410',
      typeOfService: 'INPERSON',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toEqual(new Error('Psychologist not found.'))
  })

  it('should not be able to edit scheduling if scheduling does not exist', async () => {
    await psychologistsRepository.create(
      makePsychologist({}, 'psychologist-01'),
    )

    const result = await sut.execute({
      schedulingId: 'scheduling-01',
      psychologistId: 'psychologist-01',
      appointmentDatetime: new Date(Date.now() + 1000 * 60 * 60 * 24),
      appointmentLocation: '7917 Miller Park Apt. 410',
      typeOfService: 'INPERSON',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toEqual(new Error('Scheduling not found.'))
  })

  it('should not be able to edit scheduling if psychologist is not assigned to scheduling', async () => {
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
      schedulingId: 'scheduling-01',
      psychologistId: 'psychologist-01',
      appointmentDatetime: new Date(Date.now() + 1000 * 60 * 60 * 24),
      appointmentLocation: '7917 Miller Park Apt. 410',
      typeOfService: 'INPERSON',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toEqual(
      new Error('Psychologist not assigned to scheduling.'),
    )
  })

  it('should not be able to edit scheduling if appointment date is in the past', async () => {
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
      schedulingId: 'scheduling-01',
      psychologistId: 'psychologist-01',
      appointmentDatetime: new Date(Date.now() - 1000 * 60 * 60 * 24),
      appointmentLocation: '7917 Miller Park Apt. 410',
      typeOfService: 'INPERSON',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toEqual(
      new Error('Appointment date must be in the future.'),
    )
  })
})
