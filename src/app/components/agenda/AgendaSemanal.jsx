import React, { useState, useMemo } from 'react'
import './AgendaSemanal.scss'

const AgendaSemanal = ({ tatuadores, sessoes }) => {
  const [tatuadorSelecionado, setTatuadorSelecionado] = useState(tatuadores[0]?.id || null)
  const [semanaAtual, setSemanaAtual] = useState(new Date())

  // Calcular os dias da semana
  const diasSemana = useMemo(() => {
    const inicio = new Date(semanaAtual)
    const diaAtual = inicio.getDay()
    const diferenca = diaAtual === 0 ? 6 : diaAtual - 1 // Segunda-feira como primeiro dia
    inicio.setDate(inicio.getDate() - diferenca)
    
    const dias = []
    for (let i = 0; i < 7; i++) {
      const dia = new Date(inicio)
      dia.setDate(inicio.getDate() + i)
      dias.push(dia)
    }
    return dias
  }, [semanaAtual])

  // Filtrar sessões do tatuador selecionado na semana atual
  const sessoesTatuador = useMemo(() => {
    if (!tatuadorSelecionado) return []
    
    return sessoes.filter(sessao => {
      const dataSessao = new Date(sessao.dataAgendamento)
      const tatuadorCorreto = sessao.tatuadorId === tatuadorSelecionado
      const naSemana = diasSemana.some(dia => 
        dia.toDateString() === dataSessao.toDateString()
      )
      return tatuadorCorreto && naSemana
    })
  }, [sessoes, tatuadorSelecionado, diasSemana])

  // Agrupar sessões por dia
  const sessoesPorDia = useMemo(() => {
    const grupos = {}
    diasSemana.forEach(dia => {
      grupos[dia.toDateString()] = []
    })
    
    sessoesTatuador.forEach(sessao => {
      const dataSessao = new Date(sessao.dataAgendamento)
      const chave = dataSessao.toDateString()
      if (grupos[chave]) {
        grupos[chave].push(sessao)
      }
    })
    
    // Ordenar sessões por horário
    Object.keys(grupos).forEach(dia => {
      grupos[dia].sort((a, b) => 
        new Date(a.dataAgendamento) - new Date(b.dataAgendamento)
      )
    })
    
    return grupos
  }, [sessoesTatuador, diasSemana])

  const formatarData = (data) => {
    return data.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit'
    })
  }

  const formatarHora = (dataHora) => {
    return new Date(dataHora).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  const obterNomeCliente = (clienteId) => {
    // Como não temos acesso direto aos clientes aqui, vamos simular
    const nomes = {
      1: 'Rafael Gomes',
      2: 'Maria Silva',
      3: 'João Santos'
    }
    return nomes[clienteId] || `Cliente ${clienteId}`
  }

  const navegarSemana = (direcao) => {
    const novaSemana = new Date(semanaAtual)
    novaSemana.setDate(novaSemana.getDate() + (direcao * 7))
    setSemanaAtual(novaSemana)
  }

  const irParaHoje = () => {
    setSemanaAtual(new Date())
  }

  const obterStatusColor = (status) => {
    const cores = {
      'Agendada': 'var(--cor-info)',
      'Em Andamento': 'var(--cor-aviso)',
      'Concluída': 'var(--cor-sucesso)',
      'Cancelada': 'var(--cor-erro)',
      'Reagendada': 'var(--cor-info)'
    }
    return cores[status] || 'var(--cor-cinza-claro)'
  }

  const tatuadorAtual = tatuadores.find(t => t.id === tatuadorSelecionado)

  return (
    <div className="agenda-semanal fade-in">
      <div className="agenda-header">
        <div className="header-info">
          <h1>Agenda Semanal</h1>
          <p>Visualize a agenda dos tatuadores por semana</p>
        </div>
        
        <div className="agenda-controls">
          <select
            value={tatuadorSelecionado || ''}
            onChange={(e) => setTatuadorSelecionado(Number(e.target.value))}
            className="form-select"
          >
            <option value="">Selecione um tatuador</option>
            {tatuadores.filter(t => t.ativo).map(tatuador => (
              <option key={tatuador.id} value={tatuador.id}>
                {tatuador.nomeSocial || tatuador.nome} - {tatuador.especialidade}
              </option>
            ))}
          </select>
          
          <button onClick={irParaHoje} className="btn btn-secondary">
            Hoje
          </button>
        </div>
      </div>

      {tatuadorAtual && (
        <div className="tatuador-info-card">
          <div className="tatuador-avatar-grande">
            <span>{tatuadorAtual.nome.charAt(0)}</span>
          </div>
          <div className="tatuador-detalhes">
            <h3>{tatuadorAtual.nomeSocial || tatuadorAtual.nome}</h3>
            <p className="especialidade">{tatuadorAtual.especialidade}</p>
            <div className="tatuador-stats">
              <span className="stat">
                <strong>{tatuadorAtual.experiencia}</strong> anos de experiência
              </span>
              <span className="stat">
                <strong>★ {tatuadorAtual.avaliacaoMedia}</strong> avaliação
              </span>
              <span className="stat">
                <strong>{sessoesTatuador.length}</strong> sessões esta semana
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="semana-navegacao">
        <button onClick={() => navegarSemana(-1)} className="btn btn-secondary">
          ← Semana Anterior
        </button>
        
        <div className="semana-info">
          <h3>
            {diasSemana[0]?.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} 
            {' - '}
            {diasSemana[6]?.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </h3>
        </div>
        
        <button onClick={() => navegarSemana(1)} className="btn btn-secondary">
          Próxima Semana →
        </button>
      </div>

      <div className="agenda-grid">
        {diasSemana.map((dia, index) => {
          const isHoje = dia.toDateString() === new Date().toDateString()
          const sessoesDoDia = sessoesPorDia[dia.toDateString()] || []
          
          return (
            <div key={index} className={`dia-coluna ${isHoje ? 'hoje' : ''}`}>
              <div className="dia-header">
                <div className="dia-nome">
                  {dia.toLocaleDateString('pt-BR', { weekday: 'long' })}
                </div>
                <div className="dia-numero">
                  {dia.getDate()}
                </div>
                {isHoje && <div className="hoje-indicator">Hoje</div>}
              </div>
              
              <div className="dia-conteudo">
                {sessoesDoDia.length > 0 ? (
                  sessoesDoDia.map(sessao => (
                    <div 
                      key={sessao.id} 
                      className="sessao-card"
                      style={{ borderLeftColor: obterStatusColor(sessao.status) }}
                    >
                      <div className="sessao-header">
                        <span className="sessao-hora">
                          {formatarHora(sessao.dataAgendamento)}
                        </span>
                        <span className={`sessao-status badge badge-${sessao.status.toLowerCase().replace(' ', '-')}`}>
                          {sessao.status}
                        </span>
                      </div>
                      
                      <div className="sessao-cliente">
                        {obterNomeCliente(sessao.clienteId)}
                      </div>
                      
                      <div className="sessao-detalhes">
                        <div className="sessao-local">
                          📍 {sessao.localizacaoCorpo}
                        </div>
                        <div className="sessao-duracao">
                          ⏱️ {sessao.duracao}h
                        </div>
                        <div className="sessao-preco">
                          💰 {formatarMoeda(sessao.preco)}
                        </div>
                      </div>
                      
                      <div className="sessao-descricao">
                        {sessao.descricaoTatuagem}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="dia-vazio">
                    <span>Sem agendamentos</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {!tatuadorSelecionado && (
        <div className="selecionar-tatuador">
          <div className="empty-state">
            <h3>Selecione um tatuador</h3>
            <p>Escolha um tatuador acima para visualizar sua agenda semanal</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AgendaSemanal