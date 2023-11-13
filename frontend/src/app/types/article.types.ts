import {list} from "postcss";

export interface AuthorIFace {
  first_name?: string,
  last_name?: string
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
  file_name?: string
  file_uuid?: string
}

export interface ArticleIFace {
  id: string
  owner: string
  added: string
  file?: string
  publication?: PublicationDetails
  title: string | null
  source?: string
  files?: FileScheme[]
  reference_type: number
  authors: AuthorIFace[]
  additional_information: AdditionalInformationIFace | null
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

export type PublicationDetails = {
  year?: number;
  title?: string; // book title, encyclopedia title, conference title
  pages?: {
    start: number;
    end: number;
  };
  volume?: string;
  issue?: string;
}