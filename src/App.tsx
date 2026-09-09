import { FormEvent, useEffect, useMemo, useState } from 'react'

type Status = 'Planejado' | 'Confirmado' | 'Concluído'
type EventItem = {
  id: number
  title: string
  date: string
  location: string
  guests: number
  status: Status
}

type EventForm = Omit<EventItem, 'id' | 'status'>

const initialEvents: EventItem[] = [
  { id: 1, title: 'Workshop de Front-end', date: '2026-09-18', location: 'Guaratinguetá', guests: 42, status: 'Confirmado' },
  { id: 2, title: 'Encontro de Tecnologia', date: '2026-09-25', location: 'São José dos Campos', guests: 85, status: 'Planejado' },
  { id: 3, title: 'Fotografia e Conteúdo', date: '2026-10-03', location: 'Aparecida', guests: 28, status: 'Planejado' },
  { id: 4, title: 'Mostra de Projetos', date: '2026-08-22', location: 'Guaratinguetá', guests: 120, status: 'Concluído' },
]

const statusOptions: Array<'Todos' | Status> = ['Todos', 'Planejado', 'Confirmado', 'Concluído']
const storageKey = 'e-vent-events'
const emptyForm: EventForm = { title: '', date: '', location: '', guests: 1 }

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')
}

function App() {
  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      return saved ? JSON.parse(saved) as EventItem[] : initialEvents
    } catch {
      return initialEvents
    }
  })
  const [filter, setFilter] = useState<(typeof statusOptions)[number]>('Todos')
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<EventForm>(emptyForm)

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(events))
  }, [events])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setEditingId(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filteredEvents = useMemo(() => events.filter((event) => {
    const matchesStatus = filter === 'Todos' || event.status === filter
    const query = search.toLowerCase().trim()
    const matchesSearch = !query || `${event.title} ${event.location}`.toLowerCase().includes(query)
    return matchesStatus && matchesSearch
  }), [events, filter, search])

  const stats = useMemo(() => ({
    total: events.length,
    confirmed: events.filter((event) => event.status === 'Confirmado').length,
    guests: events.reduce((sum, event) => sum + event.guests, 0),
  }), [events])

  function openCreate() {
    setForm(emptyForm)
    setEditingId(0)
  }

  function openEdit(event: EventItem) {
    setForm({ title: event.title, date: event.date, location: event.location, guests: event.guests })
    setEditingId(event.id)
  }

  function saveEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!form.title.trim() || !form.date || !form.location.trim() || form.guests < 1) return

    if (editingId && editingId !== 0) {
      setEvents((current) => current.map((item) => item.id === editingId ? { ...item, ...form, title: form.title.trim(), location: form.location.trim() } : item))
    } else {
      setEvents((current) => [...current, {
        id: Date.now(),
        title: form.title.trim(),
        date: form.date,
        location: form.location.trim(),
        guests: form.guests,
        status: 'Planejado',
      }])
    }
    setEditingId(null)
  }

  function removeEvent(id: number) {
    if (window.confirm('Excluir este evento?')) setEvents((current) => current.filter((event) => event.id !== id))
  }

  function cycleStatus(event: EventItem) {
    const nextStatus: Record<Status, Status> = { Planejado: 'Confirmado', Confirmado: 'Concluído', Concluído: 'Planejado' }
    setEvents((current) => current.map((item) => item.id === event.id ? { ...item, status: nextStatus[item.status] } : item))
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span>E</span><strong>E-vent</strong></div>
        <nav aria-label="Navegação principal">
          <a className="nav-link active" href="#dashboard">Dashboard</a>
          <a className="nav-link" href="#eventos">Eventos</a>
          <a className="nav-link" href="#relatorios">Relatórios</a>
        </nav>
        <div className="sidebar-note">
          <small>Projeto front-end</small>
          <p>Interface responsiva para organizar eventos e acompanhar indicadores.</p>
        </div>
      </aside>

      <section className="content" id="dashboard">
        <header className="topbar">
          <div>
            <p className="eyebrow">Painel de eventos</p>
            <h1>Olá, Angelo.</h1>
            <p className="muted">Acompanhe sua agenda e mantenha cada evento sob controle.</p>
          </div>
          <button className="primary-button" onClick={openCreate}>+ Novo evento</button>
        </header>

        <section className="stats" aria-label="Resumo">
          <article><span>Eventos</span><strong>{stats.total}</strong><small>Total cadastrado</small></article>
          <article><span>Confirmados</span><strong>{stats.confirmed}</strong><small>Prontos para acontecer</small></article>
          <article><span>Participantes</span><strong>{stats.guests}</strong><small>Capacidade planejada</small></article>
        </section>

        <section className="panel" id="eventos">
          <div className="panel-header">
            <div><h2>Eventos</h2><p className="muted">Filtre, edite e encontre rapidamente o que precisa.</p></div>
            <label className="search"><span>Buscar</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Evento ou local" /></label>
          </div>
          <div className="filters" role="group" aria-label="Filtrar por status">
            {statusOptions.map((option) => <button key={option} type="button" className={filter === option ? 'filter active' : 'filter'} aria-pressed={filter === option} onClick={() => setFilter(option)}>{option}</button>)}
          </div>

          <div className="event-list">
            {filteredEvents.map((event) => (
              <article className="event-row" key={event.id}>
                <div className="date-box"><strong>{formatDate(event.date).split(' ')[0]}</strong><span>{formatDate(event.date).split(' ')[1]}</span></div>
                <div className="event-main"><h3>{event.title}</h3><p>{event.location} · {event.guests} participantes</p></div>
                <div className="event-actions">
                  <button className="status-button" type="button" onClick={() => cycleStatus(event)} title="Avançar status"><span className={`status ${event.status.toLowerCase()}`}>{event.status}</span></button>
                  <button className="text-button" type="button" onClick={() => openEdit(event)}>Editar</button>
                  <button className="text-button danger" type="button" onClick={() => removeEvent(event.id)}>Excluir</button>
                </div>
              </article>
            ))}
            {!filteredEvents.length && <div className="empty"><strong>Nenhum evento encontrado.</strong><p>Tente outro termo ou limpe os filtros.</p></div>}
          </div>
        </section>

        <footer id="relatorios">E-vent · Projeto de estudo desenvolvido por Angelo Braga · React + TypeScript + Vite</footer>
      </section>

      {editingId !== null && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.currentTarget === event.target && setEditingId(null)}>
        <form className="modal" onSubmit={saveEvent}>
          <div className="modal-header"><div><p className="eyebrow">{editingId === 0 ? 'Novo registro' : 'Atualização'}</p><h2>{editingId === 0 ? 'Criar evento' : 'Editar evento'}</h2></div><button type="button" className="close" onClick={() => setEditingId(null)} aria-label="Fechar">×</button></div>
          <label>Nome do evento<input required autoFocus value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
          <label>Data<input required type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></label>
          <label>Local<input required value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} /></label>
          <label>Participantes<input required min="1" type="number" value={form.guests} onChange={(event) => setForm({ ...form, guests: Number(event.target.value) })} /></label>
          <button className="primary-button" type="submit">{editingId === 0 ? 'Criar evento' : 'Salvar alterações'}</button>
        </form>
      </div>}
    </main>
  )
}

export default App
