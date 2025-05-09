import { Injectable } from '@angular/core';
import { createClient, User } from '@supabase/supabase-js';
import { environment } from '../environments/environment';
import { Usuario } from '../components/usuarios/usuario.model';
@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase = createClient(
    environment.SUPABASE_URL,
    environment.SUPABASE_ANON_KEY
  );

  // Autenticação
  async signIn(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({ email, password });
  }

  async signUp(email: string, password: string, cpf: string, nome: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: nome,
          cpf: cpf
        }
      }
    });

    if (data.user && !error) {
      await this.supabase.from('usuarios').insert({
        id: data.user.id,
        email,
        nome,
        cpf,
        data_nascimento: '2000-01-01',
        perfil_nome: 'Agente Promotor'
      });
    }

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

  async getRegionais() {
    const { data, error } = await this.supabase
      .from('regionais')
      .select('id, nome');

    return { data, error };
  }

  async getDivisoesPorRegional(regionalId: number) {
    const { data, error } = await this.supabase
      .from('divisoes')
      .select('id, nome')
      .eq('regional_id', regionalId);

    return { data, error };
  }

  async getPerfis() {
    const { data, error } = await this.supabase
      .from('perfis')
      .select('nome, grau');

    return { data, error };
  }

  async updatePerfil(userId: string, perfilNome: string) {
    const { error } = await this.supabase
      .from('usuarios')
      .update({ perfil_nome: perfilNome })
      .eq('id', userId);

    return { error };
  }

  async getUsuarios(): Promise<{ data: Usuario[] | null; error: any }> {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('*');

    return { data: data as Usuario[] | null, error };
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

  async getEventos() {
    const { data, error } = await this.supabase
      .from('eventos')
      .select('*');

    return { data, error };
  }

  async getParticipacoes(usuarioId: string) {
    const { data, error } = await this.supabase
      .from('participacoes')
      .select('*')
      .eq('usuario_id', usuarioId);

    return { data, error };
  }

  async registrarParticipacao(usuarioId: string, eventoId: number) {
    const { error } = await this.supabase
      .from('participacoes')
      .insert({
        usuario_id: usuarioId,
        evento_id: eventoId,
        participacao: 'presente'
      });

    return { error };
  }

  async updateDadosAdicionais(userId: string, regionalId: number | null, divisaoId: number | null) {
    const { error } = await this.supabase
      .from('usuarios')
      .update({
        regional_id: regionalId,
        divisao_id: divisaoId
      })
      .eq('id', userId);

    return { error };
  }
}
