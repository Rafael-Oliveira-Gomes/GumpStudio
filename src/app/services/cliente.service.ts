import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Cliente, ClienteRequest, ClienteResponse } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private readonly baseUrl = 'https://localhost:7186/api/v1/Cliente';

  constructor(private http: HttpClient) { }

  /**
   * Cadastra um novo cliente no sistema
   * @param cliente - Dados do cliente a ser cadastrado
   * @returns Observable com a resposta do servidor
   */
  cadastrarCliente(cliente: Cliente): Observable<ClienteResponse> {
    const payload: ClienteRequest = { cliente };
    
    return this.http.post<ClienteResponse>(this.baseUrl, payload)
      .pipe(
        catchError(this.tratarErro)
      );
  }

  /**
   * Busca todos os clientes cadastrados
   * @returns Observable com lista de clientes
   */
  buscarClientes(): Observable<ClienteResponse[]> {
    return this.http.get<ClienteResponse[]>(this.baseUrl)
      .pipe(
        catchError(this.tratarErro)
      );
  }

  /**
   * Busca um cliente específico por ID
   * @param id - ID do cliente
   * @returns Observable com dados do cliente
   */
  buscarClientePorId(id: number): Observable<ClienteResponse> {
    return this.http.get<ClienteResponse>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError(this.tratarErro)
      );
  }

  /**
   * Atualiza os dados de um cliente existente
   * @param id - ID do cliente
   * @param cliente - Novos dados do cliente
   * @returns Observable com a resposta do servidor
   */
  atualizarCliente(id: number, cliente: Cliente): Observable<ClienteResponse> {
    const payload: ClienteRequest = { cliente };
    
    return this.http.put<ClienteResponse>(`${this.baseUrl}/${id}`, payload)
      .pipe(
        catchError(this.tratarErro)
      );
  }

  /**
   * Remove um cliente do sistema
   * @param id - ID do cliente a ser removido
   * @returns Observable com confirmação da remoção
   */
  removerCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`)
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
          mensagemErro = 'Cliente não encontrado';
          break;
        case 500:
          mensagemErro = 'Erro interno do servidor';
          break;
        default:
          mensagemErro = `Erro: ${erro.status} - ${erro.error?.message || erro.message}`;
      }
    }

    console.error('Erro no ClienteService:', erro);
    return throwError(() => new Error(mensagemErro));
  }
}
