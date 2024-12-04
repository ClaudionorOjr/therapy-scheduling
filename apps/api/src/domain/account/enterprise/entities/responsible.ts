import { Entity } from '@core/entities/entity'

export interface ResponsibleProps {
  patientId: string
  fullName: string
  email: string
  phone: string
  degreeOfKinship: string
}

export class Responsible extends Entity<ResponsibleProps> {
  /* GETTERS AND SETTERS */

  public get patientId(): string {
    return this.props.patientId
  }

  public get fullName(): string {
    return this.props.fullName
  }

  public set fullName(fullName: string) {
    this.props.fullName = fullName
  }

  public get email(): string {
    return this.props.email
  }

  public set email(email: string) {
    this.props.email = email
  }

  public get phone(): string {
    return this.props.phone
  }

  public set phone(phone: string) {
    this.props.phone = phone
  }

  public get degreeOfKinship(): string {
    return this.props.degreeOfKinship
  }

  public set degreeOfKinship(degreeOfKinship: string) {
    this.props.degreeOfKinship = degreeOfKinship
  }

  public static create(props: ResponsibleProps, id?: string) {
    const responsible = new Responsible(props, id)

    return responsible
  }
}
