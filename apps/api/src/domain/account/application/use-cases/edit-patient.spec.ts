import 'reflect-metadata'

import { makePatient } from 'test/factories/make-patient'
import { InMemoryPatientsRepository } from 'test/repositories/in-memory-patients-repository'
import { InMemoryResponsiblesRepository } from 'test/repositories/in-memory-responsibles-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import {
  EditPatientUseCase,
  type EditPatientUseCaseRequest,
} from './edit-patient'

describe('Edit patient use case', () => {
  let patientsRepository: InMemoryPatientsRepository
  let responsiblesRepository: InMemoryResponsiblesRepository
  let sut: EditPatientUseCase
  let payload: EditPatientUseCaseRequest

  beforeEach(() => {
    responsiblesRepository = new InMemoryResponsiblesRepository()
    patientsRepository = new InMemoryPatientsRepository(responsiblesRepository)
    sut = new EditPatientUseCase(patientsRepository)

    payload = {
      psychologistId: 'psychologist-01',
      patientId: 'patient-01',
      fullName: 'John Doe',
      email: 'qJwvM@example.com',
      phone: '123456789',
      dateOfBirth: new Date('1995-01-11'),
      occupation: 'Developer',
    }
  })

  it('should be able to edit a patient', async () => {
    await patientsRepository.create(
      makePatient({ psychologistId: 'psychologist-01' }, 'patient-01'),
      [],
    )

    const result = await sut.execute(payload)

    expect(result.isSuccess()).toBe(true)
    expect(patientsRepository.patients).toMatchObject([
      {
        id: 'patient-01',
        psychologistId: 'psychologist-01',
        fullName: 'John Doe',
        email: 'qJwvM@example.com',
        phone: '123456789',
        dateOfBirth: new Date('1995-01-11'),
        occupation: 'Developer',
      },
    ])
  })

  it('should not be able to edit a patient that does not exist', async () => {
    const result = await sut.execute(payload)

    expect(result.isFailure()).toBe(true)
    expect(result.value).toEqual(new Error('Patient not found.'))
  })

  it('should not be able a psychologist edit patient of another psychologist', async () => {
    await patientsRepository.create(
      makePatient({ psychologistId: 'psychologist-02' }, 'patient-01'),
      [],
    )

    const result = await sut.execute(payload)

    expect(result.isFailure()).toBe(true)
    expect(result.value).toEqual(new Error('Not allowed.'))
  })
})
