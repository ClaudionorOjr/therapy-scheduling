import 'reflect-metadata'

import { makePatient } from 'test/factories/make-patient'
import { InMemoryPatientsRepository } from 'test/repositories/in-memory-patients-repository'
import { InMemoryResponsiblesRepository } from 'test/repositories/in-memory-responsibles-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { UnauthorizedError } from './errors/unauthorized-error'
import { GetPatientUseCase } from './get-patient'

describe('Get patient use case', () => {
  let responsiblesRepository: InMemoryResponsiblesRepository
  let patientsRepository: InMemoryPatientsRepository
  let sut: GetPatientUseCase

  beforeEach(() => {
    responsiblesRepository = new InMemoryResponsiblesRepository()
    patientsRepository = new InMemoryPatientsRepository(responsiblesRepository)
    sut = new GetPatientUseCase(patientsRepository)
  })

  it('should be able to get a patient', async () => {
    await patientsRepository.create(
      makePatient(
        {
          psychologistId: 'psychologist-01',
        },
        'patient-01',
      ),
      [],
    )

    const result = await sut.execute({
      patientId: 'patient-01',
      psychologistId: 'psychologist-01',
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toEqual({
      patient: expect.objectContaining({
        id: 'patient-01',
        psychologistId: 'psychologist-01',
      }),
    })
  })

  it('should not be able to get a patient that does not exist', async () => {
    const result = await sut.execute({
      patientId: 'patient-01',
      psychologistId: 'psychologist-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toEqual(new Error('Patient not found.'))
  })

  it('should not be able to get a patient of another psychologist', async () => {
    await patientsRepository.create(
      makePatient({ psychologistId: 'psychologist-02' }, 'patient-01'),
      [],
    )

    const result = await sut.execute({
      patientId: 'patient-01',
      psychologistId: 'psychologist-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })
})
