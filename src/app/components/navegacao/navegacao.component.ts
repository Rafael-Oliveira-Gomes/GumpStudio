import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';


// Interface para definir os itens de navegação
interface ItemNavegacao {
  rota: string;
  titulo: string;
  icone: string;
  descricao: string;
}

@Component({
  selector: 'app-navegacao',
  templateUrl: './navegacao.component.html',
  styleUrls: ['./navegacao.component.scss']
})
export class NavegacaoComponent implements OnInit {
  rotaAtiva: string = '';

  // Itens do menu de navegação
  readonly itensNavegacao: ReadonlyArray<ItemNavegacao> = [
    {
      rota: '/clientes',
      titulo: 'Clientes',
      icone: 'person',
      descricao: 'Cadastro e gerenciamento de clientes'
    },
    {
      rota: '/tatuadores',
      titulo: 'Tatuadores',
      icone: 'brush',
      descricao: 'Cadastro e gerenciamento de tatuadores'
    },
    {
      rota: '/sessoes',
      titulo: 'Sessões',
      icone: 'event',
      descricao: 'Agendamento e controle de sessões'
    }
  ];

  constructor(private readonly router: Router) { }

  ngOnInit(): void {
    // Monitora mudanças de rota para atualizar item ativo
    this.router.events
      .pipe(filter((evento: Event): evento is NavigationEnd => evento instanceof NavigationEnd))
      .subscribe((evento: NavigationEnd) => {
        this.rotaAtiva = evento.url;
      });

    // Define rota ativa inicial
    this.rotaAtiva = this.router.url;
  }

  /**
   * Navega para uma rota específica
   * @param rota - Rota de destino
   */
  navegar(rota: string): void {
    this.router.navigate([rota]);
  }

  /**
   * Verifica se uma rota está ativa
   * @param rota - Rota a ser verificada
   * @returns True se a rota está ativa
   */
  estaAtiva(rota: string): boolean {
    return this.rotaAtiva === rota;
  }

  /**
   * Obtém a classe CSS para um item de navegação
   * @param rota - Rota do item
   * @returns String com classes CSS
   */
  obterClasseItem(rota: string): string {
    const classes: string[] = ['item-navegacao'];
    if (this.estaAtiva(rota)) {
      classes.push('ativo');
    }
    return classes.join(' ');
  }
}
