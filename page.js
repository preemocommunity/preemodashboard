'use client'

import { useState, useEffect } from 'react'

const PLATFORMS = ['YouTube', 'TikTok', 'Instagram', 'Facebook', 'X', 'LinkedIn', 'Spotify', 'Podcast', 'Other']

const PLATFORM_COLORS = {
  YouTube: '#FF0000',
  TikTok: '#69C9D0',
  Instagram: '#E1306C',
  Facebook: '#1877F2',
  X: '#000000',
  LinkedIn: '#0A66C2',
  Spotify: '#1DB954',
  Podcast: '#9B59B6',
  Other: '#C9A028',
}

const DEFAULT_DATA = {
  brands: [
    {
      id: 'bdb',
      name: 'Billion Dollar Balcony',
      emoji: '🏙️',
      channels: [
        { id: 'bdb-yt', platform: 'YouTube', handle: '@billiondollarbalcony', followers: 4540, updatedAt: '2026-04-12' },
        { id: 'bdb-tt', platform: 'TikTok', handle: '@billiondollarbalcony', followers: 10700, updatedAt: '2026-04-12' },
      ],
    },
    {
      id: 'mm',
      name: 'Meta Martin',
      emoji: '🤖',
      channels: [],
    },
    {
      id: 'md',
      name: 'Martin Dionne',
      emoji: '👤',
      channels: [],
    },
  ],
}

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toLocaleString()
}

