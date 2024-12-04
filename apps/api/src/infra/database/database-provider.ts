export interface DatabaseProvider {
  connect(): Promise<void>
  disconnect(): Promise<void>
}
