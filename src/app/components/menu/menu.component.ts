import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router'; // ✅ Importe aqui
import { SupabaseService } from '../../services/supabase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class MenuComponent implements OnInit {
  perfil: string = 'Convidado';
  menus: { label: string; link: string }[] = [];

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    const user = await this.supabase.currentUser();
    if (!user) return;

    const { data } = await this.supabase.getUsuario(user.id);
    this.perfil = data?.perfil_nome || 'Convidado';
    this.menus = this.getMenusPorPerfil(this.perfil);
  }

  getMenusPorPerfil(perfil: string): any[] {
    switch (perfil) {
      case 'Administrador':
        return [
          { label: 'Dashboard', link: '/dashboard' },
          { label: 'Usuários', link: '/usuarios' },
          { label: 'Eventos', link: '/eventos' }
        ];
      case 'Agente Promotor':
        return [
          { label: 'Home', link: '/' },
          { label: 'Eventos', link: '/eventos' }
        ];
      default:
        return [{ label: 'Home', link: '/' }];
    }
  }
}
