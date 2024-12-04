import type { Scheduling } from '@domain/scheduling/enterprise/entities/scheduling'

export interface FilterParams {
  patientId?: string
  startDate?: Date
  endDate?: Date
}

export interface SchedulingsRepository {
  create(scheduling: Scheduling): Promise<void>
  findById(id: string): Promise<Scheduling | null>
  findManyByPsychologistId(
    psychologistId: string,
    params?: FilterParams,
  ): Promise<Scheduling[]>
  save(scheduling: Scheduling): Promise<void>
  delete(id: string): Promise<void>
}
