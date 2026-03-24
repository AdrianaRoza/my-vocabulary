import Keycloak from "keycloak-js"

// Variáveis lidas do ambiente para montar a configuração do Keycloak.
const KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_URL
const REALM = import.meta.env.VITE_REALM
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID

if (!KEYCLOAK_URL || !REALM || !CLIENT_ID) {
  throw new Error("Missing Keycloak env vars: VITE_KEYCLOAK_URL, VITE_REALM or VITE_CLIENT_ID")
}

const keycloakConfig = {
  url: KEYCLOAK_URL,
  realm: REALM,
  clientId: CLIENT_ID
}

// Instância única de autenticação usada em toda a aplicação.
const kc = new Keycloak(keycloakConfig)

export default kc
