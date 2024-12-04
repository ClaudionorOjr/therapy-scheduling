import { makeScheduling } from 'test/factories/make-scheduling'
import { InMemorySchedulingsRepository } from 'test/repositories/in-memory-schedulings-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { FetchSchedulingsUseCase } from './fetch-schedulings'

describe('Fetch schedulings use case', () => {
  let schedulingsRepository: InMemorySchedulingsRepository
  let sut: FetchSchedulingsUseCase

  beforeEach(() => {
    schedulingsRepository = new InMemorySchedulingsRepository()
    sut = new FetchSchedulingsUseCase(schedulingsRepository)
  })

  it('should be able to fetch schedulings', async () => {
    await Promise.all([
      schedulingsRepository.create(
        makeScheduling({ psychologistId: 'psychologist-01' }, 'scheduling-01'),
      ),
      schedulingsRepository.create(
        makeScheduling({ psychologistId: 'psychologist-02' }, 'scheduling-02'),
      ),
    ])

    const result = await sut.execute({
      psychologistId: 'psychologist-01',
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toEqual({
      schedulings: expect.arrayContaining([
        expect.objectContaining({ id: 'scheduling-01' }),
      ]),
    })
  })

  it('should be able to fetch schedulings by patient', async () => {
    await Promise.all([
      schedulingsRepository.create(
        makeScheduling(
          { psychologistId: 'psychologist-01', patientId: 'patient-01' },
          'scheduling-01',
        ),
      ),
      schedulingsRepository.create(
        makeScheduling(
          { psychologistId: 'psychologist-01', patientId: 'patient-01' },
          'scheduling-02',
        ),
      ),
      schedulingsRepository.create(
        makeScheduling(
          { psychologistId: 'psychologist-01', patientId: 'patient-02' },
          'scheduling-03',
        ),
      ),
    ])

    const result = await sut.execute({
      psychologistId: 'psychologist-01',
      patientId: 'patient-01',
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toEqual({
      schedulings: expect.arrayContaining([
        expect.objectContaining({ id: 'scheduling-01' }),
        expect.objectContaining({ id: 'scheduling-02' }),
      ]),
    })
  })

  it('should be able to fetch schedulings in the date range', async () => {
    await Promise.all([
      schedulingsRepository.create(
        makeScheduling(
          {
            psychologistId: 'psychologist-01',
            appointmentDatetime: new Date('2024-10-19T09:00'),
          },
          'scheduling-01',
        ),
      ),
      schedulingsRepository.create(
        makeScheduling(
          {
            psychologistId: 'psychologist-01',
            appointmentDatetime: new Date('2024-10-21T09:00'),
          },
          'scheduling-02',
        ),
      ),
      schedulingsRepository.create(
        makeScheduling(
          {
            psychologistId: 'psychologist-01',
            appointmentDatetime: new Date('2024-10-21T11:00'),
          },
          'scheduling-03',
        ),
      ),
    ])

    const result = await sut.execute({
      psychologistId: 'psychologist-01',
      startDate: new Date('2024-10-19T09:00'),
      endDate: new Date('2024-10-21T10:00'),
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toEqual({
      schedulings: expect.arrayContaining([
        expect.objectContaining({ id: 'scheduling-01' }),
        expect.objectContaining({ id: 'scheduling-02' }),
      ]),
    })
  })
})
