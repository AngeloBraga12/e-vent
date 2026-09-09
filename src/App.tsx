import { FormEvent, useMemo, useState } from 'react'

type Status = 'Planejado' | 'Confirmado' | 'Concluído'
type EventItem = {
  id: number
  title: string
  date: string
  location: string
  guests: number
  status: Status
}

const initialEvents: EventItem[] = [
  { id: 1, title: 'Workshop de Front-end', date: '2026-09-18', location: 'Guaratinguetá', guests: 42, status: 'Confirmado' },
  { id: 2, title: 'Encontro de Tecnologia', date: '2026-09-25', location: 'São José dos Campos', guests: 85, status: 'Planejado' },
  { id: 3, title: 'Fotografia e Conteúdo', date: '2026-10-03', location: 'Aparecida', guests: 28, status: 'Planejado' },
  { id: 4, title: 'Mostra de Projetos', date: '2026-08-22', location: 'Guaratinguetá', guests: 120, status: 'Concluído' },
]

const statusOptions: Array<'Todos' | Status> = ['Todos', 'Planejado', 'Confirmado', 'Concluído']

function App() {
  const [events, setEvents] = useState(initialEvents)
  const [filter, setFilter] = useState<(typeof statusOptions)[number]>('Todos')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', date: '', location: '', guests: '1' })

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

  function createEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!form.title.trim() || !form.date || !form.location.trim()) return

    setEvents((current) => [...current, {
      id: Date.now(),
      title: form.title.trim(),
      date: form.date,
      location: form.location.trim(),
      guests: Math.max(1, Number(form.guests) || 1),
      status: 'Planejado',
    }])
    setForm({ title: '', date: '', location: '', guests: '1' })
    setShowForm(false)
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
          <button className="primary-button" onClick={() => setShowForm(true)}>+ Novo evento</button>
        </header>

        <section className="stats" aria-label="Resumo">
          <article><span>Eventos</span><strong>{stats.total}</strong><small>Total cadastrado</small></article>
          <article><span>Confirmados</span><strong>{stats.confirmed}</strong><small>Prontos para acontecer</small></article>
          <article><span>Participantes</span><strong>{stats.guests}</strong><small>Capacidade planejada</small></article>
        </section>

        <section className="panel" id="eventos">
          <div className="panel-header">
            <div><h2>Eventos</h2><p className="muted">Filtre e encontre rapidamente o que precisa.</p></div>
            <label className="search"><span>Buscar</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Evento ou local" /></label>
          </div>
          <div className="filters" role="group" aria-label="Filtrar por status">
            {statusOptions.map((option) => <button key={option} className={filter === option ? 'filter active' : 'filter'} onClick={() => setFilter(option)}>{option}</button>)}
          </div>

          <div className="event-list">
            {filteredEvents.map((event) => (
              <article className="event-row" key={event.id}>
                <div className="date-box"><strong>{new Date(`${event.date}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit' })}</strong><span>{new Date(`${event.date}T12:00:00`).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}</span></div>
                <div className="event-main"><h3>{event.title}</h3><p>{event.location} · {event.guests} participantes</p></div>
                <span className={`status ${event.status.toLowerCase()}`}>{event.status}</span>
              </article>
            ))}
            {!filteredEvents.length && <p className="empty">Nenhum evento encontrado.</p>}
          </div>
        </section>

        <footer id="relatorios">E-vent · Projeto de estudo desenvolvido por Angelo Braga · React + TypeScript + Vite</footer>
      </section>

      {showForm && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.currentTarget === event.target && setShowForm(false)}>
        <form className="modal" onSubmit={createEvent}>
          <div className="modal-header"><div><p className="eyebrow">Novo registro</p><h2>Criar evento</h2></div><button type="button" className="close" onClick={() => setShowForm(false)} aria-label="Fechar">×</button></div>
          <label>Nome do evento<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
          <label>Data<input required type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></label>
          <label>Local<input required value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} /></label>
          <label>Participantes<input required min="1" type="number" value={form.guests} onChange={(event) => setForm({ ...form, guests: event.target.value })} /></label>
          <button className="primary-button" type="submit">Criar evento</button>
        </form>
      </div>}
    </main>
  )
}

export default App
