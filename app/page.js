'use client'
import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const VISITOR_PASSWORD = 'premo2026'
const ADMIN_PASSWORD = 'premo-admin-2026'
const CAMPAIGN_DASHBOARD_URL = 'https://campaigndashboard-git-main-preemocommunitys-projects.vercel.app'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const BRAND = {
  navy: '#0A1628', blue: '#1E3A5F', midBlue: '#2B5C8A', lightBlue: '#4A90D9',
  accentBlue: '#6BB5FF', skyBlue: '#E8F4FD', ice: '#F0F6FC', white: '#FFFFFF',
  glass: 'rgba(255,255,255,0.72)', glassBorder: 'rgba(74,144,217,0.18)',
  glassHover: 'rgba(255,255,255,0.88)', shadow: '0 8px 32px rgba(10,22,40,0.08)',
  shadowHover: '0 12px 40px rgba(10,22,40,0.14)', text: '#1A2A3A',
  textMuted: '#5A7080', textLight: '#8899AA',
}

const PLATFORM_COLORS = {
  YouTube: '#FF0000', TikTok: '#000000', Instagram: '#E1306C',
  Facebook: '#1877F2', X: '#000000', LinkedIn: '#0A66C2',
  Spotify: '#1DB954', Podcast: '#9B59B6', Discord: '#5865F2', Other: '#4A90D9',
}

const PLATFORMS = ['YouTube','TikTok','Instagram','Facebook','X','LinkedIn','Spotify','Podcast','Discord','Other']
const EMOJIS = ['🏙️','🤖','👤','🎓','🎬','🎨','🏆','🌍','💡','🚀','⚡','🎯']

const inp = {
  width: '100%', background: '#F0F6FC', border: '1px solid rgba(74,144,217,0.25)',
  borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#1A2A3A',
  fontFamily: "'Montserrat', sans-serif", boxSizing: 'border-box', outline: 'none', marginBottom: 12
}
const lbl = {
  fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
  color: '#8899AA', marginBottom: 4, display: 'block'
}
const primaryBtn = {
  borderRadius: 10, border: 'none',
  background: 'linear-gradient(135deg, #0A1628 0%, #2B5C8A 100%)',
  color: '#fff', fontFamily: "'Montserrat', sans-serif", fontWeight: 700,
  fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 16px rgba(10,22,40,0.2)', padding: '10px 24px'
}
const ghostBtn = {
  borderRadius: 10, border: '1px solid rgba(74,144,217,0.18)', background: 'transparent',
  color: '#5A7080', fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
  fontSize: 13, cursor: 'pointer', padding: '10px 18px'
}
const dangerBtn = {
  borderRadius: 10, border: '1px solid rgba(226,75,74,0.3)',
  background: 'rgba(226,75,74,0.08)', color: '#E24B4A',
  fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
  fontSize: 13, cursor: 'pointer', padding: '10px 18px'
}

function formatNum(n) {
  if (!n) return '0'
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toLocaleString()
}

function LockScreen({ onVisitor, onAdmin }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)
  const attempt = () => {
    if (pw === VISITOR_PASSWORD) onVisitor()
    else if (pw === ADMIN_PASSWORD) onAdmin()
    else { setError(true); setPw(''); setTimeout(() => setError(false), 2000) }
  }
  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif", minHeight: '100vh', background: 'linear-gradient(165deg, #fff 0%, #F0F6FC 40%, #E8F4FD 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #0A1628 0%, #2B5C8A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20, fontWeight: 800, margin: '0 auto 20px' }}>P</div>
        <div style={{ fontSize: 10, letterSpacing: '2.5px', color: BRAND.textMuted, textTransform: 'uppercase', marginBottom: 8 }}>Prëmo Inc.</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: BRAND.navy, margin: '0 0 6px' }}>Media Portfolio Dashboard</h1>
        <p style={{ fontSize: 13, color: BRAND.textLight, margin: '0 0 36px' }}>Internal use — authorised access only</p>
        <div style={{ background: BRAND.glass, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(74,144,217,0.18)', borderRadius: 20, padding: 32, boxShadow: BRAND.shadow }}>
          <label style={{ ...lbl, textAlign: 'left' }}>Access Password</label>
          <input type="password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && attempt()} placeholder="Enter password" autoFocus style={{ ...inp, border: `1px solid ${error ? '#E24B4A' : 'rgba(74,144,217,0.25)'}` }} />
          {error && <p style={{ color: '#E24B4A', fontSize: 12, margin: '-8px 0 8px', textAlign: 'left' }}>Incorrect password.</p>}
          <button onClick={attempt} style={{ ...primaryBtn, width: '100%', padding: '13px 0', letterSpacing: '1px', textTransform: 'uppercase' }}>Enter Dashboard →</button>
        </div>
      </div>
    </div>
  )
}

