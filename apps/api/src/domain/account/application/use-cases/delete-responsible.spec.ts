import { makePatient } from 'test/factories/make-patient'
import { makeResponsible } from 'test/factories/make-responsible'
import { InMemoryPatientsRepository } from 'test/repositories/in-memory-patients-repository'
import { InMemoryResponsiblesRepository } from 'test/repositories/in-memory-responsibles-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { DeleteResponsibleUseCase } from './delete-responsible'

describe('Delete responsible use case', () => {
  let patientsRepository: InMemoryPatientsRepository
  let responsiblesRepository: InMemoryResponsiblesRepository
  let sut: DeleteResponsibleUseCase

  beforeEach(() => {
    responsiblesRepository = new InMemoryResponsiblesRepository()
    patientsRepository = new InMemoryPatientsRepository(responsiblesRepository)
    sut = new DeleteResponsibleUseCase(
      patientsRepository,
      responsiblesRepository,
    )
  })

  it('should be able to delete a responsible', async () => {
    await patientsRepository.create(
      makePatient({ psychologistId: 'psychologist-01' }, 'patient-01'),
      [makeResponsible({ patientId: 'patient-01' }, 'responsible-01')],
    )

    const result = await sut.execute({
      responsibleId: 'responsible-01',
      psychologistId: 'psychologist-01',
    })

    expect(result.isSuccess()).toBe(true)
    expect(responsiblesRepository.responsibles).toHaveLength(0)
  })

  it('should not be able to delete a responsible that does not exist', async () => {
    const result = await sut.execute({
      responsibleId: 'responsible-01',
      psychologistId: 'psychologist-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toEqual(new Error('Responsible not found.'))
  })

  it('should not be able to delete a responsible of another patient', async () => {
    await responsiblesRepository.create(
      makeResponsible({ patientId: 'patient-02' }, 'responsible-01'),
    )

    const result = await sut.execute({
      responsibleId: 'responsible-01',
      psychologistId: 'psychologist-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toEqual(new Error('Not allowed.'))
  })
})
