import { makePatient } from 'test/factories/make-patient'
import { makePsychologist } from 'test/factories/make-psychologist'
import { InMemoryPatientsRepository } from 'test/repositories/in-memory-patients-repository'
import { InMemoryPsychologistsRepository } from 'test/repositories/in-memory-psychologists-repository'
import { InMemoryResponsiblesRepository } from 'test/repositories/in-memory-responsibles-repository'
import { InMemorySchedulingsRepository } from 'test/repositories/in-memory-schedulings-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { CreateSchedulingUseCase } from './create-scheduling'

describe('Create scheduling', () => {
  let responsiblesRepository: InMemoryResponsiblesRepository
  let schedulingRepository: InMemorySchedulingsRepository
  let patientsRepository: InMemoryPatientsRepository
  let psychologistsRepository: InMemoryPsychologistsRepository
  let sut: CreateSchedulingUseCase

  beforeEach(() => {
    responsiblesRepository = new InMemoryResponsiblesRepository()
    schedulingRepository = new InMemorySchedulingsRepository()
    patientsRepository = new InMemoryPatientsRepository(responsiblesRepository)
    psychologistsRepository = new InMemoryPsychologistsRepository()
    sut = new CreateSchedulingUseCase(
      schedulingRepository,
      psychologistsRepository,
      patientsRepository,
    )
  })

  it('should be able to create a scheduling', async () => {
    await psychologistsRepository.create(
      makePsychologist({}, 'psychologist-01'),
    )
    await patientsRepository.create(
      makePatient({ psychologistId: 'psychologist-01' }, 'patient-01'),
      [],
    )

    const appointmentDatetime = new Date(Date.now() + 1000 * 60 * 60 * 24)

    const result = await sut.execute({
      psychologistId: 'psychologist-01',
      patientId: 'patient-01',
      appointmentLocation: 'any',
      appointmentDatetime,
      typeOfService: 'INPERSON',
    })

    expect(result.isSuccess()).toBe(true)
    expect(schedulingRepository.schedulings).toHaveLength(1)
    expect(schedulingRepository.schedulings[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        psychologistId: 'psychologist-01',
        patientId: 'patient-01',
        appointmentLocation: 'any',
        appointmentDatetime,
        typeOfService: 'INPERSON',
      }),
    )
  })

  it('should not be able to create a scheduling if psychologist does not exist', async () => {
    const result = await sut.execute({
      psychologistId: 'psychologist-01',
      patientId: 'patient-01',
      appointmentLocation: 'any',
      appointmentDatetime: new Date(Date.now() + 1000 * 60 * 60 * 24),
      typeOfService: 'INPERSON',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toEqual(new Error('Psychologist not found.'))
  })

  it('should not be able to create a scheduling if patient does not exist', async () => {
    await psychologistsRepository.create(
      makePsychologist({}, 'psychologist-01'),
    )

    const result = await sut.execute({
      psychologistId: 'psychologist-01',
      patientId: 'patient-01',
      appointmentLocation: 'any',
      appointmentDatetime: new Date(Date.now() + 1000 * 60 * 60 * 24),
      typeOfService: 'INPERSON',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toEqual(new Error('Patient not found.'))
  })

  it('should not be able to create a scheduling if patient is not assigned to psychologist', async () => {
    await psychologistsRepository.create(
      makePsychologist({}, 'psychologist-01'),
    )
    await patientsRepository.create(
      makePatient({ psychologistId: 'psychologist-02' }, 'patient-01'),
      [],
    )

    const result = await sut.execute({
      psychologistId: 'psychologist-01',
      patientId: 'patient-01',
      appointmentLocation: 'any',
      appointmentDatetime: new Date(Date.now() + 1000 * 60 * 60 * 24),
      typeOfService: 'INPERSON',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toEqual(
      new Error('Patient not assigned to psychologist.'),
    )
  })

  it('should not be able to create a scheduling if appointment date is in the past', async () => {
    await psychologistsRepository.create(
      makePsychologist({}, 'psychologist-01'),
    )
    await patientsRepository.create(
      makePatient({ psychologistId: 'psychologist-01' }, 'patient-01'),
      [],
    )

    const result = await sut.execute({
      psychologistId: 'psychologist-01',
      patientId: 'patient-01',
      appointmentLocation: 'any',
      appointmentDatetime: new Date(Date.now() - 1000 * 60 * 60 * 24),
      typeOfService: 'INPERSON',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toEqual(
      new Error('Appointment date must be in the future.'),
    )
  })
})
