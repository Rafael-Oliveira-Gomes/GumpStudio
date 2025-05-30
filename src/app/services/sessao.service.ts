import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Sessao, SessaoRequest, SessaoResponse, SessaoCompleta } from '../models/sessao.model';
import { ClienteService } from './cliente.service';
import { TatuadorService } from './tatuador.service';

@Injectable({
  providedIn: 'root'
})
export class SessaoService {
  private readonly baseUrl = 'https://localhost:7186/api/v1/Sessao';
  private readonly urlTatuador = 'https://localhost:7186/api/v1/Tatuador';
  private readonly urlCliente = 'https://localhost:7186/api/v1/Cliente';

  constructor(
    private http: HttpClient,
    private clienteService: ClienteService,
    private tatuadorService: TatuadorService
  ) { }

  /**
   * Cadastra uma nova sessão no sistema
   * @param sessao - Dados da sessão a ser cadastrada
   * @returns Observable com a resposta do servidor
   */
  cadastrarSessao(sessao: Sessao): Observable<SessaoResponse> {
    const payload: SessaoRequest = { sessao };
    
    return this.http.post<SessaoResponse>(this.baseUrl, payload)
      .pipe(
        catchError(this.tratarErro)
      );
  }

  /**
   * Busca todas as sessões cadastradas
   * @returns Observable com lista de sessões
   */
  buscarSessoes(): Observable<SessaoResponse[]> {
    return this.http.get<SessaoResponse[]>(this.baseUrl)
      .pipe(
        catchError(this.tratarErro)
      );
  }

  /**
   * Busca todas as sessões com dados completos de cliente e tatuador
   * @returns Observable com lista de sessões completas
   */
buscarSessoesCompletas(): Observable<SessaoCompleta[]> {
  return this.buscarSessoes().pipe(
    mergeMap((sessoes: SessaoResponse[]) => {
      const sessoesCompletas$ = sessoes.map((sessao: SessaoResponse) => 
        forkJoin({
          cliente: this.clienteService.buscarClientePorId(sessao.clienteId),
          tatuador: this.tatuadorService.buscarTatuadorPorId(sessao.tatuadorId)
        }).pipe(
          map(({ cliente, tatuador }) => ({
            ...sessao,
            cliente,
            tatuador
          } as SessaoCompleta))
        )
      );
      return forkJoin(sessoesCompletas$);
    }),
    catchError(this.tratarErro)
  );
}



  /**
   * Busca uma sessão específica por ID
   * @param id - ID da sessão
   * @returns Observable com dados da sessão
   */
  buscarSessaoPorId(id: number): Observable<SessaoResponse> {
    return this.http.get<SessaoResponse>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError(this.tratarErro)
      );
  }

  /**
   * Busca sessões de um cliente específico
   * @param clienteId - ID do cliente
   * @returns Observable com lista de sessões do cliente
   */
  buscarSessoesPorCliente(clienteId: number): Observable<SessaoResponse[]> {
    return this.http.get<SessaoResponse[]>(`${this.urlCliente}/cliente/${clienteId}`)
      .pipe(
        catchError(this.tratarErro)
      );
  }

  /**
   * Busca sessões de um tatuador específico
   * @param tatuadorId - ID do tatuador
   * @returns Observable com lista de sessões do tatuador
   */
  buscarSessoesPorTatuador(tatuadorId: number): Observable<SessaoResponse[]> {
    return this.http.get<SessaoResponse[]>(`${this.urlTatuador}/tatuador/${tatuadorId}`)
      .pipe(
        catchError(this.tratarErro)
      );
  }

  /**
   * Atualiza os dados de uma sessão existente
   * @param id - ID da sessão
   * @param sessao - Novos dados da sessão
   * @returns Observable com a resposta do servidor
   */
  atualizarSessao(id: number, sessao: Sessao): Observable<SessaoResponse> {
    const payload: SessaoRequest = { sessao };
    
    return this.http.put<SessaoResponse>(`${this.baseUrl}/${id}`, payload)
      .pipe(
        catchError(this.tratarErro)
      );
  }

  /**
   * Atualiza apenas o status de uma sessão
   * @param id - ID da sessão
   * @param novoStatus - Novo status da sessão
   * @returns Observable com a resposta do servidor
   */
  atualizarStatusSessao(id: number, novoStatus: string): Observable<SessaoResponse> {
    return this.http.patch<SessaoResponse>(`${this.baseUrl}/${id}/status`, { status: novoStatus })
      .pipe(
        catchError(this.tratarErro)
      );
  }

  /**
   * Remove uma sessão do sistema
   * @param id - ID da sessão a ser removida
   * @returns Observable com confirmação da remoção
   */
  removerSessao(id: number): Observable<void> {
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
          mensagemErro = 'Sessão não encontrada';
          break;
        case 409:
          mensagemErro = 'Conflito: Horário já agendado';
          break;
        case 500:
          mensagemErro = 'Erro interno do servidor';
          break;
        default:
          mensagemErro = `Erro: ${erro.status} - ${erro.error?.message || erro.message}`;
      }
    }

    console.error('Erro no SessaoService:', erro);
    return throwError(() => new Error(mensagemErro));
  }
}
