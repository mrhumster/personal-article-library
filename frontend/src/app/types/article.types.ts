import {HighlightArea} from "@react-pdf-viewer/highlight";

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

export interface WasOpeningScheme {
  lastOpeningDate: string
  scale: number
  page: number
}

export interface FileHistoryScheme {
  wasOpening: {[key: string]: WasOpeningScheme}
}

export interface HighlightScheme {
    id: number;
    content: string;
    highlightAreas: HighlightArea[];
    quote: string;
    file: string;
}


export interface FileScheme {
  id: string;
  file_name?: string;
  file_uuid?: string;
  extension?: string;
  size: number;
  created?: Date;
  owner: string
  history?: FileHistoryScheme;
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
  deleted?: boolean
  delete_date?: string
  favorite?: boolean
  read?: boolean
  read_date?: string
  notebooks?: string[]
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
  start: string | null
  end: string | null
};

export type PublicationDetails = {
  year: number | null;
  title: string | null; // book title, encyclopedia title, conference title
  pages: PagesType;
  volume: string | null;
  issue: string | null;
};