function Modal({ onClose, children, maxWidth = 500 }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,22,40,0.45)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} onClick={onClose} />
      <div style={{ position: 'relative', background: BRAND.white, borderRadius: 20, padding: 36, maxWidth, width: '100%', boxShadow: '0 24px 80px rgba(10,22,40,0.2)', border: '1px solid rgba(74,144,217,0.18)', maxHeight: '90vh', overflowY: 'auto' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: BRAND.textLight }}>✕</button>
        {children}
      </div>
    </div>
  )
}

function BrandModal({ brand, onSave, onClose }) {
  const [form, setForm] = useState(brand ? { name: brand.name, emoji: brand.emoji } : { name: '', emoji: '🎬' })
  const [saving, setSaving] = useState(false)
  const handleSave = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    await onSave(form)
    setSaving(false)
    onClose()
  }
  return (
    <Modal onClose={onClose} maxWidth={440}>
      <div style={{ fontSize: 18, fontWeight: 700, color: BRAND.navy, marginBottom: 24 }}>{brand ? 'Edit Brand' : 'Add New Brand'}</div>
      <label style={lbl}>Brand Name</label>
      <input style={inp} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Super Yacht Chef" />
      <label style={lbl}>Emoji</label>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {EMOJIS.map(em => <button key={em} onClick={() => setForm({ ...form, emoji: em })} style={{ width: 40, height: 40, borderRadius: 10, border: `2px solid ${form.emoji === em ? BRAND.lightBlue : BRAND.glassBorder}`, background: form.emoji === em ? BRAND.skyBlue : 'transparent', fontSize: 18, cursor: 'pointer' }}>{em}</button>)}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onClose} style={ghostBtn}>Cancel</button>
        <button onClick={handleSave} disabled={saving} style={{ ...primaryBtn, flex: 1 }}>{saving ? 'Saving...' : 'Save Brand'}</button>
      </div>
    </Modal>
  )
}

function ChannelModal({ channel, brandId, onSave, onClose }) {
  const [form, setForm] = useState(channel ? { platform: channel.platform, handle: channel.handle, followers: channel.followers } : { platform: 'YouTube', handle: '', followers: '' })
  const [saving, setSaving] = useState(false)
  const handleSave = async () => {
    if (!form.handle.trim()) return
    setSaving(true)
    await onSave({ ...form, followers: parseInt(form.followers) || 0 }, brandId)
    setSaving(false)
    onClose()
  }
  return (
    <Modal onClose={onClose} maxWidth={440}>
      <div style={{ fontSize: 18, fontWeight: 700, color: BRAND.navy, marginBottom: 24 }}>{channel ? 'Edit Channel' : 'Add New Channel'}</div>
      <label style={lbl}>Platform</label>
      <select style={{ ...inp, cursor: 'pointer' }} value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}>
        {PLATFORMS.map(p => <option key={p}>{p}</option>)}
      </select>
      <label style={lbl}>Handle / Username</label>
      <input style={inp} value={form.handle} onChange={e => setForm({ ...form, handle: e.target.value })} placeholder="@yourhandle" />
      <label style={lbl}>Follower Count</label>
      <input style={inp} type="number" value={form.followers} onChange={e => setForm({ ...form, followers: e.target.value })} placeholder="0" />
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onClose} style={ghostBtn}>Cancel</button>
        <button onClick={handleSave} disabled={saving} style={{ ...primaryBtn, flex: 1 }}>{saving ? 'Saving...' : 'Save Channel'}</button>
      </div>
    </Modal>
  )
}

