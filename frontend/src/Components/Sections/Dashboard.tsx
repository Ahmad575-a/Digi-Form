// Dashboard.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import "../Styles/Dashboard.css";
import { useAuth } from "../Config/AuthContext";

type DocItem = {
  id: string;
  title: string;
  description?: string;
  filename: string;
  url: string; // für Dev am besten relativ (damit Vite-Proxy greifen kann), z.B. /docs/... oder /api/docs/...
  updatedAt: string;
};

type ApiUser = {
  id: number;
  username: string;
  email: string;
  role: string; // "schüler" | "lehrer" | ...
  class_name: string;
  phone: string;
  of_legal_age: boolean;
};

// ✅ Dokumente nach deinem Screenshot (Titel) + sinnvolle Dateinamen
const schoolDocs: DocItem[] = [
  {
    id: "1",
    title: "Schülerinformationen",
    filename: "schuelerinformationen.pdf",
    description: "PDF · Informationen für Schüler:innen",
    url: "/docs/schuelerinformationen.pdf",
    updatedAt: "2026-02-01",
  },
  {
    id: "2",
    title: "Allgemeine Prüfungsordnung Berufskolleg",
    filename: "pruefungsordnung-berufskolleg.pdf",
    description: "PDF · APO-BK",
    url: "/docs/pruefungsordnung-berufskolleg.pdf",
    updatedAt: "2026-02-01",
  },
  {
    id: "3",
    title: "Regelungen im Schulgesetz für Nordrhein-Westfalen",
    filename: "schulgesetz-nrw.pdf",
    description: "PDF · SchulG NRW",
    url: "/docs/schulgesetz-nrw.pdf",
    updatedAt: "2026-02-01",
  },
  {
    id: "4",
    title: "Hausordnung",
    filename: "hausordnung.pdf",
    description: "PDF · Schulische Hausordnung",
    url: "/docs/hausordnung.pdf",
    updatedAt: "2026-02-01",
  },
  {
    id: "5",
    title: "Einwilligung zur Verwendung von Lichtbildern (Fotos)",
    filename: "einwilligung-fotos.pdf",
    description: "PDF · Datenschutz/DSGVO",
    url: "/docs/einwilligung-fotos.pdf",
    updatedAt: "2026-02-01",
  },
  {
    id: "6",
    title: "Sicherheitsunterweisung",
    filename: "sicherheitsunterweisung.pdf",
    description: "PDF · Belehrung",
    url: "/docs/sicherheitsunterweisung.pdf",
    updatedAt: "2026-02-01",
  },
  {
    id: "7",
    title: "Nutzungsordnung für schulische Computereinrichtungen",
    filename: "nutzungsordnung-computer.pdf",
    description: "PDF · IT-Nutzung",
    url: "/docs/nutzungsordnung-computer.pdf",
    updatedAt: "2026-02-01",
  },
  {
    id: "8",
    title: "Datenlöschung nach Beendigung des Schulbesuchs",
    filename: "datenloeschung-schulende.pdf",
    description: "PDF · Datenschutz",
    url: "/docs/datenloeschung-schulende.pdf",
    updatedAt: "2026-02-01",
  },
  {
    id: "9",
    title: "Nutzung von Plattformen im Internet",
    filename: "nutzung-internetplattformen.pdf",
    description: "PDF · Online-Plattformen",
    url: "/docs/nutzung-internetplattformen.pdf",
    updatedAt: "2026-02-01",
  },
  {
    id: "10",
    title: "Nutzung NetAcad, Skills4All und BiBox",
    filename: "nutzung-netacad-skills4all-bibox.pdf",
    description: "PDF · Lernplattformen",
    url: "/docs/nutzung-netacad-skills4all-bibox.pdf",
    updatedAt: "2026-02-01",
  },
  {
    id: "11",
    title: "Zusätzliche Infos zur Schule",
    filename: "zusaetzliche-infos-schule.pdf",
    description: "PDF · Sonstiges",
    url: "/docs/zusaetzliche-infos-schule.pdf",
    updatedAt: "2026-02-01",
  },
];

// ✅ Axios Instanz: bewusst ohne baseURL, damit Vite-Proxy (/api → :8000) genutzt werden kann
// (Wenn du KEIN Proxy nutzt, dann baseURL auf "http://localhost:8000" setzen UND CORS korrekt konfigurieren.)
const api = axios.create({
  baseURL: "",
  headers: { Accept: "application/json" },
});

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

async function downloadViaAxios(url: string, filename: string) {
  const res = await api.get(url, { responseType: "blob" });
  const blob = res.data as Blob;

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}

