import { makePatient } from 'test/factories/make-patient'
import { makeResponsible } from 'test/factories/make-responsible'
import { InMemoryPatientsRepository } from 'test/repositories/in-memory-patients-repository'
import { InMemoryResponsiblesRepository } from 'test/repositories/in-memory-responsibles-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import {
  EditResponsibleUseCase,
  type EditResponsibleUseCaseRequest,
} from './edit-responsible'

describe('Edit responsible use case', () => {
  let responsiblesRepository: InMemoryResponsiblesRepository
  let patientsRepository: InMemoryPatientsRepository
  let sut: EditResponsibleUseCase
  let payload: EditResponsibleUseCaseRequest

  beforeEach(() => {
    responsiblesRepository = new InMemoryResponsiblesRepository()
    patientsRepository = new InMemoryPatientsRepository(responsiblesRepository)
    sut = new EditResponsibleUseCase(responsiblesRepository, patientsRepository)

    payload = {
      psychologistId: 'psychologist-01',
      responsibleId: 'responsible-01',
      fullName: 'John Doe',
      email: 'qJwvM@example.com',
      phone: '123456789',
      degreeOfKinship: 'Father',
    }
  })

  it('should be able to edit a responsible', async () => {
    await patientsRepository.create(
      makePatient({ psychologistId: 'psychologist-01' }, 'patient-01'),
      [],
    )

    await responsiblesRepository.create(
      makeResponsible({ patientId: 'patient-01' }, 'responsible-01'),
    )

    const result = await sut.execute(payload)

    expect(result.isSuccess()).toBe(true)
    expect(responsiblesRepository.responsibles).toMatchObject([
      {
        id: 'responsible-01',
        patientId: 'patient-01',
        fullName: 'John Doe',
        email: 'qJwvM@example.com',
        phone: '123456789',
        degreeOfKinship: 'Father',
      },
    ])
  })

  it('should not be able to edit a responsible that does not exist', async () => {
    const result = await sut.execute(payload)

    expect(result.isFailure()).toBe(true)
    expect(result.value).toEqual(new Error('Responsible not found.'))
  })

  it('should not be able a psychologist edit responsible of another psychologist', async () => {
    await patientsRepository.create(
      makePatient({ psychologistId: 'psychologist-02' }, 'patient-01'),
      [],
    )

    await responsiblesRepository.create(
      makeResponsible({ patientId: 'patient-01' }, 'responsible-01'),
    )

    const result = await sut.execute(payload)

    expect(result.isFailure()).toBe(true)
    expect(result.value).toEqual(new Error('Not allowed.'))
  })
})
