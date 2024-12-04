import { type Either, failure, success } from '@core/either'
import { inject, injectable } from 'tsyringe'

import type { PsychologistsRepository } from '../repositories/psychologists-repository'

interface DeleteAccountUseCaseRequest {
  psychologistId: string
}

type DeleteAccountUseCaseResponse = Either<Error, object>

@injectable()
export class DeleteAccountUseCase {
  constructor(
    @inject('PsychologistsRepository')
    private psychologistsRepository: PsychologistsRepository,
  ) {}

  async execute({
    psychologistId,
  }: DeleteAccountUseCaseRequest): Promise<DeleteAccountUseCaseResponse> {
    const psychologist =
      await this.psychologistsRepository.findById(psychologistId)

    if (!psychologist) {
      return failure(new Error('Psychologist not found.'))
    }

    await this.psychologistsRepository.delete(psychologistId)

    return success({})
  }
}
