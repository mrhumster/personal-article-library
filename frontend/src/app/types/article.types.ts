export interface AuthorIFace {
  first_name?: string,
  last_name?: string
}

export interface ArticleStateIFace {
  articles: {
    ids: string[],
    entities: {
      [key: string] : ArticleIFace
    }
  },
  current_article?: ArticleIFace
}

export interface ArticleIFace {
  id: string
  owner: string
  added: string
  file?: string
  year?: number
  title: string | null
  source?: string
  file_name?: string
  file_uuid?: string
  reference_type: number
  authors: AuthorIFace[]
}

export type ReferenceTypeItem = {
  label: string;
  id: number;
};

export type PublicationDetails = {
  year?: number;
  title?: string; // book title, encyclopedia title, conference title
  pages?: {
    from: number;
    to: number;
  };
  volume?: string;
  issue?: string;
}