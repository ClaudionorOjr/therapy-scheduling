import { randomUUID } from 'node:crypto'

export abstract class Entity<Props> {
  private _id: string
  protected props: Props

  protected constructor(props: Props, id?: string) {
    this._id = id ?? randomUUID()
    this.props = props
  }

  public get id(): string {
    return this._id
  }
}
