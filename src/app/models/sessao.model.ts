import { Cliente } from './cliente.model';
import { Tatuador } from './tatuador.model';

// Interface para o modelo de Sessão de Tatuagem
export interface Sessao {
  id?: number;
  clienteId: number;
  tatuadorId: number;
  dataAgendamento: string; // Data e hora da sessão
  duracao: number; // Duração em horas
  descricaoTatuagem: string;
  localizacaoCorpo: string; // Onde será feita a tatuagem
  preco: number;
  status: StatusSessaoEnum;
  observacoes?: string | undefined;  // explicitamente aceitar undefined
  cuidadosPos?: string | undefined;  // explicitamente aceitar undefined
}

// Interface expandida com dados do cliente e tatuador
export interface SessaoCompleta extends Sessao {
  cliente?: Cliente;
  tatuador?: Tatuador;
}

// Interface para requisição de criação de sessão
export interface SessaoRequest {
  sessao: Sessao;
}

// Interface para resposta do servidor
export interface SessaoResponse extends Sessao {
  id: number;
  dataCriacao?: string;
  dataAtualizacao?: string;
}

// Interface para dados do formulário
export interface SessaoFormData {
  clienteId: number;
  tatuadorId: number;
  dataAgendamento: Date;
  duracao: number;
  descricaoTatuagem: string;
  localizacaoCorpo: string;
  preco: number;
  status: StatusSessaoEnum;  // Melhor usar o enum aqui
  observacoes?: string | undefined;  // opcional no form também
  cuidadosPos?: string | undefined;  // opcional no form também
}

// Enum para status da sessão
export enum StatusSessaoEnum {
  AGENDADA = 'Agendada',
  EM_ANDAMENTO = 'Em Andamento',
  CONCLUIDA = 'Concluída',
  CANCELADA = 'Cancelada',
  REAGENDADA = 'Reagendada'
}

// Enum para localizações do corpo
export enum LocalizacaoCorpoEnum {
  BRACO_DIREITO = 'Braço Direito',
  BRACO_ESQUERDO = 'Braço Esquerdo',
  ANTEBRACO_DIREITO = 'Antebraço Direito',
  ANTEBRACO_ESQUERDO = 'Antebraço Esquerdo',
  PERNA_DIREITA = 'Perna Direita',
  PERNA_ESQUERDA = 'Perna Esquerda',
  COSTAS = 'Costas',
  PEITO = 'Peito',
  ABDOMEN = 'Abdômen',
  PESCOCO = 'Pescoço',
  MAO_DIREITA = 'Mão Direita',
  MAO_ESQUERDA = 'Mão Esquerda',
  PE_DIREITO = 'Pé Direito',
  PE_ESQUERDO = 'Pé Esquerdo',
  OUTRO = 'Outro'
}
