import { type Either, success } from '@core/either'
import type { Patient } from '@domain/account/enterprise/entities/patient'
import { inject, injectable } from 'tsyringe'

import type { PatientsRepository } from '../repositories/patients-repository'

interface FetchPatientsUseCaseRequest {
  psychologistId: string
}

type FetchPatientsUseCaseResponse = Either<null, { patients: Patient[] }>

@injectable()
export class FetchPatientsUseCase {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: PatientsRepository,
  ) {}

  async execute({
    psychologistId,
  }: FetchPatientsUseCaseRequest): Promise<FetchPatientsUseCaseResponse> {
    const patients =
      await this.patientsRepository.findManyByPsychologistId(psychologistId)

    return success({ patients })
  }
}