function KpiCard({ label, value, accent }) {
  return (
    <div style={{ background: BRAND.glass, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(74,144,217,0.18)', borderRadius: 16, padding: '20px 24px', boxShadow: BRAND.shadow }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: BRAND.textLight, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 800, color: accent ? BRAND.lightBlue : BRAND.navy, letterSpacing: '-1px' }}>{value}</div>
    </div>
  )
}

function BrandCard({ brand, channels, onClick, isAdmin, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false)
  const total = channels.reduce((a, c) => a + (c.followers || 0), 0)
  return (
    <div style={{ background: hovered ? BRAND.glassHover : BRAND.glass, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: `1px solid ${hovered ? BRAND.lightBlue : BRAND.glassBorder}`, borderRadius: 16, padding: 24, cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: hovered ? BRAND.shadowHover : BRAND.shadow, transform: hovered ? 'translateY(-3px)' : 'none', position: 'relative' }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={() => onClick(brand)}>
      <div style={{ fontSize: 32, marginBottom: 10 }}>{brand.emoji}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: BRAND.navy, marginBottom: 4 }}>{brand.name}</div>
      <div style={{ fontSize: 12, color: BRAND.textLight, marginBottom: 16 }}>{channels.length} channel{channels.length !== 1 ? 's' : ''}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: BRAND.lightBlue, letterSpacing: '-0.5px' }}>{formatNum(total)}</div>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: BRAND.textLight, marginTop: 2 }}>Total Followers</div>
      {isAdmin && hovered && (
        <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
          <button onClick={() => onEdit(brand)} style={{ background: BRAND.navy, color: '#fff', border: 'none', borderRadius: 6, padding: '4px 8px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}>✏️</button>
          <button onClick={() => onDelete(brand.id)} style={{ background: '#E24B4A', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 8px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}>✕</button>
        </div>
      )}
    </div>
  )
}

// ── ACTIVE CAMPAIGNS COMPONENT ────────────────────────────────
function ActiveCampaigns({ brandName }) {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!brandName) return
    supabase.from('campaigns')
      .select('*')
      .or(`brand_name.ilike.%${brandName}%,creator_name.ilike.%${brandName}%`)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setLoading(false); setCampaigns(data || []) })
  }, [brandName])

  if (loading || campaigns.length === 0) return null

  const statusMeta = {
    open_rfp:    { label: 'Open RFP',    bg: '#E8F4FD', color: '#2B5C8A' },
    in_progress: { label: 'In Progress', bg: '#FFF3E0', color: '#B86E00' },
    completed:   { label: 'Completed',   bg: '#E6F4EA', color: '#1B7A3D' },
    draft:       { label: 'Draft',       bg: '#F5F5F5', color: '#888' },
  }

  return (
    <div style={{ marginTop: 40 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: BRAND.textLight, marginBottom: 16 }}>Active Campaigns</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {campaigns.map(c => {
          const s = statusMeta[c.status] || statusMeta.draft
          return (
            <div key={c.id} style={{ background: BRAND.glass, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: `1px solid ${BRAND.glassBorder}`, borderRadius: 14, padding: '20px', boxShadow: BRAND.shadow }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.navy, lineHeight: 1.35, flex: 1 }}>{c.title}</div>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 6, background: s.bg, color: s.color, flexShrink: 0, marginLeft: 8 }}>{s.label}</span>
              </div>
              {c.deliverables > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 10, color: BRAND.textLight }}>{c.deliverables} deliverables</span>
                    {c.creator_name && <span style={{ fontSize: 10, color: BRAND.textLight }}>{c.creator_name}</span>}
                  </div>
                  <div style={{ height: 3, background: '#E8F4FD', borderRadius: 2 }}>
                    <div style={{ height: '100%', width: c.status === 'completed' ? '100%' : c.status === 'in_progress' ? '60%' : '10%', background: `linear-gradient(90deg, ${BRAND.lightBlue}, ${BRAND.accentBlue})`, borderRadius: 2 }} />
                  </div>
                </div>
              )}
              {(c.platforms || []).length > 0 && (
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
                  {c.platforms.map(p => <span key={p} style={{ fontSize: 9, fontWeight: 600, padding: '2px 7px', borderRadius: 5, background: '#E8F4FD', color: '#2B5C8A' }}>{p}</span>)}
                </div>
              )}
              {(c.status === 'completed' || c.status === 'in_progress') && (
                <a href={`${CAMPAIGN_DASHBOARD_URL}/?campaign_id=${c.id}`} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'center', fontSize: 12, fontWeight: 700, color: BRAND.lightBlue, background: '#E8F4FD', padding: '8px', borderRadius: 8, border: '1px solid rgba(74,144,217,0.18)', textDecoration: 'none' }}>
                  View Campaign Analytics →
                </a>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
