import { makePatient } from 'test/factories/make-patient'
import { makeResponsible } from 'test/factories/make-responsible'
import { InMemoryPatientsRepository } from 'test/repositories/in-memory-patients-repository'
import { InMemoryResponsiblesRepository } from 'test/repositories/in-memory-responsibles-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import {
  RegisterResponsiblesUseCase,
  type RegisterResponsiblesUseCaseRequest,
} from './register-responsibles'

describe('Register responsibles use case', () => {
  let responsiblesRepository: InMemoryResponsiblesRepository
  let patientsRepository: InMemoryPatientsRepository
  let sut: RegisterResponsiblesUseCase
  let payload: RegisterResponsiblesUseCaseRequest

  beforeEach(() => {
    responsiblesRepository = new InMemoryResponsiblesRepository()
    patientsRepository = new InMemoryPatientsRepository(responsiblesRepository)
    sut = new RegisterResponsiblesUseCase(
      responsiblesRepository,
      patientsRepository,
    )

    payload = {
      patientId: 'patient-01',
      psychologistId: 'psychologist-01',
      responsibles: [
        {
          fullName: 'John Doe',
          email: 'qJwvM@example.com',
          phone: '123456789',
          degreeOfKinship: 'Father',
        },
        {
          fullName: 'Johanna Doe',
          email: 'qJwvM@example.com',
          phone: '123456789',
          degreeOfKinship: 'Mother',
        },
      ],
    }
  })

  it('should be able to register a responsible', async () => {
    const responsible = makeResponsible(
      { patientId: 'patient-01' },
      'responsible-01',
    )
    await patientsRepository.create(
      makePatient({ psychologistId: 'psychologist-01' }, 'patient-01'),
      [responsible],
    )

    const result = await sut.execute(payload)

    expect(result.isSuccess()).toBe(true)

    expect(responsiblesRepository.responsibles).toEqual([
      expect.objectContaining({
        ...responsible,
      }),
      expect.objectContaining({
        ...payload.responsibles[0],
      }),
      expect.objectContaining({
        ...payload.responsibles[1],
      }),
    ])
  })

  it('should not be able to register a responsible a nonexistent patient', async () => {
    const result = await sut.execute(payload)

    expect(result.isFailure()).toBe(true)
    expect(result.value).toEqual(new Error('Patient not found.'))
  })

  it('should not be able to register a responsible of another patient', async () => {
    await patientsRepository.create(
      makePatient({ psychologistId: 'psychologist-02' }, 'patient-01'),
      [],
    )

    const result = await sut.execute(payload)

    expect(result.isFailure()).toBe(true)
    expect(result.value).toEqual(new Error('Not allowed.'))
  })
})
