import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router'; // Adicionado Router para redirecionamento
import { SupabaseService } from '../services/supabase.service';
import { User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private supabase: SupabaseService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const user = await this.supabase.currentUser(); // ✅ Agora 'await' resolve a Promise

    if (!user) {
      this.router.navigateByUrl('/login');
      return false;
    }

    const { data } = await this.supabase.getUsuario(user.id);
    const perfilNome = data?.perfil_nome;

    if (perfilNome !== 'Administrador') {
      this.router.navigateByUrl('/perfil');
    }

    return perfilNome === 'Administrador';
  }
}
