export interface CollectionIFace {
  id?: string,
  title: string
  articles: string[]
}

export interface CollectionStateIFace {
  ids: string[],
  entities: {
    [key: string] : CollectionIFace
  }
}