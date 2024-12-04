import { makeResponsible } from 'test/factories/make-responsible'
import { InMemoryResponsiblesRepository } from 'test/repositories/in-memory-responsibles-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { FetchResponsiblesUseCase } from './fetch-responsibles'

describe('Fetch responsibles use case', () => {
  let responsiblesRepository: InMemoryResponsiblesRepository
  let sut: FetchResponsiblesUseCase

  beforeEach(() => {
    responsiblesRepository = new InMemoryResponsiblesRepository()
    sut = new FetchResponsiblesUseCase(responsiblesRepository)
  })

  it('should be able to fetch responsibles for the patient', async () => {
    await Promise.all([
      responsiblesRepository.create(
        makeResponsible({ patientId: 'patient-01' }, 'responsible-01'),
      ),
      responsiblesRepository.create(
        makeResponsible({ patientId: 'patient-01' }, 'responsible-02'),
      ),
    ])

    const result = await sut.execute({ patientId: 'patient-01' })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toEqual({
      responsibles: expect.arrayContaining([
        expect.objectContaining({ id: 'responsible-01' }),
        expect.objectContaining({ id: 'responsible-02' }),
      ]),
    })
  })
})
