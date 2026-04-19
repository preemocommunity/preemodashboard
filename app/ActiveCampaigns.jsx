// ActiveCampaigns.jsx
// Drop this into the Media Dashboard under any brand/creator detail page
// Shows campaigns from Supabase filtered by creator_name or brand_name
// Clicking a campaign card links to Campaign Dashboard with ?campaign_id=<uuid>

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const B = {
  navy:"#0A1628", midBlue:"#2B5C8A", lightBlue:"#4A90D9",
  skyBlue:"#E8F4FD", ice:"#F0F6FC", white:"#FFFFFF",
  border:"rgba(74,144,217,0.18)", shadow:"0 2px 12px rgba(10,22,40,0.06)",
  shadowHover:"0 8px 28px rgba(10,22,40,0.12)", text:"#0D1B2A",
  textMuted:"#5A7080", textLight:"#8899AA",
  green:"#1B7A3D", greenBg:"#E6F4EA",
  amber:"#B86E00", amberBg:"#FFF3E0",
};

const CAMPAIGN_DASHBOARD_URL = "https://campaigndashboard.vercel.app";

const STATUS_DISPLAY = {
  open_rfp:    { label:"Open RFP",     bg:"#E8F4FD", color:"#2B5C8A" },
  in_progress: { label:"In Progress",  bg:B.amberBg, color:B.amber },
  completed:   { label:"Completed",    bg:B.greenBg, color:B.green },
  draft:       { label:"Draft",        bg:B.ice,     color:B.textLight },
};

function fmt(v) {
  if (!v && v !== 0) return "—";
  if (v >= 1000) return (v/1000).toFixed(1) + "K";
  return v.toString();
}

// ── CAMPAIGN CARD ──
function CampaignCard({ campaign }) {
  const [hovered, setHovered] = useState(false);
  const s = STATUS_DISPLAY[campaign.status] || STATUS_DISPLAY.draft;
  const dashUrl = `${CAMPAIGN_DASHBOARD_URL}/?campaign_id=${campaign.id}`;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#f8fcff" : B.white,
        border: `1px solid ${hovered ? B.lightBlue : B.border}`,
        borderRadius: 12,
        padding: "18px 20px",
        boxShadow: hovered ? B.shadowHover : B.shadow,
        transform: hovered ? "translateY(-2px)" : "none",
        transition: "all 0.2s",
        cursor: "default",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: B.textLight, marginBottom: 4 }}>
            {campaign.brand_name}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: B.text, lineHeight: 1.35 }}>
            {campaign.title}
          </div>
        </div>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", padding: "3px 8px", borderRadius: 6, background: s.bg, color: s.color, flexShrink: 0, marginLeft: 10 }}>
          {s.label}
        </span>
      </div>

      {/* Delivery progress */}
      {campaign.deliverables > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: B.textLight }}>{campaign.deliverables} deliverables</span>
            {campaign.location && <span style={{ fontSize: 10, color: B.textLight }}>{campaign.location}</span>}
          </div>
          <div style={{ height: 3, background: B.skyBlue, borderRadius: 2 }}>
            <div style={{ height: "100%", width: campaign.status === "completed" ? "100%" : campaign.status === "in_progress" ? "60%" : "0%", background: `linear-gradient(90deg, ${B.lightBlue}, #6BB5FF)`, borderRadius: 2 }} />
          </div>
        </div>
      )}

      {/* Platform tags */}
      {campaign.platforms && campaign.platforms.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 12 }}>
          {campaign.platforms.map(p => (
            <span key={p} style={{ fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 5, background: B.skyBlue, color: B.midBlue }}>{p}</span>
          ))}
        </div>
      )}

      {/* Budget + CTA */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          {campaign.budget_min > 0 && (
            <div style={{ fontSize: 12, fontWeight: 700, color: B.text }}>
              ${campaign.budget_min.toLocaleString()}{campaign.budget_max > campaign.budget_min ? `–$${campaign.budget_max.toLocaleString()}` : ""}
            </div>
          )}
        </div>
        {campaign.status === "completed" || campaign.status === "in_progress" ? (
          <a href={dashUrl} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 11, fontWeight: 700, color: B.lightBlue, textDecoration: "none", background: B.skyBlue, padding: "6px 14px", borderRadius: 8, border: `1px solid ${B.border}` }}>
            View Analytics →
          </a>
        ) : campaign.status === "open_rfp" ? (
          <span style={{ fontSize: 11, fontWeight: 600, color: B.textMuted }}>Accepting creators</span>
        ) : null}
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ──
// Props:
//   creatorName: string — filter by campaign.creator_name
//   brandName: string — filter by campaign.brand_name
//   title: string — section heading (default: "Active Campaigns")
export default function ActiveCampaigns({ creatorName, brandName, title = "Active Campaigns" }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let query = supabase.from("campaigns").select("*").order("created_at", { ascending: false });

    if (creatorName) query = query.ilike("creator_name", `%${creatorName}%`);
    if (brandName)   query = query.ilike("brand_name",   `%${brandName}%`);

    query.then(({ data, error }) => {
      setLoading(false);
      if (!error && data) setCampaigns(data);
    });
  }, [creatorName, brandName]);

  if (loading) return (
    <div style={{ padding: "20px 0" }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: B.textLight }}>Loading campaigns...</div>
    </div>
  );

  if (campaigns.length === 0) return null;

  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: B.textLight, marginBottom: 4 }}>{title}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: B.text }}>{campaigns.length} Campaign{campaigns.length !== 1 ? "s" : ""}</div>
        </div>
        <a href={CAMPAIGN_DASHBOARD_URL} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 11, fontWeight: 600, color: B.lightBlue, textDecoration: "none" }}>
          View All →
        </a>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {campaigns.map(c => <CampaignCard key={c.id} campaign={c} />)}
      </div>
    </div>
  );
}

// ── HOW TO USE IN MEDIA DASHBOARD ──
// In the brand/creator detail page, after the Channels section, add:
//
// import ActiveCampaigns from "./ActiveCampaigns";
//
// For a creator page (Martin Dionne):
// <ActiveCampaigns creatorName="Martin Dionne" title="Active Campaigns" />
//
// For a brand page (Ayook):
// <ActiveCampaigns brandName="Ayook" title="Campaign History" />
