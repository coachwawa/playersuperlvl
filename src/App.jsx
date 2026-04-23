import { useState } from "react";

// ─── FONTS ───────────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600&display=swap";
document.head.appendChild(fontLink);

// ─── CONSTANTES ──────────────────────────────────────────────────────────────
const TERRAINS = [
  { id: 1, nom: "Terrain Bleu", adresse: "Nice Ouest", couleur: "#3B82F6" },
  { id: 2, nom: "Vauban", adresse: "Nice Est", couleur: "#FF6B35" },
  { id: 3, nom: "Terrain Patrick Pellicano", adresse: "Saint-Laurent-du-Var", couleur: "#00C2A8" },
  { id: 4, nom: "Ext. Gymnase André Carton", adresse: "Saint-Laurent-du-Var", couleur: "#FFB800" },
];

// 30 min entre tous les terrains, sauf les 2 terrains de SLdV entre eux : 10 min
const getTrajet = (a, b) => {
  if (a === b) return 0;
  if ((a === 3 && b === 4) || (a === 4 && b === 3)) return 10;
  return 30;
};

const HEURES = ["08:00","09:00","10:00","11:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"];
const toMin = h => { const [hh,mm]=h.split(":").map(Number); return hh*60+mm; };

const INIT_RESERVATIONS = [
  { id:1, date:"2026-04-23", heure:"09:00", terrainId:1, client:"Lucas Martin", statut:"confirmé" },
  { id:2, date:"2026-04-23", heure:"11:00", terrainId:2, client:"Sarah Kone", statut:"confirmé" },
  { id:3, date:"2026-04-24", heure:"15:00", terrainId:3, client:"Tom Rossi", statut:"confirmé" },
  { id:4, date:"2026-04-24", heure:"17:00", terrainId:4, client:"Amina Bel", statut:"confirmé" },
];

const INIT_JOUEURS = [
  { id:1, prenom:"Lucas", nom:"Martin", code:"lucas123", dateNaissance:"2008-03-12", taille:"178", envergure:"185", poste:"Meneur", club:"Cavigal Nice", niveau:"Régional", objectifs:"Améliorer le shoot à 3pts et la lecture du jeu", poids:"68", parentNom:"", parentPrenom:"", parentTel:"", bilan:"Légère tendinite rotule droite (2024). Pas de contre-indication sport." },
  { id:2, prenom:"Sarah", nom:"Kone", code:"sarah123", dateNaissance:"2005-07-22", taille:"165", envergure:"168", poste:"Arrière", club:"Monaco Basket", niveau:"National", objectifs:"Préparation physique intersaison", poids:"58", parentNom:"", parentPrenom:"", parentTel:"", bilan:"RAS. Bonne condition physique générale." },
];

const INIT_REPAS = [
  { id:1, joueurId:1, joueur:"Lucas Martin", date:"2026-04-21", repas:"Déjeuner", description:"Riz complet, poulet grillé, légumes vapeur", img:null, note:null, commentCoach:"", conseil:"" },
  { id:2, joueurId:2, joueur:"Sarah Kone", date:"2026-04-22", repas:"Petit-déjeuner", description:"Flocons d'avoine, fruits rouges, yaourt grec", img:null, note:4, commentCoach:"Très bon repas pré-entraînement !", conseil:"Pense à ajouter une source de protéines plus importante." },
];

const INIT_MESSAGES = [
  { id:1, joueurId:1, joueur:"Lucas Martin", auteur:"Lucas Martin", role:"joueur", texte:"Bonjour coach, est-ce qu'on peut travailler le crossover mardi ?", date:"2026-04-21 14:32" },
  { id:2, joueurId:1, joueur:"Lucas Martin", auteur:"Coach", role:"coach", texte:"Bien sûr Lucas ! Prépare aussi tes appuis, on fera un bloc complet.", date:"2026-04-21 15:10" },
];

const INIT_PROGRAMMES = [
  { id:1, joueurId:1, joueur:"Lucas Martin", titre:"Programme intersaison - Semaine 1", date:"2026-04-20", contenu:"Lundi: 30min cardio + tirs en suspension\nMercredi: Dribbles 1-contre-1 + finitions\nVendredi: Physique (gainage, pliométrie)", retour:"" },
];

const POSTES = ["Meneur","Arrière","Ailier","Ailier fort","Pivot"];
const NIVEAUX = ["Loisir","Départemental","Régional","National","Pro"];