function getAccessTokenFromAuth(auth: any): string | null {
  // ✅ robust: unterstützt unterschiedliche AuthContext-Implementationen
  // - auth.access
  // - auth.accessToken
  // - auth.token
  // - auth.tokens.access
  return (
    auth?.access ??
    auth?.accessToken ??
    auth?.token ??
    auth?.tokens?.access ??
    null
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const auth = useAuth();

  const accessToken = getAccessTokenFromAuth(auth);

  const [search, setSearch] = useState("");
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoadingUser(true);
        setUserError(null);

        // ✅ Wenn kein JWT vorhanden, zurück zur Anmeldung
        if (!accessToken) {
          navigate("/login");
          return;
        }

        // ✅ User laden mit Bearer Token (JWT)
        const res = await api.get<ApiUser>("/api/auth/user/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!mounted) return;
        setUser(res.data);
      } catch (e) {
        if (!mounted) return;

        const err = e as AxiosError<any>;
        const status = err.response?.status;

        if (status === 401) {
          setUserError("Nicht angemeldet oder Token abgelaufen (401).");
          navigate("/login");
        } else if (status === 404) {
          setUserError("Endpoint /api/auth/user/ nicht gefunden (404).");
        } else {
          setUserError(
            err.response?.data?.detail ||
              err.message ||
              "Fehler beim Laden des Profils.",
          );
        }
      } finally {
        if (!mounted) return;
        setLoadingUser(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [accessToken, navigate]);

  const filteredDocs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return schoolDocs;
    return schoolDocs.filter((d) =>
      `${d.title} ${d.description ?? ""} ${d.filename}`
        .toLowerCase()
        .includes(q),
    );
  }, [search]);

  const initials =
    user?.username?.slice(0, 2).toUpperCase() ??
    user?.email?.slice(0, 2).toUpperCase() ??
    "??";

  return (
    <div className="df-page">
      <main className="df-main">
        <div className="df-headline">
          <h1 className="df-title">Dashboard</h1>
          <p className="df-subtitle">Dokumente & Profildaten</p>
        </div>

        <div className="df-grid">
          {/* Dokumente */}
          <section className="df-card">
            <div className="df-card-header">
              <div>
                <h2 className="df-h2">Dokumente</h2>
                <div className="df-muted">Ansehen oder herunterladen.</div>
              </div>

              <input
                className="df-input"
                placeholder="Suchen…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Dokumente suchen"
              />
            </div>

            <div className="df-list">
              {filteredDocs.length === 0 ? (
                <div className="df-empty">Keine Dokumente gefunden.</div>
              ) : (
                filteredDocs.map((doc) => (
                  <div className="df-doc-row" key={doc.id}>
                    <div className="df-doc-left">
                      <div className="df-doc-title">{doc.title}</div>
                      <div className="df-doc-meta">
                        <span className="df-pill">
                          {doc.description ?? "Dokument"}
                        </span>
                        <span className="df-meta">Datei: {doc.filename}</span>
                        <span className="df-meta">
                          Update: {formatDate(doc.updatedAt)}
                        </span>
                      </div>
                    </div>

                    <div className="df-actions">
                      <a
                        className="df-btn ghost"
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Ansehen
                      </a>

                      <button
                        className="df-btn primary"
                        type="button"
                        disabled={downloadingId === doc.id}
                        onClick={async () => {
                          try {
                            setDownloadingId(doc.id);

                            // Wenn deine /docs/* Dateien direkt über den Webserver erreichbar sind,
                            // könntest du statt axios einfach <a download> nutzen.
                            // Hier bleibt es bewusst einheitlich über axios.
                            await downloadViaAxios(doc.url, doc.filename);
                          } catch (e) {
                            const err = e as AxiosError<any>;
                            const status = err.response?.status;
                            alert(
                              status
                                ? `Download fehlgeschlagen (${status}).`
                                : "Download fehlgeschlagen.",
                            );
                          } finally {
                            setDownloadingId(null);
                          }
                        }}
                      >
                        {downloadingId === doc.id ? "Lade…" : "Download"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Profil */}
          <section className="df-card">
            <div className="df-card-header small">
              <div>
                <h2 className="df-h2">Profil</h2>
                <div className="df-muted">Aus deinem Account geladen.</div>
              </div>

              <button
                className="df-btn ghost"
                type="button"
                onClick={async () => {
                  try {
                    setLoadingUser(true);
                    setUserError(null);

                    if (!accessToken) {
                      navigate("/login");
                      return;
                    }

                    const res = await api.get<ApiUser>("/api/auth/user/", {
                      headers: { Authorization: `Bearer ${accessToken}` },
                    });

                    setUser(res.data);
                  } catch (e) {
                    const err = e as AxiosError<any>;
                    const status = err.response?.status;
                    if (status === 401) {
                      setUserError(
                        "Nicht angemeldet oder Token abgelaufen (401).",
                      );
                      navigate("/login");
                    } else if (status === 404) {
                      setUserError(
                        "Endpoint /api/auth/user/ nicht gefunden (404).",
                      );
                    } else {
                      setUserError(
                        err.response?.data?.detail ||
                          err.message ||
                          "Fehler beim Laden des Profils.",
                      );
                    }
                  } finally {
                    setLoadingUser(false);
                  }
                }}
              >
                Aktualisieren
              </button>
            </div>

            <div className="df-profile">
              <div className="df-avatar" aria-hidden>
                {loadingUser ? "…" : initials}
              </div>

              {loadingUser ? (
                <div className="df-loading">Profil wird geladen…</div>
              ) : userError ? (
                <div className="df-error">{userError}</div>
              ) : user ? (
                <>
                  <div className="df-profile-row">
                    <span>Username</span>
                    <span>{user.username}</span>
                  </div>
                  <div className="df-profile-row">
                    <span>E-Mail</span>
                    <span>{user.email}</span>
                  </div>
                  <div className="df-profile-row">
                    <span>Rolle</span>
                    <span>{user.role}</span>
                  </div>
                  <div className="df-profile-row">
                    <span>Klasse</span>
                    <span>{user.class_name || "—"}</span>
                  </div>
                  <div className="df-profile-row">
                    <span>Telefon</span>
                    <span>{user.phone || "—"}</span>
                  </div>
                  <div className="df-profile-row">
                    <span>Volljährig</span>
                    <span>{user.of_legal_age ? "Ja" : "Nein"}</span>
                  </div>
                </>
              ) : (
                <div className="df-empty">Keine Profildaten.</div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
