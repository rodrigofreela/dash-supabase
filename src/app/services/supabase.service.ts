import { Injectable } from '@angular/core';
import { createClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase = createClient(
    environment.SUPABASE_URL,
    environment.SUPABASE_ANON_KEY
  );

  async signIn(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({ email, password });
  }

  async signUp(email: string, password: string, cpf: string, nome: string): Promise<{ data: any; error: any }> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: { cpf, nome }
      }
    });

    if (data.user && !error) {
      // Insere dados adicionais na tabela personalizada
      await this.supabase.from('usuarios').insert({
        id: data.user.id,
        cpf,
        nome,
        perfil_nome: 'Agente Promotor',
        login_com_sistema_pre_selecionado: true
      });
    }

    return { data, error };
  }

  async getUsuarios() {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('*');

    return { data, error };
  }

  signOut() {
    return this.supabase.auth.signOut();
  }

  async currentUser(): Promise<User | null> {
    const { data, error } = await this.supabase.auth.getUser();
    return data?.user ?? null;
  }

  async getUsuario(id: string) {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  }

  async getPerfis() {
    const { data, error } = await this.supabase
      .from('perfis')
      .select('*');

    return { data, error };
  }

  async updatePerfil(userId: string, perfilNome: string) {
    const { error } = await this.supabase
      .from('usuarios')
      .update({ perfil_nome: perfilNome })
      .eq('id', userId);

    return { error };
  }

  async uploadAvatar(userId: string, file: File) {
    const filePath = `avatars/${userId}/${file.name}`;
    const { error: uploadError } = await this.supabase
      .storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // ✅ Corrigido: Acesse o publicUrl dentro de data
    const { data } = this.supabase
      .storage
      .from('avatars')
      .getPublicUrl(filePath);

    const publicUrl = data.publicUrl; // Agora sim!

    const { error: updateError } = await this.supabase
      .from('usuarios')
      .update({ avatar_url: publicUrl })
      .eq('id', userId);

    return publicUrl;
  }

  async getDivisoesAtivas() {
    const { data, error } = await this.supabase
      .from('divisoes_ativas')
      .select('divisao_id, divisao_nome, regional_id, regional_nome');

    return { data, error };
  }

  // Buscar regionais
async getRegionais() {
  const { data, error } = await this.supabase
    .from('regionais')
    .select('id, nome');

  return { data, error };
}

// Buscar divisões por regional
async getDivisoesPorRegional(regionalId: number) {
  const { data, error } = await this.supabase
    .from('divisoes')
    .select('id, nome')
    .eq('regional_id', regionalId);

  return { data, error };
}

  setPerfilSelecionado(perfil: string) {
    localStorage.setItem('perfil_selecionado', perfil);
  }

  getPerfilSelecionado(): string | null {
    return localStorage.getItem('perfil_selecionado');
  }

  signInWithGoogle() {
    return this.supabase.auth.signInWithOAuth({ provider: 'google' });
  }

}
