import 'reflect-metadata'

import { makePatient } from 'test/factories/make-patient'
import { InMemoryPatientsRepository } from 'test/repositories/in-memory-patients-repository'
import { InMemoryResponsiblesRepository } from 'test/repositories/in-memory-responsibles-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import {
  DeletePatientUseCase,
  type DeletePatientUseCaseRequest,
} from './delete-patient'

describe('Delete patient use case', () => {
  let patientsRepository: InMemoryPatientsRepository
  let responsiblesRepository: InMemoryResponsiblesRepository
  let sut: DeletePatientUseCase
  let payload: DeletePatientUseCaseRequest

  beforeEach(() => {
    responsiblesRepository = new InMemoryResponsiblesRepository()
    patientsRepository = new InMemoryPatientsRepository(responsiblesRepository)
    sut = new DeletePatientUseCase(patientsRepository)

    payload = {
      patientId: 'patient-01',
      psychologistId: 'psychologist-01',
    }
  })

  it('should be able to delete a patient', async () => {
    await patientsRepository.create(
      makePatient({ psychologistId: 'psychologist-01' }, 'patient-01'),
      [],
    )

    const result = await sut.execute(payload)

    expect(result.isSuccess()).toBe(true)
    expect(patientsRepository.patients).toHaveLength(0)
    expect(responsiblesRepository.responsibles).toHaveLength(0)
  })

  it('should not be able to delete a patient that does not exist', async () => {
    const result = await sut.execute(payload)

    expect(result.isFailure()).toBe(true)
    expect(result.value).toEqual(new Error('Patient not found.'))
  })

  it('should not be able to delete a patient of another psychologist', async () => {
    await patientsRepository.create(
      makePatient({ psychologistId: 'psychologist-02' }, 'patient-01'),
      [],
    )

    const result = await sut.execute(payload)

    expect(result.isFailure()).toBe(true)
    expect(result.value).toEqual(new Error('Not allowed.'))
  })
})
