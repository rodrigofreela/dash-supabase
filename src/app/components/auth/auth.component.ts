import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { FormsModule } from '@angular/forms'; // ✅ Importe aqui

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  standalone: true,
  imports: [FormsModule] // ✅ Adicione aqui
})
export class AuthComponent {
  email = '';
  password = '';
  cpf = '';
  nome = '';

  constructor(private supabase: SupabaseService, private router: Router) {}

  async login() {
    const { data, error } = await this.supabase.signIn(this.email, this.password);
    if (error) {
      alert('Erro no login: ' + error.message);
      return;
    }
    await this.router.navigateByUrl('/perfil');
  }

  async register() {
    const { error } = await this.supabase.signUp(this.email, this.password, this.cpf, this.nome);
    if (error) {
      alert('Erro no cadastro: ' + error.message);
      return;
    }
    await this.router.navigateByUrl('/perfil');
  }

  // async loginGoogle() {
  //   const { error } = await this.supabase.signInWithGoogle();
  //   if (!error) {
  //     await this.router.navigateByUrl('/perfil');
  //   }
  // }
}
