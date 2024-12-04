import type {
  FilterParams,
  SchedulingsRepository,
} from '@domain/scheduling/application/repositories/schedulings-repository'
import type { Scheduling } from '@domain/scheduling/enterprise/entities/scheduling'

export class InMemorySchedulingsRepository implements SchedulingsRepository {
  public schedulings: Scheduling[] = []

  async create(scheduling: Scheduling): Promise<void> {
    this.schedulings.push(scheduling)
  }

  async findById(id: string): Promise<Scheduling | null> {
    const scheduling = this.schedulings.find(
      (scheduling) => scheduling.id === id,
    )

    if (!scheduling) {
      return null
    }

    return scheduling
  }

  async findManyByPsychologistId(
    psychologistId: string,
    { patientId, startDate, endDate }: FilterParams,
  ): Promise<Scheduling[]> {
    return this.schedulings.filter((scheduling) => {
      if (scheduling.psychologistId !== psychologistId) return false

      if (patientId && scheduling.patientId !== patientId) return false

      if (startDate && scheduling.appointmentDatetime < startDate) return false

      if (endDate && scheduling.appointmentDatetime > endDate) return false

      return true
    })
  }

  async save(scheduling: Scheduling): Promise<void> {
    const schedulingIndex = this.schedulings.findIndex(
      (item) => item.id === scheduling.id,
    )

    this.schedulings[schedulingIndex] = scheduling
  }

  async delete(id: string): Promise<void> {
    const schedulingIndex = this.schedulings.findIndex(
      (scheduling) => scheduling.id === id,
    )

    this.schedulings.splice(schedulingIndex, 1)
  }
}
