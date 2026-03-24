import { useCallback, useEffect, useRef, useState } from "react"
import { Outlet } from "react-router-dom"
import LoadingScreen from "../components/LoadingScreen"
import kc from "../service/keycloak"
import useAuthStore from "../store/useAuthStore"

// Configurações de expiração e renovação da sessão.
const IDLE_TIMEOUT_MINUTES = 15 // tempo de inatividade permitido
const RENEW_INTERVAL_MS = 30_000 // checagem a cada 30s
const MIN_TOKEN_VALIDITY = 60 // renovar se faltar menos de 60s

const ProtectedRoutes = () => {
  const { login, setLoading } = useAuthStore()
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [isIdle, setIsIdle] = useState(false)

  // Evita que o Keycloak seja inicializado mais de uma vez.
  const initialized = useRef(false)

  // Centraliza o logout para reaproveitar a mesma regra em todos os cenários.
  const doLogout = useCallback(() => {
    console.warn("Encerrando sessão...")
    kc.logout({ redirectUri: window.location.origin })
  }, [])

  // Inicializa a autenticação e hidrata a store com os dados do usuário.
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    kc.init({
      onLoad: "check-sso",
      checkLoginIframe: false,
      pkceMethod: "S256",
    })
      .then((auth) => {
        setAuthenticated(auth)

        if (!auth) {
          kc.login({ redirectUri: window.location.origin })
          return
        }

        if (kc.token) {
          console.log('---kc.token----', kc.tokenParsed?.sub)
          login(
            {
              name: kc.tokenParsed?.given_name || "",
              id: kc.tokenParsed?.sub
            },
            kc.token
          )
        }

        setLoading(false)

        // Se o token expirar, a aplicação tenta renovar antes de encerrar a sessão.
        kc.onTokenExpired = () => {
          console.log("Token expired, attempting refresh...")
          kc.updateToken(30).catch(() => {
            console.error("Failed to refresh token, redirecting to login...")
            doLogout()
          })
        }
      })
      .catch((error) => {
        console.error("Authentication Failed", error)
        setAuthenticated(false)
      })
  }, [doLogout, login, setLoading])

  // Monitora a atividade do usuário para derrubar sessões ociosas.
  useEffect(() => {
    let idleTimer: number

    const resetIdleTimer = () => {
      if (isIdle) {
        console.log("Usuário voltou a interagir, retomando renovação automática.")
      }
      setIsIdle(false)
      clearTimeout(idleTimer)
      idleTimer = window.setTimeout(() => {
        console.warn("Usuário inativo por muito tempo, sessão encerrada.")
        setIsIdle(true)
        doLogout()
      }, IDLE_TIMEOUT_MINUTES * 60 * 1000)
    }

    window.addEventListener("mousemove", resetIdleTimer)
    window.addEventListener("keydown", resetIdleTimer)
    resetIdleTimer()

    return () => {
      clearTimeout(idleTimer)
      window.removeEventListener("mousemove", resetIdleTimer)
      window.removeEventListener("keydown", resetIdleTimer)
    }
  }, [doLogout, isIdle])

  // Renova o token periodicamente enquanto a sessão estiver ativa.
  useEffect(() => {
    if (!authenticated) return

    const intervalId = window.setInterval(() => {
      if (isIdle) return
      kc.updateToken(MIN_TOKEN_VALIDITY).catch(() => {
        console.error("Token refresh failed, logging out...")
        doLogout()
      })
    }, RENEW_INTERVAL_MS)

    return () => clearInterval(intervalId)
  }, [authenticated, doLogout, isIdle])

  if (authenticated === null) {
    return (
      <LoadingScreen 
        title="Quase lá..."
        content="Aguarde enquanto validamos seu acesso"
      />
    )
  }

  if (!authenticated) {
    return <p>Erro ao conectar com o servidor de autenticação.</p>
  }

  return <Outlet />
}

export default ProtectedRoutes
