import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Tatuador, EspecialidadeEnum, TatuadorFormData } from '../../models/tatuador.model';
import { TatuadorService } from '../../services/tatuador.service';

@Component({
  selector: 'app-tatuador',
  templateUrl: './tatuador.component.html',
  styleUrls: ['./tatuador.component.scss']
})
export class TatuadorComponent implements OnInit {
  formularioTatuador!: FormGroup;
  carregando = false;
  
  // Opções para especialidades
  especialidades = Object.values(EspecialidadeEnum);

  constructor(
    private formBuilder: FormBuilder,
    private tatuadorService: TatuadorService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.criarFormulario();
  }

  /**
   * Cria e configura o formulário reativo com validações
   */
  private criarFormulario(): void {
    this.formularioTatuador = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      nomeSocial: ['', [Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]],
      dataNascimento: ['', [Validators.required]],
      especialidade: ['', [Validators.required]],
      experiencia: [0, [Validators.required, Validators.min(0), Validators.max(50)]],
      portfolio: ['', [Validators.maxLength(500)]],
      ativo: [true],
      observacao: ['', [Validators.maxLength(500)]]
    });
  }

  /**
   * Submete o formulário e cadastra o tatuador
   */
  onSubmit(): void {
    if (this.formularioTatuador.valid) {
      this.carregando = true;
      
      const dadosFormulario: TatuadorFormData = this.formularioTatuador.value;
      const tatuador: Tatuador = this.converterParaTatuador(dadosFormulario);

      this.tatuadorService.cadastrarTatuador(tatuador).subscribe({
        next: (resposta) => {
          this.exibirMensagem('Tatuador cadastrado com sucesso!', 'sucesso');
          this.resetarFormulario();
          this.carregando = false;
        },
        error: (erro) => {
          this.exibirMensagem(`Erro ao cadastrar tatuador: ${erro.message}`, 'erro');
          this.carregando = false;
        }
      });
    } else {
      this.marcarCamposComoTocados();
      this.exibirMensagem('Por favor, preencha todos os campos obrigatórios corretamente', 'aviso');
    }
  }

  /**
   * Converte os dados do formulário para o modelo Tatuador
   * @param dadosFormulario - Dados do formulário
   * @returns Objeto Tatuador formatado
   */
  private converterParaTatuador(dadosFormulario: TatuadorFormData): Tatuador {
    return {
      nome: dadosFormulario.nome.trim(),
      nomeSocial: dadosFormulario.nomeSocial?.trim() || undefined,
      email: dadosFormulario.email.trim().toLowerCase(),
      telefone: dadosFormulario.telefone.trim(),
      dataNascimento: this.formatarDataParaISO(dadosFormulario.dataNascimento),
      especialidade: dadosFormulario.especialidade,
      experiencia: dadosFormulario.experiencia,
      portfolio: dadosFormulario.portfolio?.trim() || undefined,
      ativo: dadosFormulario.ativo,
      observacao: dadosFormulario.observacao?.trim() || undefined
    };
  }

  /**
   * Formata a data para o formato ISO (YYYY-MM-DD)
   * @param data - Data do formulário
   * @returns String no formato ISO
   */
  private formatarDataParaISO(data: Date): string {
    return data.toISOString().split('T')[0];
  }

  /**
   * Reseta o formulário para o estado inicial
   */
  resetarFormulario(): void {
    this.formularioTatuador.reset();
    // Redefine valores padrão
    this.formularioTatuador.patchValue({
      ativo: true,
      experiencia: 0
    });
    Object.keys(this.formularioTatuador.controls).forEach(key => {
      this.formularioTatuador.get(key)?.setErrors(null);
    });
  }

  /**
   * Marca todos os campos como tocados para exibir validações
   */
  private marcarCamposComoTocados(): void {
    Object.keys(this.formularioTatuador.controls).forEach(campo => {
      this.formularioTatuador.get(campo)?.markAsTouched();
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
    const campo = this.formularioTatuador.get(nomeCampo);
    
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
    const campo = this.formularioTatuador.get(nomeCampo);
    return !!(campo?.invalid && (campo?.dirty || campo?.touched));
  }
}
