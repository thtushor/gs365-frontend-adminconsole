export const BASE_URL = "https://api.gamestar365.com";
export const SOCKET_BASE_URL = "https://api.gamestar365.com";
// export const BASE_URL = "http://localhost:3000";
// export const SOCKET_BASE_URL = "http://localhost:3000";

export const GAME_SITE = "https://gamestar365.com";

export const Image_BASE_URL = "https://api.gamestar365.com/image-upload";
export const SINGLE_IMAGE_UPLOAD_URL = `${Image_BASE_URL}/upload`;
export const MULTIPLE_IMAGE_UPLOAD_URL = `${Image_BASE_URL}/uploads`;

export const API_LIST = {
  DASHBOARD: "/api/dashboard",
  GAME_STATS: "/api/game-stats",
  LOGIN: `/api/admin/login`,
  REGISTER: `/api/admin/registration`,
  CREATE_ADMIN: `/api/admin/create-admin`,
  LOGOUT: `/api/admin/logout`,
  GET_PROFILE: `/api/admin/profile`,
  GET_ADMIN_LIST: `/api/admin/admins`,
  GET_ADMIN_DETAILS: `/api/admin/details`,
  UPDATE_ADMIN: `/api/admin/update`,
  DELETE_ADMIN: `/api/admin/delete`,
  VERIFY_OTP: `/api/admin/verify-otp`,
  RESEND_OTP: `/api/admin/resend-otp`,
  FORGOT_PASSWORD: `/api/admin/forgot-password`,
  RESET_PASSWORD: `/api/admin/reset-password`,
  // players
  GET_PLAYERS: "/api/admin/players",
  // GET_PLAYER_DETAILS:"/api/admin/player",
  GET_PLAYERS_TURNOVER: "/api/turnover",

  // Players
  REGISTER_PLAYERS: "/api/users/register",
  EDIT_PLAYERS: "/api/users/update",
  DELETE_PLAYERS: "/api/users/delete",
  GET_PLAYER_PROFILE: "/api/admin/players/:playerID/profile",
  GET_PLAYER_LOGIN_HISTORY: "/api/user-login-history/user/:playerId",
  // Agent list
  CREATE_AGENT: "/api/admin/create-agent",
  AGENT_LIST: "/api/admin/agents",
  AFFILIATE_LIST: "/api/admin/affiliates",
  AFFILIATE_COMMISSION_LIST: "/api/commissions",
  GET_TOTAL_COMMISSION: "/api/commissions/total-commission",
  CREATE_AFFILIATE_WITHDRAW: "/api/transactions/affiliate-withdraw",
  AFFILIATE_PROFILE: "/api/admin/affiliates",
  GET_SUB_AFFILIATES: "/sub-affiliates-list",
  GET_DETAILS_BY_REFER_CODE: "/api/admin/details-by-referer",
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
  CREATE_OR_UPDATE_CONVERSION: "/api/admin/currency-rate",
  CURRENCY_LIST: "/api/admin/currency-rate",
  DELETE_CONVERSION: "/api/admin/delete-currency",

  // configuration
  CREATE_DROPDOWN: "/api/admin/create-dropdowns",
  GET_DROPDOWN: "/api/admin/get-dropdowns",
  UPDATE_DROPDOWN_OPTION: "/api/admin/update-dropdown-option-status",
  DELETE_DROPDOWN_OPTION: "/api/admin/dropdown",
  GET_ALL_MENUS: "/api/admin/menu-list",
  UPDATE_MENU_PRIORITY: "/api/admin/update-menu-priority",

  // promotions
  CREATE_PROMOTION: "/api/admin/promotion",
  UPDATE_PROMOTION: "/api/admin/promotion",
  GET_PROMOTION: "/api/admin/promotions",
  GET_PUBLIC_PROMOTION: "/api/public/promotions",

  // CMS
  CREATE_UPDATE_BANNER: "/api/admin/banner",
  CREATE_UPDATE_EVENT: "/api/admin/event",
  GET_EVENT: "/api/admin/events",
  CREATE_UPDATE_SOCIAL: "/api/admin/social-media",
  GET_SOCIAL: "/api/admin/social-media",
  CREATE_FEATURED_GAME: "/api/admin/featured-games",
  GET_FEATURED_GAME: "/api/admin/featured-games",
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

  // notifications
  CREATE_NOTIFICATION: "/api/admin/notifications",
  GET_NOTIFICATION: "/api/admin/notifications",
  UPDATE_NOTIFICATION_STATUS: "/api/admin/id/status",

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

  // faqs
  CREATE_UPDATE_FAQ: "/api/admin/create-update-faq",
  GET_FAQS: "/api/admin/get-faqs",
  DELETE_FAQS: "/api/admin/delete-faq",

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
  DEPOSIT_TRANSACTION: "/api/transactions/deposit",
  WITHDRAW_TRANSACTION: "/api/transactions/affiliate-withdraw",
  PLAYER_WITHDRAW_TRANSACTION: "/api/transactions/withdraw",

  // Admin Main Balance
  ADMIN_MAIN_BALANCE: "/api/admin-main-balance",

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

  // User Phones
  CREATE_USER_PHONE: "/api/user-phones",
  GET_USER_PHONES_BY_USER: "/api/user-phones/user/:userId",
  UPDATE_USER_PHONE: "/api/user-phones/update",
  DELETE_USER_PHONE: "/api/user-phones/delete",

  // KYC
  SUBMIT_KYC: "/api/admin/create-update-kyc",
  GET_ALL_KYC: "/api/admin/kyc",
  UPDATE_KYC_STATUS: "/api/admin/update-kyc-status",
  SEND_KYC_REQUEST: "/api/admin/send-kyc-verification-request",

  // Withdrawal Payment Accounts
  GET_WITHDRAWAL_PAYMENT_ACCOUNTS: "/api/withdrawal-payment-accounts",
  CREATE_WITHDRAWAL_PAYMENT_ACCOUNT: "/api/withdrawal-payment-accounts",
  GET_WITHDRAWAL_PAYMENT_ACCOUNT: "/api/withdrawal-payment-accounts",
  UPDATE_WITHDRAWAL_PAYMENT_ACCOUNT: "/api/withdrawal-payment-accounts",
  DELETE_WITHDRAWAL_PAYMENT_ACCOUNT: "/api/withdrawal-payment-accounts",
  GET_USER_WITHDRAWAL_PAYMENT_ACCOUNTS: "/api/withdrawal-payment-accounts/user",
  GET_USER_PRIMARY_ACCOUNT: "/api/withdrawal-payment-accounts/user",
  DEACTIVATE_ACCOUNT: "/api/withdrawal-payment-accounts",
  SET_PRIMARY_ACCOUNT: "/api/withdrawal-payment-accounts",
  UPDATE_VERIFICATION_STATUS: "/api/withdrawal-payment-accounts",
  GET_ACCOUNT_STATISTICS: "/api/withdrawal-payment-accounts/stats",
  // Permission
  PERMISSION: "/api/designations",
  CREATE_CHAT: "/api/chats",
  GET_MESSAGES: "/api/messages/chat", // Will append chatId
  SEND_MESSAGE: "/api/messages/send-message",
  READ_MESSAGES: "/api/messages/read", // Will append chatId
  ADMIN_USER_MESSAGES: "/api/messages/user-admin",
  DATABASE_BACKUP: "/api/database/backup",
  DATABASE_RESTORE: "/api/database/restore",
  DATABASE_BACKUP_FILES: "/api/database/backup-files",
  DATABASE_DOWNLOAD_BACKUP_FILES: "/api/database/download-backup",
  DATABASE_DELETE_FILES: "/api/database/delete-backup",
  DATABASE_DELETE_TABLES: "/api/database/drop-all-tables",
};

export const DROPDOWN_ID = {
  PROMOTION_TYPE: "1",
};
