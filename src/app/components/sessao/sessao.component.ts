import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { 
  Sessao, 
  StatusSessaoEnum, 
  LocalizacaoCorpoEnum, 
  SessaoFormData 
} from '../../models/sessao.model';
import { ClienteResponse } from '../../models/cliente.model';
import { TatuadorResponse } from '../../models/tatuador.model';
import { SessaoService } from '../../services/sessao.service';
import { ClienteService } from '../../services/cliente.service';
import { TatuadorService } from '../../services/tatuador.service';

@Component({
  selector: 'app-sessao',
  templateUrl: './sessao.component.html',
  styleUrls: ['./sessao.component.scss']
})
export class SessaoComponent implements OnInit {
  formularioSessao!: FormGroup;
  carregando = false;
  carregandoDados = true;
  
  // Listas para os selects
  clientes: ClienteResponse[] = [];
  tatuadores: TatuadorResponse[] = [];
  
  // Opções para os selects
  statusSessao = Object.values(StatusSessaoEnum);
  localizacoesCorpo = Object.values(LocalizacaoCorpoEnum);

  constructor(
    private formBuilder: FormBuilder,
    private sessaoService: SessaoService,
    private clienteService: ClienteService,
    private tatuadorService: TatuadorService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.criarFormulario();
    this.carregarDadosIniciais();
  }

  /**
   * Cria e configura o formulário reativo com validações
   */
  private criarFormulario(): void {
    this.formularioSessao = this.formBuilder.group({
      clienteId: ['', [Validators.required]],
      tatuadorId: ['', [Validators.required]],
      dataAgendamento: ['', [Validators.required]],
      duracao: [1, [Validators.required, Validators.min(0.5), Validators.max(12)]],
      descricaoTatuagem: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      localizacaoCorpo: ['', [Validators.required]],
      preco: [0, [Validators.required, Validators.min(0)]],
      status: [StatusSessaoEnum.AGENDADA, [Validators.required]],
      observacoes: ['', [Validators.maxLength(500)]],
      cuidadosPos: ['', [Validators.maxLength(500)]]
    });
  }

  /**
   * Carrega dados iniciais necessários para o formulário
   */
  private carregarDadosIniciais(): void {
    this.carregandoDados = true;
    
    // Carrega clientes e tatuadores simultaneamente
    forkJoin({
      clientes: this.clienteService.buscarClientes(),
      tatuadores: this.tatuadorService.buscarTatuadoresAtivos()
    }).subscribe({
      next: ({ clientes, tatuadores }) => {
        this.clientes = clientes;
        this.tatuadores = tatuadores;
        this.carregandoDados = false;
        
        if (this.clientes.length === 0 || this.tatuadores.length === 0) {
          this.exibirMensagem(
            'É necessário ter pelo menos um cliente e um tatuador cadastrados para criar sessões',
            'aviso'
          );
        }
      },
      error: (erro) => {
        this.exibirMensagem(`Erro ao carregar dados: ${erro.message}`, 'erro');
        this.carregandoDados = false;
      }
    });
  }

  /**
   * Submete o formulário e cadastra a sessão
   */
  onSubmit(): void {
    if (this.formularioSessao.valid) {
      this.carregando = true;
      
      const dadosFormulario: SessaoFormData = this.formularioSessao.value;
      const sessao: Sessao = this.converterParaSessao(dadosFormulario);

      this.sessaoService.cadastrarSessao(sessao).subscribe({
        next: (resposta) => {
          this.exibirMensagem('Sessão agendada com sucesso!', 'sucesso');
          this.resetarFormulario();
          this.carregando = false;
        },
        error: (erro) => {
          this.exibirMensagem(`Erro ao agendar sessão: ${erro.message}`, 'erro');
          this.carregando = false;
        }
      });
    } else {
      this.marcarCamposComoTocados();
      this.exibirMensagem('Por favor, preencha todos os campos obrigatórios corretamente', 'aviso');
    }
  }

