import { Entity } from '@core/entities/entity'
import type { Optional } from '@core/types/optional'
import dayjs from 'dayjs'

export interface PatientProps {
  psychologistId: string
  fullName: string
  email: string
  phone: string
  dateOfBirth: Date
  occupation?: string | null
  createdAt: Date
  updatedAt?: Date | null
}

export class Patient extends Entity<PatientProps> {
  /* GETTERS AND SETTERS */
  public get psychologistId(): string {
    return this.props.psychologistId
  }

  public get fullName(): string {
    return this.props.fullName
  }

  public set fullName(fullName: string) {
    this.props.fullName = fullName
    this.touch()
  }

  public get email(): string {
    return this.props.email
  }

  public set email(email: string) {
    this.props.email = email
    this.touch()
  }

  public get phone(): string {
    return this.props.phone
  }

  public set phone(phone: string) {
    this.props.phone = phone
    this.touch()
  }

  public get dateOfBirth(): Date {
    return this.props.dateOfBirth
  }

  public set dateOfBirth(dateOfBirth: Date) {
    this.props.dateOfBirth = dateOfBirth
    this.touch()
  }

  public get occupation(): string | null | undefined {
    return this.props.occupation
  }

  public set occupation(occupation: string | null | undefined) {
    this.props.occupation = occupation
    this.touch()
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date | null | undefined {
    return this.props.updatedAt
  }

  /* METHODS */
  protected touch() {
    this.props.updatedAt = new Date()
  }

  public age(): number {
    return dayjs().diff(this.dateOfBirth, 'years')
  }

  public static create(
    props: Optional<PatientProps, 'createdAt'>,
    id?: string,
  ) {
    const patient = new Patient(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return patient
  }
}
