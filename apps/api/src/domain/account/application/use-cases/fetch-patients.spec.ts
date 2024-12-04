import 'reflect-metadata'

import { makePatient } from 'test/factories/make-patient'
import { InMemoryPatientsRepository } from 'test/repositories/in-memory-patients-repository'
import { InMemoryResponsiblesRepository } from 'test/repositories/in-memory-responsibles-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { FetchPatientsUseCase } from './fetch-patients'

describe('Fetch patients use case', () => {
  let responsiblesRepository: InMemoryResponsiblesRepository
  let patientsRepository: InMemoryPatientsRepository
  let sut: FetchPatientsUseCase

  beforeEach(() => {
    responsiblesRepository = new InMemoryResponsiblesRepository()
    patientsRepository = new InMemoryPatientsRepository(responsiblesRepository)
    sut = new FetchPatientsUseCase(patientsRepository)
  })

  it('should be able to fetch patients for the patient', async () => {
    await Promise.all([
      patientsRepository.create(
        makePatient({ psychologistId: 'psychologist-01' }, 'patient-01'),
        [],
      ),
      patientsRepository.create(
        makePatient({ psychologistId: 'psychologist-01' }, 'patient-02'),
        [],
      ),
    ])

    const result = await sut.execute({ psychologistId: 'psychologist-01' })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toEqual({
      patients: expect.arrayContaining([
        expect.objectContaining({ id: 'patient-01' }),
        expect.objectContaining({ id: 'patient-02' }),
      ]),
    })
  })
})
