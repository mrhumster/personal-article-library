export interface AuthorIFace {
  first_name?: string,
  last_name?: string
}

export interface ArticleIFace {
  owner: string,
  added: string,
  file?: string,
  year?: number,
  title?: number,
  source?: string
  reference_type?: string
  authors: AuthorIFace[]
}