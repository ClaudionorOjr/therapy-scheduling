import { type Either, failure, success } from '@core/either'
import { Patient } from '@domain/account/enterprise/entities/patient'
import { Responsible } from '@domain/account/enterprise/entities/responsible'
import { inject, injectable } from 'tsyringe'

import type { PatientsRepository } from '../repositories/patients-repository'
import type { PsychologistsRepository } from '../repositories/psychologists-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

type ResponsibleRequest = Omit<Responsible, 'id' | 'patientId'>

export interface RegisterPatientUseCaseRequest {
  psychologistId: string
  fullName: string
  email: string
  phone: string
  dateOfBirth: Date
  occupation?: string | null
  responsibles: ResponsibleRequest[]
}

type RegisterPatientUseCaseResponse = Either<Error, object>

@injectable()
export class RegisterPatientUseCase {
  constructor(
    @inject('PsychologistsRepository')
    private psychologistsRepository: PsychologistsRepository,
    @inject('PatientsRepository')
    private patientsRepository: PatientsRepository,
  ) {}

  async execute({
    psychologistId,
    fullName,
    email,
    phone,
    dateOfBirth,
    occupation,
    responsibles: responsiblesRequest,
  }: RegisterPatientUseCaseRequest): Promise<RegisterPatientUseCaseResponse> {
    const psychologist =
      await this.psychologistsRepository.findById(psychologistId)

    if (!psychologist) {
      return failure(new Error('Psychologist not found.'))
    }

    // TODO Rever a validação de usuário já existente pelo e-mail. Futuramente vou permitir que usuários menores de idade que não tenham seus próprios dados de contato, como e-mail e telefone, recebam os dados de contato de um responsável como seus próprios contatos de e-mail e telefone. Assim, caso tente cadastrar um usuário em que já haja outro usuário com o mesmo e-mail, vindo do responsável, não será possível.
    const userAlreadyExists =
      await this.patientsRepository.findByPsychologistIdEmailAndFullName(
        psychologistId,
        email,
        fullName,
      )

    if (userAlreadyExists) {
      return failure(new UserAlreadyExistsError('Patient already exists.'))
    }

    const patient = Patient.create({
      psychologistId,
      fullName,
      email,
      phone,
      dateOfBirth,
      occupation,
    })

    if (patient.age() < 18 && responsiblesRequest.length === 0) {
      return failure(
        new Error('Minor patients must have at least one responsible.'),
      )
    }

    const responsibles = responsiblesRequest.map((responsible) => {
      return Responsible.create({
        patientId: patient.id,
        ...responsible,
      })
    })

    await this.patientsRepository.create(patient, responsibles)

    return success({})
  }
}
