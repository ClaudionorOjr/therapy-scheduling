import { type Either, failure, success } from '@core/either'
import { inject, injectable } from 'tsyringe'

import type { PatientsRepository } from '../repositories/patients-repository'

export interface EditPatientUseCaseRequest {
  psychologistId: string
  patientId: string
  fullName?: string
  email?: string
  phone?: string
  dateOfBirth?: Date
  occupation?: string
}

type EditPatientUseCaseResponse = Either<Error, object>

@injectable()
export class EditPatientUseCase {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: PatientsRepository,
  ) {}

  async execute({
    psychologistId,
    patientId,
    fullName,
    email,
    phone,
    dateOfBirth,
    occupation,
  }: EditPatientUseCaseRequest): Promise<EditPatientUseCaseResponse> {
    const patient = await this.patientsRepository.findById(patientId)

    if (!patient) {
      return failure(new Error('Patient not found.'))
    }

    if (patient.psychologistId !== psychologistId) {
      return failure(new Error('Not allowed.'))
    }

    patient.fullName = fullName ?? patient.fullName
    patient.email = email ?? patient.email
    patient.phone = phone ?? patient.phone
    patient.dateOfBirth = dateOfBirth ?? patient.dateOfBirth
    patient.occupation = occupation ?? patient.occupation

    await this.patientsRepository.save(patient)

    return success({})
  }
}