// ── END ACTIVE CAMPAIGNS ──────────────────────────────────────

export default function Dashboard() {
  const [access, setAccess] = useState(null)
  const [brands, setBrands] = useState([])
  const [channels, setChannels] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('global')
  const [activeBrand, setActiveBrand] = useState(null)
  const [editBrand, setEditBrand] = useState(null)
  const [showAddBrand, setShowAddBrand] = useState(false)
  const [editChannel, setEditChannel] = useState(null)
  const [addChannelTo, setAddChannelTo] = useState(null)

  const isAdmin = access === 'admin'

  const load = async () => {
    setLoading(true)
    const [{ data: br }, { data: ch }] = await Promise.all([
      supabase.from('brands').select('*').order('order_index'),
      supabase.from('channels').select('*').order('order_index'),
    ])
    setBrands(br || [])
    setChannels(ch || [])
    setLoading(false)
  }

  useEffect(() => { if (access) load() }, [access])

  const saveBrand = async (form, id) => {
    id ? await supabase.from('brands').update(form).eq('id', id)
       : await supabase.from('brands').insert({ ...form, order_index: brands.length })
    await load()
  }

  const deleteBrand = async (id) => {
    if (!confirm('Delete this brand and all its channels?')) return
    await supabase.from('brands').delete().eq('id', id)
    if (activeBrand?.id === id) { setActiveBrand(null); setView('global') }
    await load()
  }

  const saveChannel = async (form, brandId, id) => {
    const payload = { ...form, updated_at: new Date().toISOString().split('T')[0] }
    id ? await supabase.from('channels').update(payload).eq('id', id)
       : await supabase.from('channels').insert({ ...payload, brand_id: brandId, order_index: channels.filter(c => c.brand_id === brandId).length })
    await load()
  }

  const deleteChannel = async (id) => {
    if (!confirm('Delete this channel?')) return
    await supabase.from('channels').delete().eq('id', id)
    await load()
  }

  const brand = brands.find(b => b.id === activeBrand?.id)
  const brandChannels = brand ? channels.filter(c => c.brand_id === brand.id) : []
  const totalFollowers = channels.reduce((a, c) => a + (c.followers || 0), 0)
  const byPlatform = channels.reduce((acc, c) => { acc[c.platform] = (acc[c.platform] || 0) + (c.followers || 0); return acc }, {})

  if (!access) return <LockScreen onVisitor={() => setAccess('visitor')} onAdmin={() => setAccess('admin')} />

  if (loading) return (
    <div style={{ fontFamily: "'Montserrat', sans-serif", minHeight: '100vh', background: 'linear-gradient(165deg, #fff 0%, #F0F6FC 40%, #E8F4FD 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #0A1628 0%, #2B5C8A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 800, margin: '0 auto 16px' }}>P</div>
        <div style={{ fontSize: 12, color: BRAND.textLight, letterSpacing: '2px', textTransform: 'uppercase' }}>Loading Dashboard...</div>
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif", minHeight: '100vh', background: 'linear-gradient(165deg, #fff 0%, #F0F6FC 40%, #E8F4FD 100%)', color: BRAND.text, position: 'relative' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } body { background: #F0F6FC; }`}</style>
      <div style={{ position: 'fixed', top: '-20%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,144,217,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-15%', left: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,58,95,0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: BRAND.glass, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(74,144,217,0.18)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #0A1628 0%, #2B5C8A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 800 }}>P</div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: BRAND.navy, letterSpacing: '1.5px' }}>PRËMO</div>
            <div style={{ fontSize: 10, color: BRAND.textMuted, letterSpacing: '2.5px', textTransform: 'uppercase' }}>Media Dashboard</div>
          </div>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span onClick={() => { setView('global'); setActiveBrand(null) }} style={{ fontSize: 13, fontWeight: view === 'global' ? 700 : 500, color: view === 'global' ? BRAND.lightBlue : BRAND.textMuted, cursor: 'pointer' }}>Portfolio</span>
          {brand && <><span style={{ color: BRAND.textLight, fontSize: 16 }}>›</span><span style={{ fontSize: 13, fontWeight: 700, color: BRAND.lightBlue }}>{brand.name}</span></>}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isAdmin && <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '5px 12px', borderRadius: 20, background: '#FFF3E0', color: '#B86E00' }}>Admin Mode</span>}
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '5px 12px', borderRadius: 20, background: BRAND.skyBlue, color: BRAND.midBlue }}>Internal</span>
        </div>
      </header>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* ── GLOBAL VIEW ── */}
        {view === 'global' && (
          <>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: BRAND.lightBlue, marginBottom: 8 }}>Portfolio Overview</div>
                <h1 style={{ fontSize: 32, fontWeight: 800, color: BRAND.navy, letterSpacing: '-0.5px' }}>Prëmo Inc.</h1>
                <p style={{ fontSize: 14, color: BRAND.textMuted, marginTop: 4 }}>Media properties across all brands and platforms</p>
              </div>
              {isAdmin && <button onClick={() => setShowAddBrand(true)} style={{ ...primaryBtn, padding: '10px 20px' }}>+ Add Brand</button>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 40 }}>
              <KpiCard label="Total Brands" value={brands.length} />
              <KpiCard label="Total Channels" value={channels.length} />
              <KpiCard label="Total Followers" value={formatNum(totalFollowers)} accent />
              <KpiCard label="Active Platforms" value={Object.keys(byPlatform).length} />
            </div>
            {Object.keys(byPlatform).length > 0 && (
              <div style={{ marginBottom: 40 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: BRAND.textLight, marginBottom: 16 }}>Followers by Platform</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                  {Object.entries(byPlatform).sort((a, b) => b[1] - a[1]).map(([platform, count]) => (
                    <div key={platform} style={{ background: BRAND.glass, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(74,144,217,0.18)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: BRAND.shadow }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: PLATFORM_COLORS[platform] || BRAND.lightBlue, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: BRAND.textMuted, flex: 1 }}>{platform}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: BRAND.navy }}>{formatNum(count)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: BRAND.textLight }}>Portfolio Scale</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: BRAND.lightBlue }}>{formatNum(totalFollowers)} total followers</span>
              </div>
              <div style={{ width: '100%', height: 4, borderRadius: 2, background: BRAND.ice }}>
                <div style={{ height: '100%', borderRadius: 2, background: `linear-gradient(90deg, ${BRAND.lightBlue} 0%, ${BRAND.accentBlue} 100%)`, width: brands.length > 0 ? '100%' : '0%', transition: 'width 0.6s ease' }} />
              </div>
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: BRAND.textLight, marginBottom: 16 }}>Brands</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {brands.map(b => (
                <BrandCard key={b.id} brand={b} channels={channels.filter(c => c.brand_id === b.id)} isAdmin={isAdmin} onClick={b => { setActiveBrand(b); setView('brand') }} onEdit={b => setEditBrand(b)} onDelete={deleteBrand} />
              ))}
            </div>
          </>
        )}

        {/* ── BRAND VIEW ── */}
        {view === 'brand' && brand && (
          <>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{brand.emoji}</div>
                <h1 style={{ fontSize: 32, fontWeight: 800, color: BRAND.navy, letterSpacing: '-0.5px' }}>{brand.name}</h1>
                <p style={{ fontSize: 14, color: BRAND.textMuted, marginTop: 4 }}>{brandChannels.length} channel{brandChannels.length !== 1 ? 's' : ''} · {formatNum(brandChannels.reduce((a, c) => a + (c.followers || 0), 0))} total followers</p>
              </div>
              {isAdmin && <button onClick={() => setAddChannelTo(brand)} style={{ ...primaryBtn, padding: '10px 20px' }}>+ Add Channel</button>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 40 }}>
              <KpiCard label="Channels" value={brandChannels.length} />
              <KpiCard label="Total Followers" value={formatNum(brandChannels.reduce((a, c) => a + (c.followers || 0), 0))} accent />
              <KpiCard label="Platforms" value={[...new Set(brandChannels.map(c => c.platform))].length} />
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: BRAND.textLight, marginBottom: 16 }}>Channels</div>
            {brandChannels.length === 0
              ? <div style={{ background: BRAND.glass, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(74,144,217,0.18)', borderRadius: 16, padding: '40px 24px', textAlign: 'center', color: BRAND.textLight, fontSize: 14 }}>No channels yet. {isAdmin ? 'Add your first channel.' : ''}</div>
              : <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {brandChannels.sort((a, b) => (b.followers || 0) - (a.followers || 0)).map(ch => (
                    <div key={ch.id} style={{ background: BRAND.glass, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(74,144,217,0.18)', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: BRAND.shadow, flexWrap: 'wrap' }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: PLATFORM_COLORS[ch.platform] || BRAND.lightBlue, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: BRAND.midBlue, background: BRAND.skyBlue, padding: '3px 10px', borderRadius: 20, letterSpacing: '0.5px' }}>{ch.platform}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: BRAND.navy, flex: 1 }}>{ch.handle}</span>
                      <span style={{ fontSize: 22, fontWeight: 800, color: BRAND.lightBlue, letterSpacing: '-0.5px' }}>{formatNum(ch.followers)}</span>
                      <span style={{ fontSize: 11, color: BRAND.textLight }}>Updated {ch.updated_at}</span>
                      {isAdmin && (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => setEditChannel(ch)} style={{ background: BRAND.skyBlue, color: BRAND.lightBlue, border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}>Edit</button>
                          <button onClick={() => deleteChannel(ch.id)} style={{ background: 'rgba(226,75,74,0.08)', color: '#E24B4A', border: '1px solid rgba(226,75,74,0.2)', borderRadius: 8, padding: '6px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}>✕</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
            }

            {/* ── ACTIVE CAMPAIGNS (added below channels) ── */}
            <ActiveCampaigns brandName={brand.name} />
          </>
        )}

      </div>

      <div style={{ textAlign: 'center', padding: '32px 24px', fontSize: 11, color: BRAND.textLight, letterSpacing: '1px' }}>PRËMO INC. · MEDIA PORTFOLIO · CANGGU, BALI · {new Date().getFullYear()}</div>

      {showAddBrand && <BrandModal brand={null} onSave={form => saveBrand(form, null)} onClose={() => setShowAddBrand(false)} />}
      {editBrand && <BrandModal brand={editBrand} onSave={form => saveBrand(form, editBrand.id)} onClose={() => setEditBrand(null)} />}
      {addChannelTo && <ChannelModal channel={null} brandId={addChannelTo.id} onSave={(form, bid) => saveChannel(form, bid, null)} onClose={() => setAddChannelTo(null)} />}
      {editChannel && <ChannelModal channel={editChannel} brandId={editChannel.brand_id} onSave={(form, bid) => saveChannel(form, bid, editChannel.id)} onClose={() => setEditChannel(null)} />}
    </div>
  )
}
