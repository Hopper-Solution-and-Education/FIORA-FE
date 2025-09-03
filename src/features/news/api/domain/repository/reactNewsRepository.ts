export interface IReactNewsRepository {
  getReactByComment(commentId: string): Promise<string>;
}