  /**
   * Converte os dados do formulário para o modelo Sessao
   * @param dadosFormulario - Dados do formulário
   * @returns Objeto Sessao formatado
   */
  private converterParaSessao(dadosFormulario: SessaoFormData): Sessao {
    return {
      clienteId: Number(dadosFormulario.clienteId),
      tatuadorId: Number(dadosFormulario.tatuadorId),
      dataAgendamento: this.formatarDataHoraParaISO(dadosFormulario.dataAgendamento),
      duracao: Number(dadosFormulario.duracao),
      descricaoTatuagem: dadosFormulario.descricaoTatuagem.trim(),
      localizacaoCorpo: dadosFormulario.localizacaoCorpo,
      preco: Number(dadosFormulario.preco),
      status: dadosFormulario.status as StatusSessaoEnum,
      observacoes: dadosFormulario.observacoes?.trim() || undefined,
      cuidadosPos: dadosFormulario.cuidadosPos?.trim() || undefined
    };
  }

  /**
   * Formata a data e hora para o formato ISO
   * @param dataHora - Data e hora do formulário
   * @returns String no formato ISO
   */
  private formatarDataHoraParaISO(dataHora: Date): string {
    return dataHora.toISOString();
  }

  /**
   * Reseta o formulário para o estado inicial
   */
  resetarFormulario(): void {
    this.formularioSessao.reset();
    // Redefine valores padrão
    this.formularioSessao.patchValue({
      duracao: 1,
      preco: 0,
      status: StatusSessaoEnum.AGENDADA
    });
    Object.keys(this.formularioSessao.controls).forEach(key => {
      this.formularioSessao.get(key)?.setErrors(null);
    });
  }

  /**
   * Marca todos os campos como tocados para exibir validações
   */
  private marcarCamposComoTocados(): void {
    Object.keys(this.formularioSessao.controls).forEach(campo => {
      this.formularioSessao.get(campo)?.markAsTouched();
    });
  }

  /**
   * Exibe mensagem para o usuário
   * @param mensagem - Texto da mensagem
   * @param tipo - Tipo da mensagem (sucesso, erro, aviso)
   */
  private exibirMensagem(mensagem: string, tipo: 'sucesso' | 'erro' | 'aviso'): void {
    const config = {
      duration: 4000,
      panelClass: [`snackbar-${tipo}`]
    };
    
    this.snackBar.open(mensagem, 'Fechar', config);
  }

  /**
   * Obtém mensagem de erro para um campo específico
   * @param nomeCampo - Nome do campo do formulário
   * @returns Mensagem de erro ou string vazia
   */
  obterMensagemErro(nomeCampo: string): string {
    const campo = this.formularioSessao.get(nomeCampo);
    
    if (campo?.hasError('required')) {
      return 'Este campo é obrigatório';
    }
    if (campo?.hasError('minlength')) {
      const minLength = campo.errors?.['minlength'].requiredLength;
      return `Mínimo de ${minLength} caracteres`;
    }
    if (campo?.hasError('maxlength')) {
      const maxLength = campo.errors?.['maxlength'].requiredLength;
      return `Máximo de ${maxLength} caracteres`;
    }
    if (campo?.hasError('min')) {
      const min = campo.errors?.['min'].min;
      return `Valor mínimo: ${min}`;
    }
    if (campo?.hasError('max')) {
      const max = campo.errors?.['max'].max;
      return `Valor máximo: ${max}`;
    }
    
    return '';
  }

  /**
   * Verifica se um campo possui erro e foi tocado
   * @param nomeCampo - Nome do campo
   * @returns True se campo tem erro e foi tocado
   */
  temErro(nomeCampo: string): boolean {
    const campo = this.formularioSessao.get(nomeCampo);
    return !!(campo?.invalid && (campo?.dirty || campo?.touched));
  }

  /**
   * Obtém o nome do cliente selecionado
   * @param clienteId - ID do cliente
   * @returns Nome do cliente
   */
  obterNomeCliente(clienteId: number): string {
    const cliente = this.clientes.find(c => c.id === clienteId);
    return cliente ? `${cliente.nome} ${cliente.nomeSocial ? '(' + cliente.nomeSocial + ')' : ''}` : '';
  }

  /**
   * Obtém o nome do tatuador selecionado
   * @param tatuadorId - ID do tatuador
   * @returns Nome do tatuador
   */
  obterNomeTatuador(tatuadorId: number): string {
    const tatuador = this.tatuadores.find(t => t.id === tatuadorId);
    return tatuador ? `${tatuador.nome} ${tatuador.nomeSocial ? '(' + tatuador.nomeSocial + ')' : ''}` : '';
  }
}
