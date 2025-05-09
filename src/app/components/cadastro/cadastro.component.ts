import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class CadastroComponent implements OnInit {
  email = '';
  password = '';
  cpf = '';
  nome = '';
  numeroFicha = '';
  perfis: any[] = [];

  constructor(private supabase: SupabaseService, private router: Router) {}

  ngOnInit() {
    this.perfis = [
      { nome: 'Administrador', grau: 'V' },
      { nome: 'Gestor Fomento', grau: 'VI' },
      { nome: 'Agente Promotor Adm', grau: 'VIII' },
      { nome: 'Agente Promotor', grau: 'IX' }
    ];
  }

  async register() {
    const { error } = await this.supabase.signUp(this.email, this.password, this.cpf, this.nome, this.numeroFicha);
    if (!error) {
      await this.router.navigateByUrl('/perfil');
    } else {
      alert('Erro no cadastro: ' + error.message);
    }
  }
}
