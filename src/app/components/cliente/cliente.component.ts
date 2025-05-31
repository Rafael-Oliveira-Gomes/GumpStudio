import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cliente, SexoEnum, ClienteFormData, ClienteResponse } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {
  formularioCliente!: FormGroup;
  carregando = false;
  clientes: ClienteResponse[] = [];  // ✅ Adicionado
  opcoesSexo = [
    { valor: SexoEnum.MASCULINO, descricao: 'Masculino' },
    { valor: SexoEnum.FEMININO, descricao: 'Feminino' },
    { valor: SexoEnum.OUTRO, descricao: 'Outro' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private clienteService: ClienteService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.criarFormulario();
    this.carregarClientes();  // ✅ Adicionado
  }

  /**
   * Cria e configura o formulário reativo com validações
   */
  private criarFormulario(): void {
    this.formularioCliente = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      nomeSocial: ['', [Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]],
      dataNascimento: ['', [Validators.required]],
      alergia: [false],
      observacao: ['', [Validators.maxLength(500)]],
      sexo: ['', [Validators.required]],
      clienteId: ['', [Validators.required]]  // ✅ Garanta que o campo do select esteja aqui
    });
  }

  /**
   * Carrega a lista de clientes da API
   */
private carregarClientes(): void {
this.clienteService.buscarClientes().subscribe({
  next: (resposta) => {
    console.log('Resposta bruta:', resposta);
    this.clientes = resposta.map((item: any) => item.cliente);
  },
  error: (erro) => {
    this.exibirMensagem(`Erro ao carregar clientes: ${erro.message}`, 'erro');
  }
});

}

  /**
   * Submete o formulário e cadastra o cliente
   */
  onSubmit(): void {
    if (this.formularioCliente.valid) {
      this.carregando = true;

      const dadosFormulario: ClienteFormData = this.formularioCliente.value;
      const cliente: Cliente = this.converterParaCliente(dadosFormulario);

      this.clienteService.cadastrarCliente(cliente).subscribe({
        next: (resposta) => {
          this.exibirMensagem('Cliente cadastrado com sucesso!', 'sucesso');
          this.resetarFormulario();
          this.carregando = false;
        },
        error: (erro) => {
          this.exibirMensagem(`Erro ao cadastrar cliente: ${erro.message}`, 'erro');
          this.carregando = false;
        }
      });
    } else {
      this.marcarCamposComoTocados();
      this.exibirMensagem('Por favor, preencha todos os campos obrigatórios corretamente', 'aviso');
    }
  }

  /**
   * Converte os dados do formulário para o modelo Cliente
   */
  private converterParaCliente(dadosFormulario: ClienteFormData): Cliente {
    return {
      nome: dadosFormulario.nome.trim(),
      nomeSocial: dadosFormulario.nomeSocial?.trim() || undefined,
      email: dadosFormulario.email.trim().toLowerCase(),
      telefone: dadosFormulario.telefone.trim(),
      dataNascimento: this.formatarDataParaISO(dadosFormulario.dataNascimento),
      alergia: dadosFormulario.alergia,
      observacao: dadosFormulario.observacao?.trim() || undefined,
      sexo: dadosFormulario.sexo as 'M' | 'F' | 'O'
    };
  }

  /**
   * Formata a data para o formato ISO (YYYY-MM-DD)
   */
  private formatarDataParaISO(data: Date): string {
    return data.toISOString().split('T')[0];
  }

  /**
   * Reseta o formulário para o estado inicial
   */
  resetarFormulario(): void {
    this.formularioCliente.reset();
    Object.keys(this.formularioCliente.controls).forEach(key => {
      this.formularioCliente.get(key)?.setErrors(null);
    });
  }

  /**
   * Marca todos os campos como tocados para exibir validações
   */
  private marcarCamposComoTocados(): void {
    Object.keys(this.formularioCliente.controls).forEach(campo => {
      this.formularioCliente.get(campo)?.markAsTouched();
    });
  }

  /**
   * Exibe mensagem para o usuário
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
   */
  obterMensagemErro(nomeCampo: string): string {
    const campo = this.formularioCliente.get(nomeCampo);

    if (campo?.hasError('required')) {
      return 'Este campo é obrigatório';
    }
    if (campo?.hasError('email')) {
      return 'Email inválido';
    }
    if (campo?.hasError('minlength')) {
      const minLength = campo.errors?.['minlength'].requiredLength;
      return `Mínimo de ${minLength} caracteres`;
    }
    if (campo?.hasError('maxlength')) {
      const maxLength = campo.errors?.['maxlength'].requiredLength;
      return `Máximo de ${maxLength} caracteres`;
    }
    if (campo?.hasError('pattern') && nomeCampo === 'telefone') {
      return 'Formato: (11) 99999-9999';
    }

    return '';
  }

  /**
   * Verifica se um campo possui erro e foi tocado
   */
  temErro(nomeCampo: string): boolean {
    const campo = this.formularioCliente.get(nomeCampo);
    return !!(campo?.invalid && (campo?.dirty || campo?.touched));
  }
}
