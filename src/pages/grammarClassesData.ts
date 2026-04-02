export const grammarClasses = [
  { label: "Substantivos", slug: "substantivos" },
  { label: "Pronomes", slug: "pronomes" },
  { label: "Verbos", slug: "verbos" },
  { label: "Adjetivos", slug: "adjetivos" },
  { label: "Adverbios", slug: "adverbios" },
  { label: "Preposicoes", slug: "preposicoes" },
  { label: "Conjuncoes", slug: "conjuncoes" },
  { label: "Interjeicoes", slug: "interjeicoes" },
  { label: "Artigos", slug: "artigos" },
] as const

export const getGrammarClassLabel = (slug?: string) =>
  grammarClasses.find((item) => item.slug === slug)?.label || "Classe gramatical"
