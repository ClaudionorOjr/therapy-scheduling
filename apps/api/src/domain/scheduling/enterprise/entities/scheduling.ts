import { Entity } from '@core/entities/entity'
import type { Optional } from '@core/types/optional'

export type SchedulingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELED'
  | 'RESCHEDULING'

export type TypeOfService = 'REMOTE' | 'INPERSON'

export interface SchedulingProps {
  patientId: string
  psychologistId: string
  appointmentDatetime: Date
  appointmentLocation: string
  typeOfService: TypeOfService
  status: SchedulingStatus
  createdAt: Date
  updatedAt?: Date | null
}

export class Scheduling extends Entity<SchedulingProps> {
  /* GETTERS AND SETTERS */
  public get patientId(): string {
    return this.props.patientId
  }

  public get psychologistId(): string {
    return this.props.psychologistId
  }

  public get appointmentDatetime(): Date {
    return this.props.appointmentDatetime
  }

  public set appointmentDatetime(appointmentDate: Date) {
    this.props.appointmentDatetime = appointmentDate
    this.touch()
  }

  public get appointmentLocation(): string {
    return this.props.appointmentLocation
  }

  public set appointmentLocation(appointmentLocation: string) {
    this.props.appointmentLocation = appointmentLocation
    this.touch()
  }

  public get typeOfService(): TypeOfService {
    return this.props.typeOfService
  }

  public set typeOfService(typeOfService: TypeOfService) {
    this.props.typeOfService = typeOfService
    this.touch()
  }

  public get status(): SchedulingStatus {
    return this.props.status
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date | null | undefined {
    return this.props.updatedAt
  }

  /* METHODS */
  private touch() {
    this.props.updatedAt = new Date()
  }

  public confirm() {
    this.props.status = 'CONFIRMED'
    this.touch()
  }

  public cancel() {
    this.props.status = 'CANCELED'
    this.touch()
  }

  public reschedule() {
    this.props.status = 'RESCHEDULING'
    this.touch()
  }

  public static create(
    props: Optional<SchedulingProps, 'status' | 'createdAt'>,
    id?: string,
  ) {
    const scheduling = new Scheduling(
      {
        ...props,
        status: props.status ?? 'PENDING',
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return scheduling
  }
}
