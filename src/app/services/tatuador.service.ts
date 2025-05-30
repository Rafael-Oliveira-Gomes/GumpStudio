import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Tatuador, TatuadorRequest, TatuadorResponse } from '../models/tatuador.model';

@Injectable({
  providedIn: 'root'
})
export class TatuadorService {
  private readonly baseUrl = 'https://localhost:7186/api/v1/Tatuador';

  constructor(private http: HttpClient) { }

  /**
   * Cadastra um novo tatuador no sistema
   * @param tatuador - Dados do tatuador a ser cadastrado
   * @returns Observable com a resposta do servidor
   */
  cadastrarTatuador(tatuador: Tatuador): Observable<TatuadorResponse> {
    const payload: TatuadorRequest = { tatuador };
    
    return this.http.post<TatuadorResponse>(this.baseUrl, payload)
      .pipe(
        catchError(this.tratarErro)
      );
  }

  /**
   * Busca todos os tatuadores cadastrados
   * @returns Observable com lista de tatuadores
   */
  buscarTatuadores(): Observable<TatuadorResponse[]> {
    return this.http.get<TatuadorResponse[]>(this.baseUrl)
      .pipe(
        catchError(this.tratarErro)
      );
  }

  /**
   * Busca apenas tatuadores ativos
   * @returns Observable com lista de tatuadores ativos
   */
  buscarTatuadoresAtivos(): Observable<TatuadorResponse[]> {
    return this.http.get<TatuadorResponse[]>(`${this.baseUrl}/ativos`)
      .pipe(
        catchError(this.tratarErro)
      );
  }

  /**
   * Busca um tatuador específico por ID
   * @param id - ID do tatuador
   * @returns Observable com dados do tatuador
   */
  buscarTatuadorPorId(id: number): Observable<TatuadorResponse> {
    return this.http.get<TatuadorResponse>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError(this.tratarErro)
      );
  }

  /**
   * Atualiza os dados de um tatuador existente
   * @param id - ID do tatuador
   * @param tatuador - Novos dados do tatuador
   * @returns Observable com a resposta do servidor
   */
  atualizarTatuador(id: number, tatuador: Tatuador): Observable<TatuadorResponse> {
    const payload: TatuadorRequest = { tatuador };
    
    return this.http.put<TatuadorResponse>(`${this.baseUrl}/${id}`, payload)
      .pipe(
        catchError(this.tratarErro)
      );
  }

  /**
   * Remove um tatuador do sistema
   * @param id - ID do tatuador a ser removido
   * @returns Observable com confirmação da remoção
   */
  removerTatuador(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError(this.tratarErro)
      );
  }

  /**
   * Ativa ou desativa um tatuador
   * @param id - ID do tatuador
   * @param ativo - Status ativo (true/false)
   * @returns Observable com a resposta do servidor
   */
  alterarStatusTatuador(id: number, ativo: boolean): Observable<TatuadorResponse> {
    return this.http.patch<TatuadorResponse>(`${this.baseUrl}/${id}/status`, { ativo })
      .pipe(
        catchError(this.tratarErro)
      );
  }

  /**
   * Trata erros das requisições HTTP
   * @param erro - Erro retornado pela requisição
   * @returns Observable com erro tratado
   */
  private tratarErro(erro: HttpErrorResponse): Observable<never> {
    let mensagemErro = 'Ocorreu um erro inesperado';

    if (erro.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      mensagemErro = `Erro: ${erro.error.message}`;
    } else {
      // Erro do lado do servidor
      switch (erro.status) {
        case 400:
          mensagemErro = 'Dados inválidos fornecidos';
          break;
        case 404:
          mensagemErro = 'Tatuador não encontrado';
          break;
        case 409:
          mensagemErro = 'Conflito: Tatuador já existe';
          break;
        case 500:
          mensagemErro = 'Erro interno do servidor';
          break;
        default:
          mensagemErro = `Erro: ${erro.status} - ${erro.error?.message || erro.message}`;
      }
    }

    console.error('Erro no TatuadorService:', erro);
    return throwError(() => new Error(mensagemErro));
  }
}
