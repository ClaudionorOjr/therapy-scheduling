import { type Either, failure, success } from '@core/either'
import { inject, injectable } from 'tsyringe'

import type { PatientsRepository } from '../repositories/patients-repository'

export interface DeletePatientUseCaseRequest {
  patientId: string
  psychologistId: string
}

type DeletePatientUseCaseResponse = Either<Error, object>

@injectable()
export class DeletePatientUseCase {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: PatientsRepository,
  ) {}

  async execute({
    patientId,
    psychologistId,
  }: DeletePatientUseCaseRequest): Promise<DeletePatientUseCaseResponse> {
    const patient = await this.patientsRepository.findById(patientId)

    if (!patient) {
      return failure(new Error('Patient not found.'))
    }

    if (patient.psychologistId !== psychologistId) {
      return failure(new Error('Not allowed.'))
    }

    await this.patientsRepository.delete(patientId)

    return success({})
  }
}
