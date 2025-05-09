export interface Usuario {
  id: string;
  email: string;
  nome: string;
  cpf: string;
  data_nascimento: string | null;
  regional_id: number | null;
  divisao_id: number | null;
  perfil_nome: string;
  status: boolean;
  mensalidade_em_dia: boolean;
  avatar_url: string | null;
  numero_ficha: string | null;
}
