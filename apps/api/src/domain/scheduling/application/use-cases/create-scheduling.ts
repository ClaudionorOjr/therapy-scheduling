import { type Either, failure, success } from '@core/either'
import type { PatientsRepository } from '@domain/account/application/repositories/patients-repository'
import type { PsychologistsRepository } from '@domain/account/application/repositories/psychologists-repository'
import {
  Scheduling,
  type TypeOfService,
} from '@domain/scheduling/enterprise/entities/scheduling'

import type { SchedulingsRepository } from '../repositories/schedulings-repository'

interface CreateSchedulingUseCaseRequest {
  psychologistId: string
  patientId: string
  appointmentDatetime: Date
  appointmentLocation: string
  typeOfService: TypeOfService
}

type CreateSchedulingUseCaseResponse = Either<Error, object>

export class CreateSchedulingUseCase {
  constructor(
    private schedulingsRepository: SchedulingsRepository,
    private psychologistsRepository: PsychologistsRepository,
    private patientsRepository: PatientsRepository,
  ) {}

  async execute({
    psychologistId,
    patientId,
    appointmentLocation,
    appointmentDatetime,
    typeOfService,
  }: CreateSchedulingUseCaseRequest): Promise<CreateSchedulingUseCaseResponse> {
    const psychologist =
      await this.psychologistsRepository.findById(psychologistId)

    if (!psychologist) {
      return failure(new Error('Psychologist not found.'))
    }

    const patient = await this.patientsRepository.findById(patientId)

    if (!patient) {
      return failure(new Error('Patient not found.'))
    }

    if (patient.psychologistId !== psychologistId) {
      return failure(new Error('Patient not assigned to psychologist.'))
    }

    if (appointmentDatetime < new Date()) {
      return failure(new Error('Appointment date must be in the future.'))
    }

    const scheduling = Scheduling.create({
      patientId,
      psychologistId,
      appointmentDatetime,
      appointmentLocation,
      typeOfService,
    })

    await this.schedulingsRepository.create(scheduling)

    // TODO Após criar o agendamento, enviar um e-mail ou whatsapp para o paciente.

    return success({})
  }
}
