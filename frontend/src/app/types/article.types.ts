export interface AuthorIFace {
  first_name?: string,
  last_name?: string
}

export interface ArticleStateIFace {
  articles: ArticleIFace[]
}

export interface ArticleIFace {
  id: string
  owner: string
  added: string
  file?: string
  year?: number
  title?: number
  source?: string
  file_name?: string
  file_uuid?: string
  reference_type?: string
  authors: AuthorIFace[]
}