function getDates(n=7) {
  return Array.from({length:n},(_,i)=>{const d=new Date();d.setDate(d.getDate()+i);return d.toISOString().split("T")[0];});
}
function fmtDate(s) {
  return new Date(s+"T00:00:00").toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"});
}
function age(dob) {
  const d=new Date(dob); const n=new Date();
  return Math.floor((n-d)/31557600000);
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const C = {
  orange:"#FF6B35", orangeLight:"#fff3ee", black:"#111",
  gray:"#f4f4f5", grayMid:"#e4e4e7", grayText:"#71717a",
  white:"#fff", green:"#00C2A8", red:"#ef4444", yellow:"#FFB800"
};

const s = {
  app:{ fontFamily:"'Barlow', sans-serif", background:"#fafafa", minHeight:"100vh", color:C.black },
  header:{ background:C.black, padding:"0 20px", position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 20px rgba(0,0,0,.3)" },
  headerIn:{ maxWidth:900, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:60 },
  logo:{ display:"flex", alignItems:"center", gap:10 },
  logoBall:{ fontSize:26 },
  logoTitle:{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:18, color:C.white, letterSpacing:1 },
  logoSub:{ fontSize:9, color:"#FF6B35", letterSpacing:2, textTransform:"uppercase" },
  navWrap:{ display:"flex", gap:4 },
  navBtn:(active)=>({ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, letterSpacing:1, textTransform:"uppercase", padding:"6px 14px", borderRadius:6, border:"none", cursor:"pointer", transition:"all .2s",
    background: active ? C.orange : "transparent", color: active ? C.white : "#aaa" }),
  main:{ maxWidth:900, margin:"0 auto", padding:"28px 16px 60px" },
  pageTitle:{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:36, letterSpacing:-0.5, marginBottom:4 },
  pageSub:{ color:C.grayText, fontSize:14, marginBottom:28 },
  card:{ background:C.white, borderRadius:14, border:`1px solid ${C.grayMid}`, padding:22, marginBottom:16 },
  label:{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, textTransform:"uppercase", letterSpacing:2, color:C.grayText, marginBottom:8, marginTop:18 },
  input:{ width:"100%", padding:"10px 14px", borderRadius:8, border:`1.5px solid ${C.grayMid}`, fontSize:14, fontFamily:"'Barlow',sans-serif", outline:"none", boxSizing:"border-box", marginBottom:2, transition:"border .2s" },
  textarea:{ width:"100%", padding:"10px 14px", borderRadius:8, border:`1.5px solid ${C.grayMid}`, fontSize:14, fontFamily:"'Barlow',sans-serif", outline:"none", boxSizing:"border-box", resize:"vertical", minHeight:80 },
  select:{ width:"100%", padding:"10px 14px", borderRadius:8, border:`1.5px solid ${C.grayMid}`, fontSize:14, fontFamily:"'Barlow',sans-serif", outline:"none", boxSizing:"border-box", background:C.white },
  btnOrange:{ background:C.orange, color:C.white, border:"none", borderRadius:8, padding:"10px 22px", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:15, letterSpacing:1, cursor:"pointer", transition:"opacity .2s" },
  btnGhost:{ background:"transparent", color:C.grayText, border:`1.5px solid ${C.grayMid}`, borderRadius:8, padding:"9px 18px", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, letterSpacing:1, cursor:"pointer" },
  badge:(c)=>({ display:"inline-block", padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:700, background:c+"18", color:c }),
  row:{ display:"flex", gap:12, flexWrap:"wrap" },
  col:{ flex:1, minWidth:180 },
  divider:{ border:"none", borderTop:`1px solid ${C.grayMid}`, margin:"18px 0" },
  overlay:{ position:"fixed", inset:0, background:"rgba(0,0,0,.55)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:16 },
  modal:{ background:C.white, borderRadius:18, padding:28, width:"100%", maxWidth:480, boxShadow:"0 20px 60px rgba(0,0,0,.2)", maxHeight:"90vh", overflowY:"auto" },
  modalTitle:{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:24, marginBottom:4 },
  empty:{ textAlign:"center", color:C.grayText, padding:"40px 0", fontSize:15 },
};

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ joueurs, setJoueurs, onLogin, showToast, toast }) {
  const [mode, setMode] = useState("choix"); // choix | coach | client | nouveau
  const [coachPwd, setCoachPwd] = useState("");
  const [clientNom, setClientNom] = useState("");
  const [clientCode, setClientCode] = useState("");
  const [erreur, setErreur] = useState("");
  // Formulaire nouveau joueur rapide
  const [nForm, setNForm] = useState({ prenom:"", nom:"", dateNaissance:"", code:"" });

  function loginCoach() {
    if (coachPwd === "wawa2024") { onLogin({ role:"coach" }); }
    else { setErreur("Mot de passe incorrect"); }
  }

  function loginClient() {
    const j = joueurs.find(j => (j.prenom+" "+j.nom).toLowerCase() === clientNom.trim().toLowerCase() && j.code === clientCode.trim());
    if (j) { onLogin({ role:"client", joueurId:j.id }); }
    else { setErreur("Nom ou code incorrect. Contactez Coach Wawa pour obtenir votre code d'accès."); }
  }

  function creerCompte() {
    if (!nForm.prenom||!nForm.nom||!nForm.dateNaissance||!nForm.code) return;
    const nouveau = { id:Date.now(), prenom:nForm.prenom, nom:nForm.nom, dateNaissance:nForm.dateNaissance, code:nForm.code,
      taille:"", envergure:"", poste:"Meneur", club:"", niveau:"Loisir", objectifs:"", poids:"", parentNom:"", parentPrenom:"", parentTel:"", bilan:"" };
    setJoueurs(p=>[...p, nouveau]);
    onLogin({ role:"client", joueurId:nouveau.id });
    showToast("Compte créé avec succès ! 🎉");
  }

  return (
    <div style={{...s.app, minHeight:"100vh", display:"flex", flexDirection:"column"}}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0} input:focus{border-color:#FF6B35!important;box-shadow:0 0 0 3px #FF6B3520} button:hover{opacity:.85} @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:none}} .slideUp{animation:slideUp .35s ease}`}</style>
      {/* Header */}
      <div style={{background:C.black, padding:"18px 24px", display:"flex", alignItems:"center", gap:12}}>
        <span style={{fontSize:30}}>🏀</span>
        <div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:24, color:C.white}}>PlayerSuperLvl</div>
          <div style={{fontSize:10, color:C.orange, letterSpacing:3, textTransform:"uppercase"}}>by Coach Wawa</div>
        </div>
      </div>

      <div style={{flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:24}}>
        <div style={{width:"100%", maxWidth:420}} className="slideUp">

          {mode === "choix" && (
            <div style={s.card}>
              <div style={{textAlign:"center", marginBottom:28}}>
                <div style={{fontSize:48, marginBottom:10}}>🏀</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:30, marginBottom:6}}>Bienvenue !</div>
                <div style={{color:C.grayText, fontSize:14}}>Connectez-vous pour accéder à votre espace</div>
              </div>
              <div style={{display:"flex", flexDirection:"column", gap:12}}>
                <button style={{...s.btnOrange, padding:"14px", fontSize:16, textAlign:"center"}} onClick={()=>{setMode("client");setErreur("");}}>
                  👤 Espace Joueur
                </button>
                <button style={{...s.btnGhost, padding:"14px", fontSize:16, textAlign:"center"}} onClick={()=>{setMode("coach");setErreur("");}}>
                  🎽 Espace Coach Wawa
                </button>
              </div>
              <div style={{textAlign:"center", marginTop:18}}>
                <button style={{background:"none", border:"none", color:C.grayText, fontSize:13, cursor:"pointer", textDecoration:"underline"}} onClick={()=>{setMode("nouveau");setErreur("");}}>
                  Première fois ? Créer mon compte joueur
                </button>
              </div>
            </div>
          )}

          {mode === "coach" && (
            <div style={s.card}>
              <button style={{...s.btnGhost, fontSize:12, padding:"5px 12px", marginBottom:18}} onClick={()=>setMode("choix")}>← Retour</button>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:26, marginBottom:4}}>🎽 Espace Coach</div>
              <div style={{color:C.grayText, fontSize:13, marginBottom:20}}>Accès réservé à Coach Wawa</div>
              <div style={s.label}>Mot de passe</div>
              <input style={s.input} type="password" placeholder="••••••••" value={coachPwd} onChange={e=>{setCoachPwd(e.target.value);setErreur("");}} onKeyDown={e=>e.key==="Enter"&&loginCoach()}/>
              {erreur && <div style={{color:C.red, fontSize:13, marginTop:8}}>{erreur}</div>}
              <div style={{fontSize:11, color:C.grayText, marginTop:6, marginBottom:16}}>💡 Démo : utilisez <b>wawa2024</b></div>
              <button style={{...s.btnOrange, width:"100%", padding:14}} onClick={loginCoach}>Se connecter</button>
            </div>
          )}

          {mode === "client" && (
            <div style={s.card}>
              <button style={{...s.btnGhost, fontSize:12, padding:"5px 12px", marginBottom:18}} onClick={()=>setMode("choix")}>← Retour</button>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:26, marginBottom:4}}>👤 Espace Joueur</div>
              <div style={{color:C.grayText, fontSize:13, marginBottom:20}}>Vos données sont privées et sécurisées 🔒</div>
              <div style={s.label}>Nom complet</div>
              <input style={s.input} placeholder="Prénom Nom" value={clientNom} onChange={e=>{setClientNom(e.target.value);setErreur("");}}/>
              <div style={s.label}>Code d'accès</div>
              <input style={s.input} type="password" placeholder="Code fourni par Coach Wawa" value={clientCode} onChange={e=>{setClientCode(e.target.value);setErreur("");}} onKeyDown={e=>e.key==="Enter"&&loginClient()}/>
              {erreur && <div style={{color:C.red, fontSize:13, marginTop:8}}>{erreur}</div>}
              <div style={{fontSize:11, color:C.grayText, marginTop:6, marginBottom:16}}>💡 Démo : <b>Lucas Martin</b> / code <b>lucas123</b> — ou <b>Sarah Kone</b> / <b>sarah123</b></div>
              <button style={{...s.btnOrange, width:"100%", padding:14}} onClick={loginClient}>Se connecter</button>
              <div style={{textAlign:"center", marginTop:14}}>
                <button style={{background:"none", border:"none", color:C.grayText, fontSize:13, cursor:"pointer", textDecoration:"underline"}} onClick={()=>{setMode("nouveau");setErreur("");}}>
                  Créer mon compte
                </button>
              </div>
            </div>
          )}

          {mode === "nouveau" && (
            <div style={s.card}>
              <button style={{...s.btnGhost, fontSize:12, padding:"5px 12px", marginBottom:18}} onClick={()=>setMode("choix")}>← Retour</button>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:26, marginBottom:4}}>✨ Créer mon compte</div>
              <div style={{color:C.grayText, fontSize:13, marginBottom:20}}>Votre code d'accès est personnel et confidentiel</div>
              <div style={s.row}>
                <div style={s.col}><div style={s.label}>Prénom</div><input style={s.input} value={nForm.prenom} onChange={e=>setNForm(f=>({...f,prenom:e.target.value}))}/></div>
                <div style={s.col}><div style={s.label}>Nom</div><input style={s.input} value={nForm.nom} onChange={e=>setNForm(f=>({...f,nom:e.target.value}))}/></div>
              </div>
              <div style={s.label}>Date de naissance</div>
              <input style={s.input} type="date" value={nForm.dateNaissance} onChange={e=>setNForm(f=>({...f,dateNaissance:e.target.value}))}/>
              <div style={s.label}>Choisissez un code d'accès</div>
              <input style={s.input} type="password" placeholder="Minimum 4 caractères" value={nForm.code} onChange={e=>setNForm(f=>({...f,code:e.target.value}))}/>
              {erreur && <div style={{color:C.red, fontSize:13, marginTop:8}}>{erreur}</div>}
              <button style={{...s.btnOrange, width:"100%", padding:14, marginTop:16, opacity:(!nForm.prenom||!nForm.nom||!nForm.dateNaissance||nForm.code.length<4)?.5:1}}
                disabled={!nForm.prenom||!nForm.nom||!nForm.dateNaissance||nForm.code.length<4}
                onClick={creerCompte}>Créer mon compte</button>
            </div>
          )}

        </div>
      </div>

      {toast && <div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:C.black,color:C.white,padding:"12px 24px",borderRadius:10,fontSize:14,fontWeight:600,zIndex:300}}>{toast}</div>}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("reservation");
  const [session, setSession] = useState(null); // null | { role:"coach" } | { role:"client", joueurId:N }
  const [reservations, setReservations] = useState(INIT_RESERVATIONS);
  const [joueurs, setJoueurs] = useState(INIT_JOUEURS);
  const [repas, setRepas] = useState(INIT_REPAS);
  const [messages, setMessages] = useState(INIT_MESSAGES);
  const [programmes, setProgrammes] = useState(INIT_PROGRAMMES);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(null),3000); };
  const role = session?.role || "client";

  const NAV = [
    { id:"reservation", label:"📅 Réservation" },
    { id:"coaching", label:"🎥 Coaching en ligne" },
    { id:"fiche", label:"📋 Fiche joueur" },
    { id:"nutrition", label:"🥗 Alimentation" },
  ];

  if (!session) return <LoginPage joueurs={joueurs} setJoueurs={setJoueurs} onLogin={setSession} showToast={showToast} toast={toast} />;

  return (
    <div style={s.app}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        input:focus,textarea:focus,select:focus{border-color:#FF6B35!important;box-shadow:0 0 0 3px #FF6B3520}
        button:hover{opacity:.85}
        ::-webkit-scrollbar{width:6px;height:6px}
        ::-webkit-scrollbar-thumb{background:#ddd;border-radius:3px}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        .fade{animation:fadeIn .3s ease}
        @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:none}}
        .slideUp{animation:slideUp .35s ease}
      `}</style>

      {/* HEADER */}
      <header style={s.header}>
        <div style={s.headerIn}>
          <div style={s.logo}>
            <span style={s.logoBall}>🏀</span>
            <div>
              <div style={s.logoTitle}>PlayerSuperLvl</div>
              <div style={s.logoSub}>by Coach Wawa</div>
            </div>
          </div>
          <nav style={s.navWrap}>
            {NAV.map(n=>(
              <button key={n.id} style={s.navBtn(page===n.id)} onClick={()=>setPage(n.id)}>{n.label}</button>
            ))}
          </nav>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{fontSize:12,color:"#aaa"}}>
              {role==="coach" ? "🎽 Coach Wawa" : `👤 ${joueurs.find(j=>j.id===session.joueurId)?.prenom||"Client"}`}
            </div>
            <button style={{...s.btnGhost,fontSize:12,padding:"5px 12px",color:"#aaa",borderColor:"#333"}} onClick={()=>{setSession(null);setPage("reservation");}}>
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main style={s.main} className="fade">
        {page==="reservation" && <PageReservation role={role} session={session} reservations={reservations} setReservations={setReservations} showToast={showToast} joueurs={joueurs} />}
        {page==="coaching"   && <PageCoaching role={role} session={session} joueurs={joueurs} messages={messages} setMessages={setMessages} programmes={programmes} setProgrammes={setProgrammes} showToast={showToast} />}
        {page==="fiche"      && <PageFiche role={role} session={session} joueurs={joueurs} setJoueurs={setJoueurs} showToast={showToast} />}
        {page==="nutrition"  && <PageNutrition role={role} session={session} joueurs={joueurs} repas={repas} setRepas={setRepas} showToast={showToast} />}
      </main>

      {toast && (
        <div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:C.black,color:C.white,padding:"12px 24px",borderRadius:10,fontSize:14,fontWeight:600,zIndex:300,boxShadow:"0 8px 30px rgba(0,0,0,.3)"}} className="slideUp">
          {toast}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE RÉSERVATION
// ═══════════════════════════════════════════════════════════════════════════
const FORMULES = [
  { id:"1h",   label:"1h",   prix:20, desc:"Séance individuelle 1 heure" },
  { id:"1h30", label:"1h30", prix:25, desc:"Séance individuelle 1h30" },
];

function PageReservation({ role, session, reservations, setReservations, showToast, joueurs }) {
  const [date, setDate] = useState(getDates()[0]);
  const [terrainFil, setTerrainFil] = useState(null);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ prenom:"", nom:"", formule:"1h" });
  const dates = getDates(7);

  // Pré-remplir le nom si client connecté
  function openModal(heure, terrain, date) {
    if (role==="client" && session?.joueurId) {
      const j = joueurs.find(x=>x.id===session.joueurId);
      if (j) { setForm({ prenom:j.prenom, nom:j.nom, formule:"1h" }); }
    } else { setForm({ prenom:"", nom:"", formule:"1h" }); }
    setModal({ heure, terrain, date });
  }

  function dispo(d, h, tId) {
    if (reservations.find(r=>r.date===d&&r.heure===h&&r.terrainId===tId)) return { ok:false, msg:"Déjà réservé" };
    for (const r of reservations) {
      if (r.date!==d) continue;
      const diff = Math.abs(toMin(h)-toMin(r.heure));
      // Si créneaux consécutifs (1h d'écart) sur terrains différents
      if (diff===60 && r.terrainId!==tId) {
        const t=getTrajet(r.terrainId,tId);
        // Le coach a 0 min libre entre deux séances consécutives, trajet impossible sauf 10min (SLdV)
        if (t>0) return { ok:false, msg:`🚗 Trajet ~${t}min nécessaire depuis ${TERRAINS.find(x=>x.id===r.terrainId)?.nom}` };
      }
    }
    return { ok:true, msg:"" };
  }

  function reserver() {
    if (!form.prenom||!form.nom) return;
    const formule = FORMULES.find(f=>f.id===form.formule);
    const r = { id:Date.now(), date:modal.date, heure:modal.heure, terrainId:modal.terrain.id, client:`${form.prenom} ${form.nom}`, statut:"confirmé", formule:formule.label, prix:formule.prix };
    setReservations(p=>[...p,r]);
    showToast(`✅ Réservé — ${formule.label} — ${formule.prix}€ — ${modal.heure}`);
    setModal(null); setForm({prenom:"",nom:"",formule:"1h"});
  }

  const jourRes = reservations.filter(r=>r.date===date).sort((a,b)=>toMin(a.heure)-toMin(b.heure));

  return (
    <>
      <div style={s.pageTitle}>Réservation <span style={{color:C.orange}}>Terrain</span></div>
      <div style={s.pageSub}>Choisissez votre date, terrain et créneau d'1h</div>

      {/* Dates */}
      <div style={s.label}>Date</div>
      <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>
        {dates.map(d=>{
          const nb=reservations.filter(r=>r.date===d).length;
          return (
            <button key={d} onClick={()=>setDate(d)} style={{
              minWidth:64, padding:"10px 8px", borderRadius:10, border:`2px solid ${date===d?C.orange:C.grayMid}`,
              background:date===d?C.orange:C.white, color:date===d?C.white:C.black, cursor:"pointer", position:"relative", flexShrink:0
            }}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,textTransform:"uppercase",opacity:.7}}>
                {new Date(d+"T00:00:00").toLocaleDateString("fr-FR",{weekday:"short"})}
              </div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22}}>
                {new Date(d+"T00:00:00").getDate()}
              </div>
              {nb>0&&<div style={{position:"absolute",top:4,right:4,background:date===d?C.white:C.orange,color:date===d?C.orange:C.white,fontSize:9,fontWeight:900,borderRadius:10,padding:"1px 5px"}}>{nb}</div>}
            </button>
          );
        })}
      </div>

      {/* Filtre terrain */}
      <div style={s.label}>Terrain (optionnel)</div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:6}}>
        <button onClick={()=>setTerrainFil(null)} style={{...s.btnGhost,fontSize:12,padding:"6px 14px",borderColor:!terrainFil?C.orange:C.grayMid,color:!terrainFil?C.orange:C.grayText}}>Tous</button>
        {TERRAINS.map(t=>(
          <button key={t.id} onClick={()=>setTerrainFil(terrainFil===t.id?null:t.id)} style={{...s.btnGhost,fontSize:12,padding:"6px 14px",borderColor:terrainFil===t.id?t.couleur:C.grayMid,color:terrainFil===t.id?t.couleur:C.grayText}}>
            {t.nom}
          </button>
        ))}
      </div>

      {/* Grille */}
      {(terrainFil ? TERRAINS.filter(t=>t.id===terrainFil) : TERRAINS).map(terrain=>(
        <div key={terrain.id} style={{...s.card,marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <div style={{width:12,height:12,borderRadius:"50%",background:terrain.couleur,flexShrink:0}}/>
            <div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:18}}>{terrain.nom}</div>
              <div style={{fontSize:12,color:C.grayText}}>{terrain.adresse}</div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(84px,1fr))",gap:8}}>
            {HEURES.map(h=>{
              const {ok,msg}=dispo(date,h,terrain.id);
              return (
                <button key={h} disabled={!ok} title={msg} onClick={()=>ok&&openModal(h,terrain,date)} style={{
                  padding:"10px 4px", borderRadius:8, border:`2px solid ${ok?terrain.couleur:C.grayMid}`,
                  background:ok?terrain.couleur+"10":C.gray, color:ok?terrain.couleur:C.grayText,
                  cursor:ok?"pointer":"not-allowed", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:15,
                  transition:"all .15s", position:"relative"
                }}>
                  {h}
                  {!ok&&msg.includes("🚗")&&<div style={{fontSize:10,marginTop:2}}>🚗</div>}
                  {!ok&&!msg.includes("🚗")&&<div style={{fontSize:10,marginTop:2,color:C.grayText}}>✕</div>}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Planning du jour (coach) */}
      {role==="coach" && (
        <>
          <hr style={s.divider}/>
          <div style={s.label}>Planning coach — {fmtDate(date)}</div>
          {jourRes.length===0 ? <div style={s.empty}>Aucune séance ce jour</div> : (
            <div>
              {jourRes.map((r,i)=>{
                const terrain=TERRAINS.find(t=>t.id===r.terrainId);
                const prev=jourRes[i-1];
                const trajet=prev&&prev.terrainId!==r.terrainId?getTrajet(prev.terrainId,r.terrainId):null;
                return (
                  <div key={r.id}>
                    {trajet!==null&&(
                      <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",background:trajet>45?"#fef2f2":"#f0fdf4",borderRadius:8,margin:"6px 0",fontSize:13}}>
                        🚗 Trajet depuis <b>{TERRAINS.find(t=>t.id===prev.terrainId)?.nom}</b> : ~{trajet} min
                        <span style={{marginLeft:"auto",fontWeight:800,color:trajet>45?C.red:C.green}}>{trajet>45?"⚠️ Serré":"✅ OK"}</span>
                      </div>
                    )}
                    <div style={{...s.card,padding:14,marginBottom:8,borderLeft:`5px solid ${terrain?.couleur}`,display:"flex",alignItems:"center",gap:14}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:26,color:terrain?.couleur,minWidth:60}}>{r.heure}</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:600,fontSize:15}}>{r.client}</div>
                        <div style={{fontSize:13,color:C.grayText}}>📍 {terrain?.nom}</div>
                        {r.formule && <div style={{fontSize:12,marginTop:2}}><span style={s.badge(C.orange)}>{r.formule}</span></div>}
                      </div>
                      {r.prix && <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,color:C.green}}>{r.prix}€</div>}
                      <button onClick={()=>{setReservations(p=>p.filter(x=>x.id!==r.id));showToast("Réservation annulée");}} style={{...s.btnGhost,fontSize:12,padding:"4px 10px",color:C.red,borderColor:C.red}}>Annuler</button>
                    </div>
                  </div>
                );
              })}
              {/* Total du jour */}
              {jourRes.some(r=>r.prix) && (
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 18px",background:C.black,borderRadius:10,marginTop:8}}>
                  <div style={{color:"#aaa",fontSize:13,fontWeight:600}}>Total encaissé ce jour</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:28,color:C.green}}>
                    {jourRes.reduce((sum,r)=>sum+(r.prix||0),0)}€
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Modal réservation */}
      {modal&&(
        <div style={s.overlay} onClick={()=>setModal(null)}>
          <div style={s.modal} className="slideUp" onClick={e=>e.stopPropagation()}>
            <div style={s.modalTitle}>🏀 Réserver</div>
            <div style={{color:C.grayText,fontSize:14,marginBottom:18}}>{modal.heure} • {fmtDate(modal.date)}</div>
            <div style={{padding:"10px 14px",borderRadius:8,background:modal.terrain.couleur+"15",color:modal.terrain.couleur,fontWeight:700,marginBottom:16}}>
              📍 {modal.terrain.nom} — {modal.terrain.adresse}
            </div>

            {/* Sélection formule */}
            <div style={s.label}>Choisissez votre formule</div>
            <div style={{display:"flex",gap:10,marginBottom:6}}>
              {FORMULES.map(f=>(
                <button key={f.id} onClick={()=>setForm(x=>({...x,formule:f.id}))} style={{
                  flex:1, padding:"14px 8px", borderRadius:10, cursor:"pointer", transition:"all .15s",
                  border:`2px solid ${form.formule===f.id ? C.orange : C.grayMid}`,
                  background: form.formule===f.id ? C.orangeLight : C.white,
                  textAlign:"center"
                }}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,color:form.formule===f.id?C.orange:C.black}}>{f.prix}€</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14,color:form.formule===f.id?C.orange:C.grayText}}>{f.label}</div>
                  <div style={{fontSize:11,color:C.grayText,marginTop:2}}>{f.desc}</div>
                </button>
              ))}
            </div>

            <div style={s.label}>Vos informations</div>
            <input style={s.input} placeholder="Prénom" value={form.prenom} onChange={e=>setForm(f=>({...f,prenom:e.target.value}))}/>
            <div style={{marginBottom:8}}/>
            <input style={s.input} placeholder="Nom" value={form.nom} onChange={e=>setForm(f=>({...f,nom:e.target.value}))}/>

            {/* Récap prix */}
            <div style={{marginTop:16,padding:"12px 16px",borderRadius:10,background:C.gray,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:13,color:C.grayText}}>Total à régler au coach</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:24,color:C.orange}}>
                {FORMULES.find(f=>f.id===form.formule)?.prix}€
              </div>
            </div>
            <div style={{fontSize:11,color:C.grayText,marginTop:6,marginBottom:4}}>💳 Règlement le jour de la séance (espèces / virement)</div>

            <div style={{display:"flex",gap:10,marginTop:14}}>
              <button style={s.btnGhost} onClick={()=>setModal(null)}>Annuler</button>
              <button style={{...s.btnOrange,flex:1,opacity:(!form.nom||!form.prenom)?.5:1}} disabled={!form.nom||!form.prenom} onClick={reserver}>Confirmer la réservation</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE COACHING EN LIGNE
// ═══════════════════════════════════════════════════════════════════════════
function PageCoaching({ role, session, joueurs, messages, setMessages, programmes, setProgrammes, showToast }) {
  // Client voit uniquement son propre espace; coach voit tout
  const joueursList = role==="coach" ? joueurs : joueurs.filter(j=>j.id===session?.joueurId);
  const [onglet, setOnglet] = useState("messagerie");
  const [joueurId, setJoueurId] = useState(role==="coach" ? (joueurs[0]?.id||null) : session?.joueurId);
  const [msgText, setMsgText] = useState("");
  const [progModal, setProgModal] = useState(false);
  const [progForm, setProgForm] = useState({ titre:"", contenu:"", joueurId:joueurs[0]?.id||"" });
  const [retourId, setRetourId] = useState(null);
  const [retourText, setRetourText] = useState("");

  const joueur = joueurs.find(j=>j.id===joueurId);
  const convMessages = messages.filter(m=>m.joueurId===joueurId);
  const joueurProgs = programmes.filter(p=>p.joueurId===joueurId);

  function sendMsg() {
    if(!msgText.trim()) return;
    const m = { id:Date.now(), joueurId, joueur:joueur?.prenom+" "+joueur?.nom, auteur:role==="coach"?"Coach":joueur?.prenom+" "+joueur?.nom, role, texte:msgText, date:new Date().toLocaleString("fr-FR") };
    setMessages(p=>[...p,m]); setMsgText(""); showToast("Message envoyé");
  }

  function addProg() {
    if(!progForm.titre||!progForm.contenu) return;
    const j=joueurs.find(x=>x.id===Number(progForm.joueurId));
    setProgrammes(p=>[...p,{id:Date.now(),...progForm,joueurId:Number(progForm.joueurId),joueur:j?.prenom+" "+j?.nom,date:new Date().toISOString().split("T")[0],retour:""}]);
    showToast("Programme envoyé ✅"); setProgModal(false); setProgForm({titre:"",contenu:"",joueurId:joueurs[0]?.id||""});
  }

  function saveRetour(id) {
    setProgrammes(p=>p.map(x=>x.id===id?{...x,retour:retourText}:x));
    showToast("Retour enregistré"); setRetourId(null); setRetourText("");
  }

  const ONGLETS = [{id:"messagerie",label:"💬 Messagerie"},{id:"programmes",label:"📋 Programmes"},{id:"seances",label:"🎥 Séances vidéo"}];

  return (
    <>
      <div style={s.pageTitle}>Coaching <span style={{color:C.orange}}>En Ligne</span></div>
      <div style={s.pageSub}>Messagerie, programmes et séances à distance</div>

      {/* Sélection joueur (coach uniquement) */}
      {role==="coach" && (
        <>
          <div style={s.label}>Joueur</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:18}}>
            {joueursList.map(j=>(
              <button key={j.id} onClick={()=>setJoueurId(j.id)} style={{
                ...s.btnGhost, fontSize:13, padding:"7px 16px",
                borderColor:joueurId===j.id?C.orange:C.grayMid, color:joueurId===j.id?C.orange:C.grayText,
                background:joueurId===j.id?C.orangeLight:C.white
              }}>{j.prenom} {j.nom}</button>
            ))}
          </div>
        </>
      )}

      {/* Sous-onglets */}
      <div style={{display:"flex",gap:0,marginBottom:22,borderBottom:`2px solid ${C.grayMid}`}}>
        {ONGLETS.map(o=>(
          <button key={o.id} onClick={()=>setOnglet(o.id)} style={{
            padding:"10px 18px", border:"none", background:"transparent", cursor:"pointer",
            fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, letterSpacing:.5,
            borderBottom:onglet===o.id?`3px solid ${C.orange}`:"3px solid transparent",
            color:onglet===o.id?C.orange:C.grayText, marginBottom:-2
          }}>{o.label}</button>
        ))}
      </div>

      {/* MESSAGERIE */}
      {onglet==="messagerie"&&(
        <div>
          <div style={{...s.card,padding:0,overflow:"hidden"}}>
            <div style={{height:360,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:10}}>
              {convMessages.length===0&&<div style={s.empty}>Aucun message — démarrez la conversation</div>}
              {convMessages.map(m=>{
                const mine=(role==="coach"&&m.role==="coach")||(role==="client"&&m.role==="client");
                return (
                  <div key={m.id} style={{display:"flex",justifyContent:mine?"flex-end":"flex-start"}}>
                    <div style={{maxWidth:"72%"}}>
                      <div style={{fontSize:11,color:C.grayText,marginBottom:3,textAlign:mine?"right":"left"}}>{m.auteur} · {m.date}</div>
                      <div style={{padding:"10px 14px",borderRadius:mine?"14px 14px 4px 14px":"14px 14px 14px 4px",background:mine?C.orange:C.white,color:mine?C.white:C.black,fontSize:14,border:mine?"none":`1px solid ${C.grayMid}`,boxShadow:"0 1px 4px rgba(0,0,0,.06)"}}>
                        {m.texte}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{borderTop:`1px solid ${C.grayMid}`,padding:12,display:"flex",gap:8}}>
              <input style={{...s.input,marginBottom:0,flex:1}} placeholder="Écrire un message..." value={msgText} onChange={e=>setMsgText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()}/>
              <button style={s.btnOrange} onClick={sendMsg}>Envoyer</button>
            </div>
          </div>
        </div>
      )}

      {/* PROGRAMMES */}
      {onglet==="programmes"&&(
        <div>
          {role==="coach"&&(
            <button style={{...s.btnOrange,marginBottom:16}} onClick={()=>setProgModal(true)}>+ Nouveau programme</button>
          )}
          {joueurProgs.length===0&&<div style={s.empty}>Aucun programme pour ce joueur</div>}
          {joueurProgs.map(p=>(
            <div key={p.id} style={{...s.card,marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:18}}>{p.titre}</div>
                  <div style={{fontSize:12,color:C.grayText}}>Envoyé le {p.date}</div>
                </div>
                <span style={s.badge(C.orange)}>Programme</span>
              </div>
              <pre style={{fontSize:13,color:C.black,whiteSpace:"pre-wrap",fontFamily:"'Barlow',sans-serif",background:C.gray,padding:12,borderRadius:8,lineHeight:1.6}}>{p.contenu}</pre>
              {p.retour&&(
                <div style={{marginTop:12,padding:12,background:"#f0fdf4",borderRadius:8,borderLeft:`3px solid ${C.green}`}}>
                  <div style={{fontSize:11,fontWeight:700,color:C.green,marginBottom:4}}>RETOUR DU JOUEUR</div>
                  <div style={{fontSize:13}}>{p.retour}</div>
                </div>
              )}
              {role==="client"&&!p.retour&&(
                retourId===p.id?(
                  <div style={{marginTop:10}}>
                    <textarea style={s.textarea} placeholder="Votre retour sur ce programme..." value={retourText} onChange={e=>setRetourText(e.target.value)}/>
                    <div style={{display:"flex",gap:8,marginTop:8}}>
                      <button style={s.btnGhost} onClick={()=>setRetourId(null)}>Annuler</button>
                      <button style={s.btnOrange} onClick={()=>saveRetour(p.id)}>Envoyer le retour</button>
                    </div>
                  </div>
                ):(
                  <button style={{...s.btnGhost,marginTop:10,fontSize:13}} onClick={()=>{setRetourId(p.id);setRetourText("");}}>✍️ Donner mon retour</button>
                )
              )}
            </div>
          ))}

          {progModal&&(
            <div style={s.overlay} onClick={()=>setProgModal(false)}>
              <div style={s.modal} className="slideUp" onClick={e=>e.stopPropagation()}>
                <div style={s.modalTitle}>📋 Nouveau programme</div>
                <div style={{marginTop:12}}>
                  <div style={s.label}>Joueur</div>
                  <select style={s.select} value={progForm.joueurId} onChange={e=>setProgForm(f=>({...f,joueurId:e.target.value}))}>
                    {joueurs.map(j=><option key={j.id} value={j.id}>{j.prenom} {j.nom}</option>)}
                  </select>
                  <div style={s.label}>Titre</div>
                  <input style={s.input} placeholder="Ex: Programme intersaison semaine 1" value={progForm.titre} onChange={e=>setProgForm(f=>({...f,titre:e.target.value}))}/>
                  <div style={s.label}>Contenu du programme</div>
                  <textarea style={{...s.textarea,minHeight:140}} placeholder="Lundi: ...\nMercredi: ...\nVendredi: ..." value={progForm.contenu} onChange={e=>setProgForm(f=>({...f,contenu:e.target.value}))}/>
                </div>
                <div style={{display:"flex",gap:10,marginTop:18}}>
                  <button style={s.btnGhost} onClick={()=>setProgModal(false)}>Annuler</button>
                  <button style={{...s.btnOrange,flex:1}} onClick={addProg}>Envoyer le programme</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SÉANCES VIDÉO */}
      {onglet==="seances"&&(
        <div style={s.card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:20}}>Séances vidéo</div>
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 16px",background:C.orangeLight,borderRadius:10}}>
              <span style={{fontSize:13,color:C.grayText}}>Tarif séance</span>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:24,color:C.orange}}>40€</span>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {[{date:"Vendredi 25 avril",heure:"18:00",joueur:"Lucas Martin",lien:"https://meet.google.com/abc-defg-hij"},{date:"Samedi 26 avril",heure:"10:00",joueur:"Sarah Kone",lien:"https://zoom.us/j/123456789"}].map((s2,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:14,background:C.gray,borderRadius:10}}>
                <div style={{background:C.orange,color:C.white,borderRadius:8,padding:"8px 12px",textAlign:"center",minWidth:60}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:20}}>{s2.heure}</div>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:15}}>{s2.joueur}</div>
                  <div style={{fontSize:12,color:C.grayText}}>{s2.date}</div>
                </div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,color:C.green,marginRight:4}}>40€</div>
                <a href={s2.lien} target="_blank" rel="noreferrer" style={{...s.btnOrange,textDecoration:"none",fontSize:13,padding:"8px 16px"}}>🎥 Rejoindre</a>
              </div>
            ))}
          </div>
          {role==="client"&&(
            <div style={{marginTop:16,padding:14,background:C.orangeLight,borderRadius:10,fontSize:13,color:C.grayText,lineHeight:1.6}}>
              💳 <b style={{color:C.black}}>40€ / séance vidéo</b> — Règlement avant la séance par virement ou sur place.<br/>
              Pour réserver une séance vidéo, envoyez un message à Coach Wawa via l'onglet Messagerie.
            </div>
          )}
          {role==="coach"&&(
            <button style={{...s.btnGhost,marginTop:14}} onClick={()=>showToast("Fonctionnalité à venir : planifier une séance")}>+ Planifier une séance</button>
          )}
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE FICHE JOUEUR
// ═══════════════════════════════════════════════════════════════════════════
function PageFiche({ role, session, joueurs, setJoueurs, showToast }) {
  // Clients ne voient que leur propre fiche
  const joueursFiltres = role==="coach" ? joueurs : joueurs.filter(j=>j.id===session?.joueurId);
  const [vue, setVue] = useState(role==="client" && joueursFiltres.length>0 ? "detail" : "liste");
  const [selected, setSelected] = useState(role==="client" ? (joueursFiltres[0]||null) : null);
  const [form, setForm] = useState({
    prenom:"",nom:"",dateNaissance:"",taille:"",envergure:"",poste:"Meneur",
    club:"",niveau:"Régional",objectifs:"",poids:"",
    parentNom:"",parentPrenom:"",parentTel:"",bilan:"",code:""
  });

  function f(k,v){ setForm(p=>({...p,[k]:v})); }

  function save() {
    if(!form.prenom||!form.nom||!form.dateNaissance) return;
    const j = { id:Date.now(), ...form };
    setJoueurs(p=>[...p,j]); showToast("Fiche créée ✅"); setVue("liste"); setForm({prenom:"",nom:"",dateNaissance:"",taille:"",envergure:"",poste:"Meneur",club:"",niveau:"Régional",objectifs:"",poids:"",parentNom:"",parentPrenom:"",parentTel:"",bilan:"",code:""});
  }

  const mineur = form.dateNaissance ? age(form.dateNaissance)<18 : false;

  if(vue==="detail"&&selected) return (
    <div>
      <button style={{...s.btnGhost,marginBottom:18,fontSize:13}} onClick={()=>setVue("liste")}>← Retour</button>
      <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24}}>
        <div style={{width:64,height:64,borderRadius:"50%",background:C.orange,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:26,color:C.white}}>
          {selected.prenom[0]}{selected.nom[0]}
        </div>
        <div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:30}}>{selected.prenom} {selected.nom}</div>
          <div style={{color:C.grayText,fontSize:14}}>{selected.poste} · {selected.club} · {age(selected.dateNaissance)} ans</div>
        </div>
        <span style={{...s.badge(C.orange),marginLeft:"auto"}}>{selected.niveau}</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {[
          ["📅 Date de naissance", new Date(selected.dateNaissance+"T00:00:00").toLocaleDateString("fr-FR")],
          ["📏 Taille", selected.taille ? selected.taille+" cm" : "—"],
          ["🦅 Envergure", selected.envergure ? selected.envergure+" cm" : "—"],
          ["⚖️ Poids", selected.poids ? selected.poids+" kg" : "—"],
          ["🏀 Poste", selected.poste],
          ["🏟️ Club", selected.club||"—"],
        ].map(([label,val])=>(
          <div key={label} style={{...s.card,padding:14}}>
            <div style={{fontSize:12,color:C.grayText,marginBottom:4}}>{label}</div>
            <div style={{fontWeight:600,fontSize:16}}>{val}</div>
          </div>
        ))}
      </div>
      <div style={{...s.card,marginTop:4}}>
        <div style={{fontSize:12,color:C.grayText,marginBottom:6}}>🎯 Objectifs d'entraînement</div>
        <div style={{fontSize:14,lineHeight:1.6}}>{selected.objectifs||"—"}</div>
      </div>
      <div style={{...s.card,borderLeft:`4px solid ${C.red}`}}>
        <div style={{fontSize:12,color:C.red,fontWeight:700,marginBottom:6}}>🏥 Bilan de santé</div>
        <div style={{fontSize:14,lineHeight:1.6}}>{selected.bilan||"Aucun renseignement"}</div>
      </div>
      {age(selected.dateNaissance)<18&&(selected.parentNom||selected.parentPrenom)&&(
        <div style={{...s.card,borderLeft:`4px solid ${C.yellow}`}}>
          <div style={{fontSize:12,color:C.yellow,fontWeight:700,marginBottom:6}}>👨‍👩‍👦 Contact parent/tuteur</div>
          <div style={{fontSize:14}}>{selected.parentPrenom} {selected.parentNom}</div>
          {selected.parentTel&&<div style={{fontSize:14,color:C.grayText}}>📞 {selected.parentTel}</div>}
        </div>
      )}
    </div>
  );

  if(vue==="form") return (
    <div>
      <button style={{...s.btnGhost,marginBottom:18,fontSize:13}} onClick={()=>setVue("liste")}>← Retour</button>
      <div style={s.pageTitle}>Nouvelle <span style={{color:C.orange}}>Fiche Joueur</span></div>
      <div style={s.pageSub}>Remplissez les informations du joueur</div>

      <div style={s.card}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:16,marginBottom:14}}>Informations personnelles</div>
        <div style={s.row}>
          <div style={s.col}><div style={s.label}>Prénom *</div><input style={s.input} value={form.prenom} onChange={e=>f("prenom",e.target.value)} placeholder="Prénom"/></div>
          <div style={s.col}><div style={s.label}>Nom *</div><input style={s.input} value={form.nom} onChange={e=>f("nom",e.target.value)} placeholder="Nom"/></div>
        </div>
        <div style={s.label}>Date de naissance *</div>
        <input style={s.input} type="date" value={form.dateNaissance} onChange={e=>f("dateNaissance",e.target.value)}/>

        {mineur&&(
          <div style={{marginTop:12,padding:14,background:"#fffbeb",borderRadius:10,border:`1px solid ${C.yellow}`}}>
            <div style={{fontWeight:700,fontSize:13,color:C.yellow,marginBottom:10}}>👨‍👩‍👦 Joueur mineur — Informations parent/tuteur requises</div>
            <div style={s.row}>
              <div style={s.col}><div style={s.label}>Prénom parent</div><input style={s.input} value={form.parentPrenom} onChange={e=>f("parentPrenom",e.target.value)} placeholder="Prénom"/></div>
              <div style={s.col}><div style={s.label}>Nom parent</div><input style={s.input} value={form.parentNom} onChange={e=>f("parentNom",e.target.value)} placeholder="Nom"/></div>
            </div>
            <div style={s.label}>Téléphone parent</div>
            <input style={s.input} value={form.parentTel} onChange={e=>f("parentTel",e.target.value)} placeholder="06 XX XX XX XX"/>
          </div>
        )}
      </div>

      <div style={s.card}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:16,marginBottom:14}}>Morphologie & Profil</div>
        <div style={s.row}>
          <div style={s.col}><div style={s.label}>Taille (cm)</div><input style={s.input} type="number" value={form.taille} onChange={e=>f("taille",e.target.value)} placeholder="180"/></div>
          <div style={s.col}><div style={s.label}>Envergure (cm)</div><input style={s.input} type="number" value={form.envergure} onChange={e=>f("envergure",e.target.value)} placeholder="185"/></div>
          <div style={s.col}><div style={s.label}>Poids (kg)</div><input style={s.input} type="number" value={form.poids} onChange={e=>f("poids",e.target.value)} placeholder="75"/></div>
        </div>
        <div style={s.row}>
          <div style={s.col}>
            <div style={s.label}>Poste de jeu</div>
            <select style={s.select} value={form.poste} onChange={e=>f("poste",e.target.value)}>
              {POSTES.map(p=><option key={p}>{p}</option>)}
            </select>
          </div>
          <div style={s.col}>
            <div style={s.label}>Niveau de jeu</div>
            <select style={s.select} value={form.niveau} onChange={e=>f("niveau",e.target.value)}>
              {NIVEAUX.map(n=><option key={n}>{n}</option>)}
            </select>
          </div>
        </div>
        <div style={s.label}>Club actuel</div>
        <input style={s.input} value={form.club} onChange={e=>f("club",e.target.value)} placeholder="Ex: Cavigal Nice Basket"/>
      </div>

      <div style={s.card}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:16,marginBottom:14}}>Objectifs & Santé</div>
        <div style={s.label}>Objectifs des entraînements individuels</div>
        <textarea style={s.textarea} value={form.objectifs} onChange={e=>f("objectifs",e.target.value)} placeholder="Ex: Améliorer le tir à 3 pts, travail défensif, vitesse de déplacement..."/>
        <div style={{...s.label,marginTop:14,color:C.red}}>🏥 Bilan de santé (blessures, contre-indications...)</div>
        <textarea style={{...s.textarea,borderColor:"#fecaca"}} value={form.bilan} onChange={e=>f("bilan",e.target.value)} placeholder="Ex: Tendinite rotule droite 2024 (guérie), aucune contre-indication actuelle..."/>
      </div>

      <div style={{display:"flex",gap:10,marginTop:4}}>
        <button style={s.btnGhost} onClick={()=>setVue("liste")}>Annuler</button>
        <button style={{...s.btnOrange,flex:1,opacity:(!form.prenom||!form.nom||!form.dateNaissance)?.5:1}} onClick={save} disabled={!form.prenom||!form.nom||!form.dateNaissance}>
          Enregistrer la fiche
        </button>
      </div>
    </div>
  );

  // LISTE
  return (
    <>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:4}}>
        <div>
          <div style={s.pageTitle}>Fiches <span style={{color:C.orange}}>Joueurs</span></div>
          <div style={s.pageSub}>{joueursFiltres.length} joueur{joueursFiltres.length>1?"s":""} enregistré{joueursFiltres.length>1?"s":""}</div>
        </div>
        {role==="coach" && <button style={s.btnOrange} onClick={()=>setVue("form")}>+ Nouvelle fiche</button>}
      </div>
      {joueursFiltres.length===0&&<div style={s.empty}>Aucune fiche joueur — contactez Coach Wawa</div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14,marginTop:10}}>
        {joueursFiltres.map(j=>(
          <div key={j.id} style={{...s.card,cursor:"pointer",transition:"box-shadow .2s",padding:18}} onClick={()=>{setSelected(j);setVue("detail");}}
            onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 20px rgba(255,107,53,.15)"}
            onMouseLeave={e=>e.currentTarget.style.boxShadow=""}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
              <div style={{width:48,height:48,borderRadius:"50%",background:C.orange,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:20,color:C.white,flexShrink:0}}>
                {j.prenom[0]}{j.nom[0]}
              </div>
              <div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:18}}>{j.prenom} {j.nom}</div>
                <div style={{fontSize:12,color:C.grayText}}>{age(j.dateNaissance)} ans · {j.poste}</div>
              </div>
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              <span style={s.badge(C.orange)}>{j.niveau}</span>
              {j.club&&<span style={s.badge(C.grayText)}>{j.club}</span>}
              {age(j.dateNaissance)<18&&<span style={s.badge(C.yellow)}>Mineur</span>}
            </div>
            {j.taille&&<div style={{fontSize:12,color:C.grayText,marginTop:8}}>📏 {j.taille}cm · 🦅 {j.envergure||"—"}cm</div>}
          </div>
        ))}
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE NUTRITION
// ═══════════════════════════════════════════════════════════════════════════
function PageNutrition({ role, session, joueurs, repas, setRepas, showToast }) {
  // Client voit uniquement ses propres repas
  const myJoueurId = session?.joueurId;
  const [modal, setModal] = useState(false);
  const [commentModal, setCommentModal] = useState(null);
  const [form, setForm] = useState({ joueurId: role==="coach" ? (joueurs[0]?.id||"") : myJoueurId, repas:"Déjeuner", description:"", note:null });
  const [commentForm, setCommentForm] = useState({ note:null, commentCoach:"", conseil:"" });
  const [filtre, setFiltre] = useState(null);

  const REPAS_TYPES = ["Petit-déjeuner","Déjeuner","Dîner","Collation"];
  const NOTES = [1,2,3,4,5];

  function addRepas() {
    if(!form.description) return;
    const joueurId = role==="coach" ? Number(form.joueurId) : myJoueurId;
    const j=joueurs.find(x=>x.id===joueurId);
    const r = { id:Date.now(), joueurId, joueur:j?.prenom+" "+j?.nom, date:new Date().toISOString().split("T")[0], repas:form.repas, description:form.description, img:null, note:null, commentCoach:"", conseil:"" };
    setRepas(p=>[r,...p]); showToast("Repas partagé 🥗"); setModal(false);
    setForm({ joueurId: role==="coach" ? (joueurs[0]?.id||"") : myJoueurId, repas:"Déjeuner", description:"", note:null });
  }

  function saveComment() {
    setRepas(p=>p.map(r=>r.id===commentModal.id?{...r,...commentForm}:r));
    showToast("Feedback enregistré ✅"); setCommentModal(null); setCommentForm({note:null,commentCoach:"",conseil:""});
  }

  // Client voit uniquement ses repas; coach peut filtrer par joueur
  const baseRepas = role==="client" ? repas.filter(r=>r.joueurId===myJoueurId) : repas;
  const filtered = filtre ? baseRepas.filter(r=>r.joueurId===filtre) : baseRepas;

  const noteColor = n => n>=4?C.green:n>=3?C.yellow:C.red;
  const noteEmoji = n => n>=4?"🌟":n>=3?"👍":"⚠️";

  return (
    <>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:4}}>
        <div>
          <div style={s.pageTitle}>Suivi <span style={{color:C.orange}}>Alimentation</span></div>
          <div style={s.pageSub}>Partagez vos repas, recevez les conseils du coach</div>
        </div>
        {role==="client"&&<button style={s.btnOrange} onClick={()=>setModal(true)}>+ Partager un repas</button>}
      </div>

      {/* Filtres joueurs (coach) */}
      {role==="coach"&&(
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:18}}>
          <button onClick={()=>setFiltre(null)} style={{...s.btnGhost,fontSize:12,padding:"6px 14px",borderColor:!filtre?C.orange:C.grayMid,color:!filtre?C.orange:C.grayText}}>Tous</button>
          {joueurs.map(j=>(
            <button key={j.id} onClick={()=>setFiltre(filtre===j.id?null:j.id)} style={{...s.btnGhost,fontSize:12,padding:"6px 14px",borderColor:filtre===j.id?C.orange:C.grayMid,color:filtre===j.id?C.orange:C.grayText}}>
              {j.prenom} {j.nom}
            </button>
          ))}
        </div>
      )}

      {filtered.length===0&&<div style={s.empty}>Aucun repas partagé pour l'instant</div>}

      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {filtered.map(r=>(
          <div key={r.id} style={{...s.card,padding:0,overflow:"hidden"}}>
            <div style={{padding:"16px 18px 14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div>
                  <span style={s.badge(C.orange)}>{r.repas}</span>
                  <span style={{...s.badge(C.grayText),marginLeft:6}}>{r.joueur}</span>
                  <div style={{fontSize:12,color:C.grayText,marginTop:4}}>{new Date(r.date+"T00:00:00").toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})}</div>
                </div>
                {r.note&&(
                  <div style={{textAlign:"center"}}>
                    <div style={{fontSize:24}}>{noteEmoji(r.note)}</div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:20,color:noteColor(r.note)}}>{r.note}/5</div>
                  </div>
                )}
              </div>

              {/* Photo placeholder */}
              <div style={{width:"100%",height:160,background:`linear-gradient(135deg,${C.gray},${C.grayMid})`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12,fontSize:40}}>
                🍽️
              </div>

              <div style={{fontSize:14,lineHeight:1.6,color:C.black}}>{r.description}</div>

              {r.commentCoach&&(
                <div style={{marginTop:12,padding:12,background:`${C.orange}10`,borderRadius:8,borderLeft:`3px solid ${C.orange}`}}>
                  <div style={{fontSize:11,fontWeight:700,color:C.orange,marginBottom:4}}>COMMENTAIRE COACH</div>
                  <div style={{fontSize:13}}>{r.commentCoach}</div>
                </div>
              )}
              {r.conseil&&(
                <div style={{marginTop:8,padding:12,background:"#f0fdf4",borderRadius:8,borderLeft:`3px solid ${C.green}`}}>
                  <div style={{fontSize:11,fontWeight:700,color:C.green,marginBottom:4}}>💡 CONSEIL NUTRITIONNEL</div>
                  <div style={{fontSize:13}}>{r.conseil}</div>
                </div>
              )}
            </div>

            {role==="coach"&&(
              <div style={{borderTop:`1px solid ${C.grayMid}`,padding:"10px 18px"}}>
                <button style={{...s.btnGhost,fontSize:13}} onClick={()=>{setCommentModal(r);setCommentForm({note:r.note||null,commentCoach:r.commentCoach||"",conseil:r.conseil||""});}}>
                  ✍️ {r.commentCoach?"Modifier le feedback":"Donner un feedback"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal partager repas */}
      {modal&&(
        <div style={s.overlay} onClick={()=>setModal(false)}>
          <div style={s.modal} className="slideUp" onClick={e=>e.stopPropagation()}>
            <div style={s.modalTitle}>🥗 Partager un repas</div>
            <div style={{marginTop:14}}>
              {role==="coach"&&(
                <>
                  <div style={s.label}>Joueur</div>
                  <select style={s.select} value={form.joueurId} onChange={e=>setForm(f=>({...f,joueurId:e.target.value}))}>
                    {joueurs.map(j=><option key={j.id} value={j.id}>{j.prenom} {j.nom}</option>)}
                  </select>
                </>
              )}
              <div style={s.label}>Type de repas</div>
              <select style={s.select} value={form.repas} onChange={e=>setForm(f=>({...f,repas:e.target.value}))}>
                {REPAS_TYPES.map(r=><option key={r}>{r}</option>)}
              </select>
              <div style={s.label}>Description du repas</div>
              <textarea style={s.textarea} placeholder="Ex: Riz complet, blanc de poulet, haricots verts, 1 yaourt grec..." value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>
              <div style={{marginTop:14,padding:14,background:C.gray,borderRadius:10,textAlign:"center",color:C.grayText,fontSize:13,cursor:"pointer"}} onClick={()=>showToast("Upload photo bientôt disponible")}>
                📸 Ajouter une photo (bientôt disponible)
              </div>
            </div>
            <div style={{display:"flex",gap:10,marginTop:18}}>
              <button style={s.btnGhost} onClick={()=>setModal(false)}>Annuler</button>
              <button style={{...s.btnOrange,flex:1,opacity:!form.description?.5:1}} onClick={addRepas} disabled={!form.description}>Partager</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal feedback coach */}
      {commentModal&&(
        <div style={s.overlay} onClick={()=>setCommentModal(null)}>
          <div style={s.modal} className="slideUp" onClick={e=>e.stopPropagation()}>
            <div style={s.modalTitle}>✍️ Feedback coach</div>
            <div style={{color:C.grayText,fontSize:13,marginBottom:14}}>{commentModal.joueur} · {commentModal.repas} · {commentModal.description}</div>

            <div style={s.label}>Note (1 à 5)</div>
            <div style={{display:"flex",gap:10,marginBottom:14}}>
              {NOTES.map(n=>(
                <button key={n} onClick={()=>setCommentForm(f=>({...f,note:n}))} style={{
                  width:44,height:44,borderRadius:"50%",border:`2px solid ${commentForm.note===n?noteColor(n):C.grayMid}`,
                  background:commentForm.note===n?noteColor(n)+"15":C.white,
                  fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,
                  color:commentForm.note===n?noteColor(n):C.grayText,cursor:"pointer"
                }}>{n}</button>
              ))}
            </div>

            <div style={s.label}>Commentaire</div>
            <textarea style={s.textarea} placeholder="Votre commentaire sur ce repas..." value={commentForm.commentCoach} onChange={e=>setCommentForm(f=>({...f,commentCoach:e.target.value}))}/>

            <div style={s.label}>Conseil nutritionnel</div>
            <textarea style={{...s.textarea,borderColor:"#bbf7d0"}} placeholder="Ex: Pense à augmenter les glucides avant l'entraînement..." value={commentForm.conseil} onChange={e=>setCommentForm(f=>({...f,conseil:e.target.value}))}/>

            <div style={{display:"flex",gap:10,marginTop:18}}>
              <button style={s.btnGhost} onClick={()=>setCommentModal(null)}>Annuler</button>
              <button style={{...s.btnOrange,flex:1}} onClick={saveComment}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
