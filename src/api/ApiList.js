// export const BASE_URL = "https://glorypos.com/gs-server";
export const BASE_URL = "http://localhost:3000";

export const GAME_SITE = "https://gamestar365.com";

export const Image_BASE_URL = "https://glorypos.com/image-upload";
export const SINGLE_IMAGE_UPLOAD_URL = `${Image_BASE_URL}/upload`;
export const MULTIPLE_IMAGE_UPLOAD_URL = `${Image_BASE_URL}/uploads`;

export const API_LIST = {
  LOGIN: `/api/admin/login`,
  REGISTER: `/api/admin/registration`,
  CREATE_ADMIN: `/api/admin/create-admin`,
  LOGOUT: `/api/admin/logout`,
  GET_PROFILE: `/api/admin/profile`,
  GET_ADMIN_LIST: `/api/admin/admins`,
  GET_ADMIN_DETAILS: `/api/admin/details`,
  UPDATE_ADMIN: `/api/admin/update`,
  DELETE_ADMIN: `/api/admin/delete`,
  // players
  GET_PLAYERS: "/api/admin/players",

  // Players
  REGISTER_PLAYERS: "/api/users/register",
  EDIT_PLAYERS: "/api/users/update",
  DELETE_PLAYERS: "/api/users/delete",
  GET_PLAYER_PROFILE: "/api/admin/players/:playerID/profile",
  // Agent list
  CREATE_AGENT: "/api/admin/create-agent",
  AGENT_LIST: "/api/admin/agents",
  AFFILIATE_LIST: "/api/admin/affiliates",
  AFFILIATE_PROFILE: "/api/admin/affiliates",
  GET_SUB_AFFILIATES: "/sub-affiliates-list",
  GET_PLAYERS_LIST: "/players-list",
  UPDATE_AGENT: "/api/admin/agent/update",
  DELETE_AGENT: "/api/admin/agent/delete",

  // Countries, Currencies, and Languages
  GET_CURRENCIES: "/api/countries/currencies",
  GET_LANGUAGES: "/api/countries/languages",
  GET_COUNTRIES: "/api/countries",
  ASSIGN_COUNTRY_LANGUAGES: "/api/countries/assign-country-languages",
  UPDATE_LANGUAGE_STATUS: "/api/countries/update-language-status",
  UPDATE_COUNTRY_LANGUAGE: "/api/countries/update-country-language",
  UPDATE_COUNTRY_STATUS: "/api/countries/update-country-status",

  // configuration
  CREATE_DROPDOWN: "/api/admin/create-dropdowns",
  GET_DROPDOWN: "/api/admin/get-dropdowns",
  UPDATE_DROPDOWN_OPTION: "/api/admin/update-dropdown-option-status",
  DELETE_DROPDOWN_OPTION: "/api/admin/dropdown",

  // promotions
  CREATE_PROMOTION: "/api/admin/promotion",
  UPDATE_PROMOTION: "/api/admin/promotion",
  GET_PROMOTION: "/api/admin/promotions",

  // CMS
  CREATE_UPDATE_BANNER: "/api/admin/banner",
  CREATE_UPDATE_EVENT: "/api/admin/event",
  GET_EVENT: "/api/admin/events",
  GET_BANNER: "/api/admin/get-banner",
  CREATE_UPDATE_ANNOUNCEMENT: "/api/admin/announcement",
  GET_ANNOUNCEMENT: "/api/admin/get-announcements",
  DELETE_ANNOUNCEMENT: "/api/admin/delete-announcement",
  CREATE_UPDATE_POPUP: "/api/admin/website-popup",
  GET_POPUP: "/api/admin/get-website-popups",
  DELETE_POPUP: "/api/admin/delete-popup",
  CREATE_UPDATE_ADVERTISEMENT: "/api/admin/create-update-advertisement",
  GET_ADVERTISEMENT: "/api/admin/get-advertisement",
  DELETE_ADVERTISEMENT: "/api/admin/delete-advertisement",
  CREATE_UPDATE_SPONSOR: "/api/admin/create-update-sponsor",
  GET_SPONSOR: "/api/admin/get-sponsors",
  DELETE_SPONSOR: "/api/admin/delete-sponsor",
  CREATE_UPDATE_AMBASSADOR: "/api/admin/create-update-ambassador",
  GET_AMBASSADOR: "/api/admin/get-ambassadors",
  DELETE_AMBASSADOR: "/api/admin/delete-ambassador",
  CREATE_UPDATE_GAMING_LICENSE: "/api/admin/create-update-gaming-license",
  GET_GAMING_LICENSE: "/api/admin/get-gaming-licenses",
  DELETE_GAMING_LICENSE: "/api/admin/delete-gaming-license",
  CREATE_UPDATE_RESPONSIBLE_GAMING:
    "/api/admin/create-update-responsible-gaming",
  GET_RESPONSIBLE_GAMING: "/api/admin/get-responsible-gamings",
  DELETE_RESPONSIBLE_GAMING: "/api/admin/delete-responsible-gaming",

  // gaming provider
  GET_GAME_PROVIDER: "/api/admin/game-providers",
  CREATE_GAME_PROVIDER: "/api/admin/game-provider",

  // game
  CREATE_UPDATE_GAME: "/api/admin/add-update-game",
  GET_GAMES: "/api/admin/games",

  // SPORTS provider
  GET_SPORT_PROVIDER: "/api/admin/sport-providers",
  CREATE_SPORT_PROVIDER: "/api/admin/sport-provider",

  // SPORTS
  CREATE_UPDATE_SPORT: "/api/admin/add-update-sport",
  GET_SPORTS: "/api/admin/sports",

  // Payment Methods
  PAYMENT_METHOD: "/api/payment-method",
  UPDATE_PAYMENT_METHOD: "/api/payment-method/update",
  DELETE_PAYMENT_METHOD: "/api/payment-method/delete",

  // Payment Method Types
  PAYMENT_METHOD_TYPES: "/api/payment-method-types",
  UPDATE_PAYMENT_METHOD_TYPES: "/api/payment-method-types/update",
  DELETE_PAYMENT_METHOD_TYPES: "/api/payment-method-types/delete",

  // Payment Gateways
  PAYMENT_GATEWAY: "/api/payment-gateways",
  UPDATE_PAYMENT_GATEWAY: "/api/payment-gateways/update",
  DELETE_PAYMENT_GATEWAY: "/api/payment-gateways/delete",

  // Payment Providers
  PAYMENT_PROVIDER: "/api/payment-providers",
  UPDATE_PAYMENT_PROVIDER: "/api/payment-providers/update",
  DELETE_PAYMENT_PROVIDER: "/api/payment-providers/delete",

  // Gateway Providers
  GATEWAY_PROVIDER: "/api/gateway-providers",
  GATEWAY_PROVIDER_BY_GATEWAY: "/api/gateway-providers/gateway",
  GATEWAY_PROVIDER_BY_PROVIDER: "/api/gateway-providers/provider",
  UPDATE_GATEWAY_PROVIDER_PRIORITY: "/api/gateway-providers",
  UPDATE_GATEWAY_PROVIDER_RECOMMENDATION: "/api/gateway-providers",
  UPDATE_GATEWAY_PROVIDER_STATUS: "/api/gateway-providers",
  DELETE_PROVIDER_FROM_GATEWAY:
    "/api/gateway-providers/delete-provider-from-gateway",
  GATEWAY_ACCOUNTS: "/api/gateway-provider-accounts",
  GATEWAY_ACCOUNTS_BY_PROVIDER_GATEWAY:
    "/api/gateway-provider-accounts/provider",
  PAYMENT_TRANSACTION: "/api/transactions",

  // Settings
  GET_SETTINGS: "/api/settings",
  UPDATE_SETTINGS: "/api/settings/update",

  // Bet Results
  GET_BET_RESULTS: "/api/bet-results",
  // Bet Results Rankings
  GET_PLAYER_RANKINGS: "/api/bet-results/rankings/players",

  // Games
  GET_ALL_GAMES: "/api/games/games",

  // Users
  GET_ALL_USERS: "/api/users",
};

export const DROPDOWN_ID = {
  PROMOTION_TYPE: "1",
};
