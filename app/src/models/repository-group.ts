/** A user-defined collection for organizing repositories in Desktop. */
export class RepositoryGroup {
  public constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly sortOrder: number
  ) {}
}
