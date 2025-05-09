import { Component, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class PerfilComponent implements OnInit {
  usuario: any;
  perfis: any[] = [];
  avatar: string = '';
  selectedPerfil: string = '';

  regionais: any[] = [];
  divisoes: any[] = [];

  selectedRegionalId: number | null = null;
  selectedDivisaoId: number | null = null;

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    const user = await this.supabase.currentUser();
    if (!user) return;

    const { data: usuarioData } = await this.supabase.getUsuario(user.id);
    this.usuario = usuarioData;

    // Carrega os dados principais
    const { data: perfisData } = await this.supabase.getPerfis();
    this.perfis = perfisData || [];

    this.avatar = this.usuario?.avatar_url || 'assets/avatar-default.png';

    // Carrega regionais
    const { data: regionaisData } = await this.supabase.getRegionais();
    this.regionais = regionaisData || [];

    // Carrega divisões se tiver regional selecionado
    if (this.usuario?.regional_id) {
      await this.filtrarDivisoes(this.usuario.regional_id);
      this.selectedRegionalId = this.usuario.regional_id;
      this.selectedDivisaoId = this.usuario.divisao_id;
    }
  }

  async selecionarPerfil(perfilNome: string) {
    const user = await this.supabase.currentUser();
    if (!user) return;

    const { error } = await this.supabase.updatePerfil(user.id, perfilNome);
    if (!error) {
      this.usuario.perfil_nome = perfilNome;
    }
  }

  async filtrarDivisoes(regionalId: number) {
    const { data, error } = await this.supabase.getDivisoesPorRegional(regionalId);
    if (data) {
      this.divisoes = data;
    }
  }

  async salvarDadosAdicionais() {
    const user = await this.supabase.currentUser();
    if (!user) return;

    const { error } = await this.supabase.supabase
      .from('usuarios')
      .update({
        regional_id: this.selectedRegionalId,
        divisao_id: this.selectedDivisaoId
      })
      .eq('id', user.id);

    if (!error) {
      this.usuario.regional_id = this.selectedRegionalId;
      this.usuario.divisao_id = this.selectedDivisaoId;
      alert('Dados salvos com sucesso!');
    } else {
      alert('Erro ao salvar os dados.');
    }
  }

  async uploadAvatar(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const user = await this.supabase.currentUser();
    if (!user) return;

    this.avatar = await this.supabase.uploadAvatar(user.id, file);
  }
}
