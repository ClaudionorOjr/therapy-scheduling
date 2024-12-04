import 'reflect-metadata'

import { makePatient } from 'test/factories/make-patient'
import { makePsychologist } from 'test/factories/make-psychologist'
import { InMemoryPatientsRepository } from 'test/repositories/in-memory-patients-repository'
import { InMemoryPsychologistsRepository } from 'test/repositories/in-memory-psychologists-repository'
import { InMemoryResponsiblesRepository } from 'test/repositories/in-memory-responsibles-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import {
  RegisterPatientUseCase,
  type RegisterPatientUseCaseRequest,
} from './register-patient'

describe('Register patient use case', () => {
  let psychologistsRepository: InMemoryPsychologistsRepository
  let patientsRepository: InMemoryPatientsRepository
  let responsiblesRepository: InMemoryResponsiblesRepository
  let sut: RegisterPatientUseCase
  let payload: RegisterPatientUseCaseRequest

  beforeEach(() => {
    psychologistsRepository = new InMemoryPsychologistsRepository()
    responsiblesRepository = new InMemoryResponsiblesRepository()
    patientsRepository = new InMemoryPatientsRepository(responsiblesRepository)
    sut = new RegisterPatientUseCase(
      psychologistsRepository,
      patientsRepository,
    )

    payload = {
      psychologistId: 'psychologist-01',
      fullName: 'John Doe',
      email: 'qJwvM@example.com',
      phone: '123456789',
      dateOfBirth: new Date(),
      occupation: 'Developer',
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

  it('should be able to register a patient', async () => {
    await psychologistsRepository.create(
      makePsychologist({}, 'psychologist-01'),
    )

    const result = await sut.execute(payload)

    expect(result.isSuccess()).toBe(true)
    expect(patientsRepository.patients).toEqual([
      expect.objectContaining({
        psychologistId: 'psychologist-01',
      }),
    ])
    expect(responsiblesRepository.responsibles).toEqual([
      expect.objectContaining({
        ...payload.responsibles[0],
      }),
      expect.objectContaining({
        ...payload.responsibles[1],
      }),
    ])
  })

  it('should not be able to registar a patient without a psychologist', async () => {
    const result = await sut.execute(payload)

    expect(result.isFailure()).toBe(true)
    expect(result.value).toEqual(new Error('Psychologist not found.'))
  })

  it('should not be able for the same psychologist to register a patient with an existing email and full name', async () => {
    await psychologistsRepository.create(
      makePsychologist({}, 'psychologist-01'),
    )

    await patientsRepository.create(
      makePatient(
        {
          psychologistId: 'psychologist-01',
          email: 'qJwvM@example.com',
          fullName: 'John Doe',
        },
        'patient-01',
      ),
      [],
    )

    const result = await sut.execute(payload)

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should not be able to register a minor patient without responsibles', async () => {
    await psychologistsRepository.create(
      makePsychologist({}, 'psychologist-01'),
    )

    const result = await sut.execute({
      ...payload,
      dateOfBirth: new Date(),
      responsibles: [],
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toEqual(
      new Error('Minor patients must have at least one responsible.'),
    )
  })
})