function getTotals(brands) {
  const totalChannels = brands.reduce((a, b) => a + b.channels.length, 0)
  const totalFollowers = brands.reduce((a, b) => a + b.channels.reduce((x, c) => x + (c.followers || 0), 0), 0)
  const byPlatform = {}
  brands.forEach(b => b.channels.forEach(c => {
    byPlatform[c.platform] = (byPlatform[c.platform] || 0) + (c.followers || 0)
  }))
  return { totalChannels, totalFollowers, byPlatform }
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [view, setView] = useState('global')
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [selectedChannel, setSelectedChannel] = useState(null)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({})

  useEffect(() => {
    const saved = localStorage.getItem('premo-dashboard')
    setData(saved ? JSON.parse(saved) : DEFAULT_DATA)
  }, [])

  const save = (newData) => {
    setData(newData)
    localStorage.setItem('premo-dashboard', JSON.stringify(newData))
  }

  if (!data) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#07091A' }}>
      <span style={{ color: '#C9A028', fontFamily: 'Montserrat, sans-serif' }}>Loading...</span>
    </div>
  )

  const totals = getTotals(data.brands)
  const brand = data.brands.find(b => b.id === selectedBrand)
  const channel = brand?.channels.find(c => c.id === selectedChannel)

  // --- MODALS ---
  const openAddBrand = () => { setForm({ name: '', emoji: '🎬' }); setModal('add-brand') }
  const openAddChannel = () => { setForm({ platform: 'YouTube', handle: '', followers: '' }); setModal('add-channel') }
  const openEditChannel = (ch) => { setForm({ ...ch }); setModal('edit-channel') }

  const handleAddBrand = () => {
    if (!form.name.trim()) return
    const newBrand = { id: Date.now().toString(), name: form.name.trim(), emoji: form.emoji || '🎬', channels: [] }
    save({ ...data, brands: [...data.brands, newBrand] })
    setModal(null)
  }

  const handleAddChannel = () => {
    if (!form.handle.trim()) return
    const newChannel = {
      id: Date.now().toString(),
      platform: form.platform,
      handle: form.handle.trim(),
      followers: parseInt(form.followers) || 0,
      updatedAt: new Date().toISOString().split('T')[0],
    }
    const newBrands = data.brands.map(b =>
      b.id === selectedBrand ? { ...b, channels: [...b.channels, newChannel] } : b
    )
    save({ ...data, brands: newBrands })
    setModal(null)
  }

  const handleEditChannel = () => {
    const newBrands = data.brands.map(b =>
      b.id === selectedBrand
        ? { ...b, channels: b.channels.map(c => c.id === form.id ? { ...form, followers: parseInt(form.followers) || 0, updatedAt: new Date().toISOString().split('T')[0] } : c) }
        : b
    )
    save({ ...data, brands: newBrands })
    setModal(null)
  }

  const handleDeleteChannel = (brandId, channelId) => {
    const newBrands = data.brands.map(b =>
      b.id === brandId ? { ...b, channels: b.channels.filter(c => c.id !== channelId) } : b
    )
    save({ ...data, brands: newBrands })
    if (view === 'channel') { setView('brand') }
  }

  const handleDeleteBrand = (brandId) => {
    save({ ...data, brands: data.brands.filter(b => b.id !== brandId) })
    setView('global')
  }

  const s = styles

  return (
    <div style={s.root}>
      {/* HEADER */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={s.logo}>P</div>
            <div>
              <div style={s.logoTitle}>PRËMO INC.</div>
              <div style={s.logoSub}>Media Portfolio Dashboard</div>
            </div>
          </div>
          {/* Breadcrumb */}
          <nav style={s.breadcrumb}>
            <span style={{ ...s.breadcrumbItem, ...(view === 'global' ? s.breadcrumbActive : s.breadcrumbLink) }}
              onClick={() => { setView('global'); setSelectedBrand(null); setSelectedChannel(null) }}>
              Portfolio
            </span>
            {selectedBrand && (
              <>
                <span style={s.breadcrumbSep}>›</span>
                <span style={{ ...s.breadcrumbItem, ...(view === 'brand' ? s.breadcrumbActive : s.breadcrumbLink) }}
                  onClick={() => { setView('brand'); setSelectedChannel(null) }}>
                  {brand?.name}
                </span>
              </>
            )}
            {selectedChannel && (
              <>
                <span style={s.breadcrumbSep}>›</span>
                <span style={{ ...s.breadcrumbItem, ...s.breadcrumbActive }}>{channel?.handle}</span>
              </>
            )}
          </nav>
        </div>
      </header>

      <main style={s.main}>

        {/* ===== GLOBAL VIEW ===== */}
        {view === 'global' && (
          <>
            <div style={s.pageTitle}>
              <h1 style={s.h1}>Portfolio Overview</h1>
              <button style={s.btnGold} onClick={openAddBrand}>+ Add Brand</button>
            </div>

            {/* KPI Row */}
            <div style={s.kpiRow}>
              <div style={s.kpiCard}>
                <div style={s.kpiLabel}>Total Brands</div>
                <div style={s.kpiValue}>{data.brands.length}</div>
              </div>
              <div style={s.kpiCard}>
                <div style={s.kpiLabel}>Total Channels</div>
                <div style={s.kpiValue}>{totals.totalChannels}</div>
              </div>
              <div style={s.kpiCard}>
                <div style={s.kpiLabel}>Total Followers</div>
                <div style={{ ...s.kpiValue, color: '#C9A028' }}>{formatNumber(totals.totalFollowers)}</div>
              </div>
              <div style={s.kpiCard}>
                <div style={s.kpiLabel}>Active Platforms</div>
                <div style={s.kpiValue}>{Object.keys(totals.byPlatform).length}</div>
              </div>
            </div>

            {/* Platform Breakdown */}
            {Object.keys(totals.byPlatform).length > 0 && (
              <div style={s.section}>
                <h2 style={s.h2}>Followers by Platform</h2>
                <div style={s.platformGrid}>
                  {Object.entries(totals.byPlatform).sort((a,b) => b[1]-a[1]).map(([platform, count]) => (
                    <div key={platform} style={s.platformCard}>
                      <div style={{ ...s.platformDot, background: PLATFORM_COLORS[platform] || '#C9A028' }} />
                      <div style={s.platformName}>{platform}</div>
                      <div style={s.platformCount}>{formatNumber(count)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Brand Cards */}
            <div style={s.section}>
              <h2 style={s.h2}>Brands</h2>
              <div style={s.brandGrid}>
                {data.brands.map(b => {
                  const bf = b.channels.reduce((a, c) => a + (c.followers || 0), 0)
                  return (
                    <div key={b.id} style={s.brandCard} onClick={() => { setSelectedBrand(b.id); setView('brand') }}>
                      <div style={s.brandEmoji}>{b.emoji}</div>
                      <div style={s.brandName}>{b.name}</div>
                      <div style={s.brandMeta}>{b.channels.length} channel{b.channels.length !== 1 ? 's' : ''}</div>
                      <div style={s.brandFollowers}>{formatNumber(bf)}</div>
                      <div style={s.brandFollowersLabel}>total followers</div>
                      <div style={s.brandArrow}>→</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {/* ===== BRAND VIEW ===== */}
        {view === 'brand' && brand && (
          <>
            <div style={s.pageTitle}>
              <div>
                <div style={s.viewEmoji}>{brand.emoji}</div>
                <h1 style={s.h1}>{brand.name}</h1>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button style={s.btnGold} onClick={openAddChannel}>+ Add Channel</button>
                <button style={s.btnDanger} onClick={() => handleDeleteBrand(brand.id)}>Delete Brand</button>
              </div>
            </div>

            {/* Brand KPIs */}
            <div style={s.kpiRow}>
              <div style={s.kpiCard}>
                <div style={s.kpiLabel}>Channels</div>
                <div style={s.kpiValue}>{brand.channels.length}</div>
              </div>
              <div style={s.kpiCard}>
                <div style={s.kpiLabel}>Total Followers</div>
                <div style={{ ...s.kpiValue, color: '#C9A028' }}>
                  {formatNumber(brand.channels.reduce((a, c) => a + (c.followers || 0), 0))}
                </div>
              </div>
              <div style={s.kpiCard}>
                <div style={s.kpiLabel}>Platforms</div>
                <div style={s.kpiValue}>{[...new Set(brand.channels.map(c => c.platform))].length}</div>
              </div>
            </div>

            {/* Channel List */}
            <div style={s.section}>
              <h2 style={s.h2}>Channels</h2>
              {brand.channels.length === 0 ? (
                <div style={s.empty}>No channels yet. Add your first channel.</div>
              ) : (
                <div style={s.channelList}>
                  {brand.channels.sort((a,b) => (b.followers||0)-(a.followers||0)).map(ch => (
                    <div key={ch.id} style={s.channelRow}>
                      <div style={{ ...s.platformBadge, background: PLATFORM_COLORS[ch.platform] || '#C9A028' }}>
                        {ch.platform}
                      </div>
                      <div style={s.channelHandle}>{ch.handle}</div>
                      <div style={s.channelFollowers}>{formatNumber(ch.followers || 0)}</div>
                      <div style={s.channelUpdated}>Updated {ch.updatedAt}</div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button style={s.btnSmall} onClick={() => { openEditChannel(ch); setSelectedChannel(ch.id) }}>Edit</button>
                        <button style={s.btnSmallDanger} onClick={() => handleDeleteChannel(brand.id, ch.id)}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ===== CHANNEL VIEW (edit focused) ===== */}
        {view === 'channel' && channel && brand && (
          <>
            <div style={s.pageTitle}>
              <h1 style={s.h1}>{channel.handle}</h1>
              <button style={s.btnDanger} onClick={() => handleDeleteChannel(brand.id, channel.id)}>Delete Channel</button>
            </div>
            <div style={s.channelDetail}>
              <div style={s.detailRow}>
                <span style={s.detailLabel}>Platform</span>
                <span style={{ ...s.platformBadge, background: PLATFORM_COLORS[channel.platform] || '#C9A028' }}>{channel.platform}</span>
              </div>
              <div style={s.detailRow}>
                <span style={s.detailLabel}>Handle</span>
                <span style={s.detailValue}>{channel.handle}</span>
              </div>
              <div style={s.detailRow}>
                <span style={s.detailLabel}>Followers</span>
                <span style={{ ...s.detailValue, color: '#C9A028', fontSize: 28, fontWeight: 700 }}>{formatNumber(channel.followers || 0)}</span>
              </div>
              <div style={s.detailRow}>
                <span style={s.detailLabel}>Last Updated</span>
                <span style={s.detailValue}>{channel.updatedAt}</span>
              </div>
              <button style={{ ...s.btnGold, marginTop: 24 }} onClick={() => openEditChannel(channel)}>Update Follower Count</button>
            </div>
          </>
        )}
      </main>

      {/* ===== MODALS ===== */}
      {modal && (
        <div style={s.overlay} onClick={() => setModal(null)}>
          <div style={s.modalBox} onClick={e => e.stopPropagation()}>

            {modal === 'add-brand' && (
              <>
                <h3 style={s.modalTitle}>Add New Brand</h3>
                <label style={s.label}>Brand Name</label>
                <input style={s.input} value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Super Yacht Chef" />
                <label style={s.label}>Emoji</label>
                <input style={s.input} value={form.emoji} onChange={e => setForm({...form, emoji: e.target.value})} placeholder="🎬" maxLength={2} />
                <div style={s.modalActions}>
                  <button style={s.btnOutline} onClick={() => setModal(null)}>Cancel</button>
                  <button style={s.btnGold} onClick={handleAddBrand}>Add Brand</button>
                </div>
              </>
            )}

            {modal === 'add-channel' && (
              <>
                <h3 style={s.modalTitle}>Add Channel to {brand?.name}</h3>
                <label style={s.label}>Platform</label>
                <select style={s.input} value={form.platform} onChange={e => setForm({...form, platform: e.target.value})}>
                  {PLATFORMS.map(p => <option key={p}>{p}</option>)}
                </select>
                <label style={s.label}>Handle / Username</label>
                <input style={s.input} value={form.handle} onChange={e => setForm({...form, handle: e.target.value})} placeholder="@yourhandle" />
                <label style={s.label}>Current Follower Count</label>
                <input style={s.input} type="number" value={form.followers} onChange={e => setForm({...form, followers: e.target.value})} placeholder="0" />
                <div style={s.modalActions}>
                  <button style={s.btnOutline} onClick={() => setModal(null)}>Cancel</button>
                  <button style={s.btnGold} onClick={handleAddChannel}>Add Channel</button>
                </div>
              </>
            )}

            {modal === 'edit-channel' && (
              <>
                <h3 style={s.modalTitle}>Update {form.handle}</h3>
                <label style={s.label}>Platform</label>
                <select style={s.input} value={form.platform} onChange={e => setForm({...form, platform: e.target.value})}>
                  {PLATFORMS.map(p => <option key={p}>{p}</option>)}
                </select>
                <label style={s.label}>Handle / Username</label>
                <input style={s.input} value={form.handle} onChange={e => setForm({...form, handle: e.target.value})} />
                <label style={s.label}>Follower Count</label>
                <input style={s.input} type="number" value={form.followers} onChange={e => setForm({...form, followers: e.target.value})} />
                <div style={s.modalActions}>
                  <button style={s.btnOutline} onClick={() => setModal(null)}>Cancel</button>
                  <button style={s.btnGold} onClick={handleEditChannel}>Save Changes</button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  )
}

// ===== STYLES =====
const styles = {
  root: {
    minHeight: '100vh',
    background: '#07091A',
    color: '#E8EAF6',
    fontFamily: "'Montserrat', sans-serif",
  },
  header: {
    background: '#0D1028',
    borderBottom: '1px solid rgba(201,160,40,0.25)',
    padding: '0 32px',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  headerInner: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
  },
  logo: {
    width: 36,
    height: 36,
    background: '#C9A028',
    color: '#07091A',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: 18,
    letterSpacing: '-0.5px',
  },
  logoTitle: {
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: '0.15em',
    color: '#E8EAF6',
  },
  logoSub: {
    fontSize: 10,
    letterSpacing: '0.1em',
    color: '#7B82A8',
    textTransform: 'uppercase',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  breadcrumbItem: {
    fontSize: 13,
    letterSpacing: '0.02em',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: 6,
    transition: 'all 0.15s',
  },
  breadcrumbActive: {
    color: '#C9A028',
    fontWeight: 600,
    cursor: 'default',
  },
  breadcrumbLink: {
    color: '#7B82A8',
  },
  breadcrumbSep: {
    color: '#3A3F5C',
    fontSize: 16,
  },
  main: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '40px 32px',
  },
  pageTitle: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 16,
  },
  h1: {
    fontSize: 28,
    fontWeight: 700,
    color: '#E8EAF6',
    margin: 0,
    letterSpacing: '-0.5px',
  },
  h2: {
    fontSize: 14,
    fontWeight: 600,
    color: '#7B82A8',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    margin: '0 0 16px',
  },
  viewEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  kpiRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 16,
    marginBottom: 40,
  },
  kpiCard: {
    background: '#0D1028',
    border: '1px solid rgba(201,160,40,0.15)',
    borderRadius: 12,
    padding: '20px 24px',
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#7B82A8',
    marginBottom: 8,
  },
  kpiValue: {
    fontSize: 32,
    fontWeight: 700,
    color: '#E8EAF6',
    letterSpacing: '-1px',
  },
  section: {
    marginBottom: 40,
  },
  platformGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: 12,
  },
  platformCard: {
    background: '#0D1028',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 10,
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  platformDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
  },
  platformName: {
    fontSize: 13,
    color: '#A0A8C8',
    flex: 1,
  },
  platformCount: {
    fontSize: 14,
    fontWeight: 700,
    color: '#E8EAF6',
  },
  brandGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: 16,
  },
  brandCard: {
    background: '#0D1028',
    border: '1px solid rgba(201,160,40,0.15)',
    borderRadius: 14,
    padding: '24px',
    cursor: 'pointer',
    transition: 'border-color 0.15s',
    position: 'relative',
  },
  brandEmoji: {
    fontSize: 28,
    marginBottom: 10,
  },
  brandName: {
    fontSize: 16,
    fontWeight: 700,
    color: '#E8EAF6',
    marginBottom: 4,
  },
  brandMeta: {
    fontSize: 12,
    color: '#7B82A8',
    marginBottom: 16,
  },
  brandFollowers: {
    fontSize: 26,
    fontWeight: 700,
    color: '#C9A028',
    letterSpacing: '-0.5px',
  },
  brandFollowersLabel: {
    fontSize: 11,
    color: '#7B82A8',
    marginTop: 2,
  },
  brandArrow: {
    position: 'absolute',
    top: 20,
    right: 20,
    fontSize: 18,
    color: '#3A3F5C',
  },
  channelList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  channelRow: {
    background: '#0D1028',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 10,
    padding: '14px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    flexWrap: 'wrap',
  },
  platformBadge: {
    fontSize: 11,
    fontWeight: 700,
    color: '#fff',
    padding: '3px 10px',
    borderRadius: 20,
    letterSpacing: '0.05em',
  },
  channelHandle: {
    fontSize: 14,
    color: '#E8EAF6',
    flex: 1,
    fontWeight: 500,
  },
  channelFollowers: {
    fontSize: 18,
    fontWeight: 700,
    color: '#C9A028',
    minWidth: 70,
    textAlign: 'right',
  },
  channelUpdated: {
    fontSize: 11,
    color: '#4A5070',
  },
  channelDetail: {
    background: '#0D1028',
    border: '1px solid rgba(201,160,40,0.2)',
    borderRadius: 16,
    padding: 32,
    maxWidth: 540,
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#7B82A8',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 600,
    color: '#E8EAF6',
  },
  empty: {
    color: '#4A5070',
    fontSize: 14,
    padding: '40px 0',
    textAlign: 'center',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(4,5,15,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: 16,
  },
  modalBox: {
    background: '#0D1028',
    border: '1px solid rgba(201,160,40,0.3)',
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 420,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#E8EAF6',
    margin: '0 0 24px',
  },
  label: {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#7B82A8',
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    width: '100%',
    background: '#131529',
    border: '1px solid rgba(201,160,40,0.2)',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 14,
    color: '#E8EAF6',
    fontFamily: "'Montserrat', sans-serif",
    boxSizing: 'border-box',
    outline: 'none',
  },
  modalActions: {
    display: 'flex',
    gap: 10,
    marginTop: 28,
    justifyContent: 'flex-end',
  },
  btnGold: {
    background: '#C9A028',
    color: '#07091A',
    border: 'none',
    borderRadius: 8,
    padding: '10px 18px',
    fontSize: 13,
    fontWeight: 700,
    fontFamily: "'Montserrat', sans-serif",
    cursor: 'pointer',
    letterSpacing: '0.02em',
    whiteSpace: 'nowrap',
  },
  btnOutline: {
    background: 'transparent',
    color: '#7B82A8',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: '10px 18px',
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "'Montserrat', sans-serif",
    cursor: 'pointer',
  },
  btnDanger: {
    background: 'transparent',
    color: '#E24B4A',
    border: '1px solid rgba(226,75,74,0.3)',
    borderRadius: 8,
    padding: '10px 18px',
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "'Montserrat', sans-serif",
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  btnSmall: {
    background: 'rgba(201,160,40,0.1)',
    color: '#C9A028',
    border: '1px solid rgba(201,160,40,0.25)',
    borderRadius: 6,
    padding: '5px 12px',
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "'Montserrat', sans-serif",
    cursor: 'pointer',
  },
  btnSmallDanger: {
    background: 'rgba(226,75,74,0.08)',
    color: '#E24B4A',
    border: '1px solid rgba(226,75,74,0.2)',
    borderRadius: 6,
    padding: '5px 10px',
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "'Montserrat', sans-serif",
    cursor: 'pointer',
  },
}
