import { type Either, failure, success } from '@core/either'
import type { Patient } from '@domain/account/enterprise/entities/patient'
import { inject, injectable } from 'tsyringe'

import type { PatientsRepository } from '../repositories/patients-repository'
import { UnauthorizedError } from './errors/unauthorized-error'

interface GetPatientUseCaseRequest {
  patientId: string
  psychologistId: string
}

type GetPatientUseCaseResponse = Either<Error, { patient: Patient }>

@injectable()
export class GetPatientUseCase {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: PatientsRepository,
  ) {}

  async execute({
    patientId,
    psychologistId,
  }: GetPatientUseCaseRequest): Promise<GetPatientUseCaseResponse> {
    const patient = await this.patientsRepository.findById(patientId)

    if (!patient) {
      return failure(new Error('Patient not found.'))
    }

    if (patient.psychologistId !== psychologistId) {
      return failure(new UnauthorizedError('Not allowed.'))
    }

    return success({ patient })
  }
}
