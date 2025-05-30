import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteComponent } from './components/cliente/cliente.component';
import { TatuadorComponent } from './components/tatuador/tatuador.component';
import { SessaoComponent } from './components/sessao/sessao.component';

// Definição das rotas da aplicação
const routes: Routes = [
  { path: '', redirectTo: '/clientes', pathMatch: 'full' }, // Rota padrão redireciona para clientes
  { path: 'clientes', component: ClienteComponent, data: { titulo: 'Cadastro de Clientes' } },
  { path: 'tatuadores', component: TatuadorComponent, data: { titulo: 'Cadastro de Tatuadores' } },
  { path: 'sessoes', component: SessaoComponent, data: { titulo: 'Cadastro de Sessões' } },
  { path: '**', redirectTo: '/clientes' } // Rota wildcard para páginas não encontradas
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
