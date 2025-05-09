import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

    const { data } = await this.supabase.getUsuario(user.id);
    this.usuario = data;

    const { data: perfis } = await this.supabase.getPerfis();
    this.perfis = perfis || [];

    this.avatar = this.usuario?.avatar_url || 'assets/avatar-default.png';

    const { data: regionais } = await this.supabase.getRegionais();
    this.regionais = regionais || [];

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

  async filtrarDivisoes(regionalId: number | null): Promise<void> {
    if (!regionalId) return;

    const { data, error } = await this.supabase.getDivisoesPorRegional(regionalId);
    if (data) {
      this.divisoes = data;
    }
  }

  async salvarDadosAdicionais() {
    const user = await this.supabase.currentUser();
    if (!user) return;

    const { error } = await this.supabase.updateDadosAdicionais(
      user.id,
      this.selectedRegionalId,
      this.selectedDivisaoId
    );

    if (!error) {
      this.usuario.regional_id = this.selectedRegionalId;
      this.usuario.divisao_id = this.selectedDivisaoId;
      alert('Dados atualizados!');
    } else {
      alert('Erro ao atualizar os dados.');
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
