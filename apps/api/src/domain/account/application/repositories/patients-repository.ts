import type { Patient } from '@domain/account/enterprise/entities/patient'
import type { Responsible } from '@domain/account/enterprise/entities/responsible'

export interface PatientsRepository {
  create(patient: Patient, responsibles?: Responsible[]): Promise<void>
  findByPsychologistIdEmailAndFullName(
    psychologistId: string,
    email: string,
    fullName: string,
  ): Promise<Patient | null>
  findById(id: string): Promise<Patient | null>
  findManyByPsychologistId(psychologistId: string): Promise<Patient[]>
  save(patient: Patient): Promise<void>
  delete(id: string): Promise<void>
}
