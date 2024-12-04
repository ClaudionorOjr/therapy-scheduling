import { type Either, failure, success } from '@core/either'
import { inject, injectable } from 'tsyringe'

import type { PsychologistsRepository } from '../repositories/psychologists-repository'

interface EditPsychologistUseCaseRequest {
  psychologistId: string
  fullName?: string
  phone?: string
  dateOfBirth?: Date
}

type EditPsychologistUseCaseResponse = Either<Error, object>

@injectable()
export class EditPsychologistUseCase {
  constructor(
    @inject('PsychologistsRepository')
    private psychologistsRepository: PsychologistsRepository,
  ) {}

  async execute({
    psychologistId,
    fullName,
    phone,
    dateOfBirth,
  }: EditPsychologistUseCaseRequest): Promise<EditPsychologistUseCaseResponse> {
    const psychologist =
      await this.psychologistsRepository.findById(psychologistId)

    if (!psychologist) {
      return failure(new Error('Psychologist not found.'))
    }

    psychologist.fullName = fullName ?? psychologist.fullName
    psychologist.phone = phone ?? psychologist.phone
    psychologist.dateOfBirth = dateOfBirth ?? psychologist.dateOfBirth

    await this.psychologistsRepository.save(psychologist)

    return success({})
  }
}
