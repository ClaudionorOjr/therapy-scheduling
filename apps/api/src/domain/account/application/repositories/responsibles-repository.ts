import type { Responsible } from '@domain/account/enterprise/entities/responsible'

export interface ResponsiblesRepository {
  create(responsible: Responsible): Promise<void>
  createMany(responsibles: Responsible[]): Promise<void>
  findById(id: string): Promise<Responsible | null>
  findManyByPatientId(patientId: string): Promise<Responsible[]>
  save(responsible: Responsible): Promise<void>
  delete(id: string): Promise<void>
  deleteMany(ids: string[]): Promise<void>
}
