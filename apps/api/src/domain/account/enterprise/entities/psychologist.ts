import { Entity } from '@core/entities/entity'
import type { Optional } from '@core/types/optional'

export interface PsychologistProps {
  fullName: string
  email: string
  passwordHash: string
  dateOfBirth: Date
  phone: string
  crp: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Psychologist extends Entity<PsychologistProps> {
  /* GETTERS AND SETTERS */
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

  public get passwordHash(): string {
    return this.props.passwordHash
  }

  public set passwordHash(password: string) {
    this.props.passwordHash = password
    this.touch()
  }

  public get dateOfBirth(): Date {
    return this.props.dateOfBirth
  }

  public set dateOfBirth(dateOfBirth: Date) {
    this.props.dateOfBirth = dateOfBirth
    this.touch()
  }

  public get phone(): string {
    return this.props.phone
  }

  public set phone(phone: string) {
    this.props.phone = phone
    this.touch()
  }

  public get crp(): string {
    return this.props.crp
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

  public static create(
    props: Optional<PsychologistProps, 'createdAt'>,
    id?: string,
  ) {
    const psychologist = new Psychologist(
      { ...props, createdAt: props.createdAt ?? new Date() },
      id,
    )

    return psychologist
  }
}
