// Interface para o modelo de Cliente seguindo exatamente a estrutura do backend
export interface Cliente {
  nome: string;
  nomeSocial?: string | undefined; // Campo opcional
  email: string;
  telefone: string;
  dataNascimento: string; // Formato ISO date string (YYYY-MM-DD)
  alergia: boolean;
  observacao?: string | undefined; // Campo opcional
  sexo: 'M' | 'F' | 'O'; // M = Masculino, F = Feminino, O = Outro
}

// Interface para o payload de requisição do cliente (conforme especificado no backend)
export interface ClienteRequest {
  cliente: Cliente;
}

// Interface para resposta do servidor (incluindo ID após criação)
export interface ClienteResponse extends Cliente {
  id: number | undefined;
  dataCriacao?: string | undefined;
  dataAtualizacao?: string | undefined;
  nome: string;
  nomeSocial?: string | undefined;
}

// Enum para as opções de sexo
export enum SexoEnum {
  MASCULINO = 'M',
  FEMININO = 'F',
  OUTRO = 'O'
}

// Interface para dados do formulário (pode incluir campos adicionais para validação)
export interface ClienteFormData {
  nome: string;
  nomeSocial?: string | undefined; // Ajustado para opcional
  email: string;
  telefone: string;
  dataNascimento: Date;
  alergia: boolean;
  observacao?: string | undefined; // Ajustado para opcional
  sexo: 'M' | 'F' | 'O'; // Tipagem mais restrita conforme enum
}
