import { type Either, failure, success } from '@core/either'
import type { PsychologistsRepository } from '@domain/account/application/repositories/psychologists-repository'
import type { TypeOfService } from '@domain/scheduling/enterprise/entities/scheduling'

import type { SchedulingsRepository } from '../repositories/schedulings-repository'

interface EditSchedulingUseCaseRequest {
  schedulingId: string
  psychologistId: string
  appointmentDatetime?: Date
  appointmentLocation?: string
  typeOfService?: TypeOfService
}

type EditSchedulingUseCaseResponse = Either<Error, object>

export class EditSchedulingUseCase {
  constructor(
    private schedulingsRepository: SchedulingsRepository,
    private psychologistsRepository: PsychologistsRepository,
  ) {}

  async execute({
    psychologistId,
    schedulingId,
    appointmentDatetime,
    appointmentLocation,
    typeOfService,
  }: EditSchedulingUseCaseRequest): Promise<EditSchedulingUseCaseResponse> {
    const psychologist =
      await this.psychologistsRepository.findById(psychologistId)

    if (!psychologist) {
      return failure(new Error('Psychologist not found.'))
    }

    const scheduling = await this.schedulingsRepository.findById(schedulingId)

    if (!scheduling) {
      return failure(new Error('Scheduling not found.'))
    }

    if (scheduling.psychologistId !== psychologistId) {
      return failure(new Error('Psychologist not assigned to scheduling.'))
    }

    if (appointmentDatetime && appointmentDatetime < new Date()) {
      return failure(new Error('Appointment date must be in the future.'))
    }

    scheduling.appointmentDatetime =
      appointmentDatetime ?? scheduling.appointmentDatetime
    scheduling.appointmentLocation =
      appointmentLocation ?? scheduling.appointmentLocation
    scheduling.typeOfService = typeOfService ?? scheduling.typeOfService

    await this.schedulingsRepository.save(scheduling)

    return success({})
  }
}
