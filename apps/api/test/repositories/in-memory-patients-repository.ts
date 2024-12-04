import type { PatientsRepository } from '@domain/account/application/repositories/patients-repository'
import type { Patient } from '@domain/account/enterprise/entities/patient'
import type { Responsible } from '@domain/account/enterprise/entities/responsible'

import type { InMemoryResponsiblesRepository } from './in-memory-responsibles-repository'

export class InMemoryPatientsRepository implements PatientsRepository {
  public patients: Patient[] = []

  constructor(private responsiblesRepository: InMemoryResponsiblesRepository) {}

  async create(patient: Patient, responsibles: Responsible[]): Promise<void> {
    this.patients.push(patient)

    if (responsibles.length > 0) {
      await this.responsiblesRepository.createMany(responsibles)
    }
  }

  async findByPsychologistIdEmailAndFullName(
    psychologistId: string,
    email: string,
    fullName: string,
  ): Promise<Patient | null> {
    const patient = this.patients.find(
      (patient) =>
        patient.psychologistId === psychologistId &&
        patient.email === email &&
        patient.fullName === fullName,
    )

    if (!patient) {
      return null
    }

    return patient
  }

  async findById(id: string): Promise<Patient | null> {
    const patient = this.patients.find((patient) => patient.id === id)

    if (!patient) {
      return null
    }

    return patient
  }

  async findManyByPsychologistId(id: string): Promise<Patient[]> {
    return this.patients.filter((patient) => patient.psychologistId === id)
  }

  async save(patient: Patient): Promise<void> {
    const patientIndex = this.patients.findIndex(
      (item) => item.id === patient.id,
    )

    this.patients[patientIndex] = patient
  }

  async delete(id: string): Promise<void> {
    const patientIndex = this.patients.findIndex((patient) => patient.id === id)
    const responsibles =
      await this.responsiblesRepository.findManyByPatientId(id)

    await this.responsiblesRepository.deleteMany(
      responsibles.map((responsible) => responsible.id),
    )

    this.patients.splice(patientIndex, 1)
  }
}
