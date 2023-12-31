export interface AuthorIFace {
  first_name?: string
  last_name?: string
  sur_name?: string
}

export interface EditorsIFace {
  last_name?: string
  first_name?: string
  sur_name? :string
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

export interface FileScheme {
  id: string;
  file_name?: string;
  file_uuid?: string;
  extension?: string;
  size: number;
  created?: Date;
  owner: string
}

export interface ArticleURLs {
  date_accessed?: string
  urls: string[]
}

export interface MetaIFace {
  title?: string
  authors?: string
  publisher?: string
  year?: string
  language?: string
}


export interface ISBN {
  value: string
  meta: MetaIFace
}

export interface Identifiers {
  isbn: ISBN
}

export interface ArticleIFace {
  id: string
  owner: string
  added: string
  publication?: PublicationDetails
  title: string | null
  source?: string
  files?: string[]
  reference_type: number
  authors: AuthorIFace[]
  additional_information: AdditionalInformationIFace | null
  urls: ArticleURLs
  identifiers?: Identifiers
  description?: string
}

export interface CreateArticleIFace {
  title: string
  files?: string[]
}

export interface AdditionalInformationIFace {
  edition?: string
  editors?: EditorsIFace[]
  city?: string
  publisher?: string
  month?: string
  day?: string
}

export type ReferenceTypeItem = {
  label: string;
  id: number;
};

export type PagesType = {
  start?: string
  end?: string
};

export type PublicationDetails = {
  year?: string;
  title?: string; // book title, encyclopedia title, conference title
  pages?: PagesType
  volume?: string;
  issue?: string;
};
