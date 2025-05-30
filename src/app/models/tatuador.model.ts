// Interface para o modelo de Tatuador
export interface Tatuador {
  id?: number;
  nome: string;
  nomeSocial?: string | undefined;
  email: string;
  telefone: string;
  dataNascimento: string; // Formato ISO: yyyy-MM-dd
  especialidade: EspecialidadeEnum;
  experiencia: number; // Anos de experiência
  portfolio?: string | undefined; // URL ou descrição do portfólio
  ativo: boolean;
  observacao?: string | undefined;
}

// Interface para requisição de criação de tatuador
export interface TatuadorRequest {
  tatuador: Omit<Tatuador, 'id'>; // Na criação normalmente não se envia o id
}

// Interface para resposta do servidor
export interface TatuadorResponse extends Tatuador {
  id: number; // Na resposta o id é obrigatório
  dataCriacao?: string | undefined; // Formato ISO: yyyy-MM-ddTHH:mm:ss
  dataAtualizacao?: string | undefined; // Formato ISO: yyyy-MM-ddTHH:mm:ss
}

// Interface para dados do formulário
export interface TatuadorFormData {
  nome: string;
  nomeSocial?: string | undefined;
  email: string;
  telefone: string;
  dataNascimento: Date; // Melhor usar Date para manipulação
  especialidade: EspecialidadeEnum;
  experiencia: number;
  portfolio?: string | undefined;
  ativo: boolean;
  observacao?: string | undefined;
}

// Enum para especialidades de tatuagem
export enum EspecialidadeEnum {
  REALISMO = 'Realismo',
  OLD_SCHOOL = 'Old School',
  TRIBAL = 'Tribal',
  JAPONESA = 'Japonesa',
  GEOMETRICA = 'Geométrica',
  AQUARELA = 'Aquarela',
  MINIMALISTA = 'Minimalista',
  BLACKWORK = 'Blackwork',
  DOTWORK = 'Dotwork',
  NEO_TRADICIONAL = 'Neo Tradicional'
}
