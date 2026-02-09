import React, { Children } from "react";
import {
  FaUserFriends,
  FaMoneyCheckAlt,
  FaListUl,
  FaUserPlus,
  FaUsers,
  FaCreditCard,
  FaCogs,
  FaDatabase,
  FaShieldAlt,
  FaGlobe,
  FaHistory,
} from "react-icons/fa";
import { RxColorWheel } from "react-icons/rx";

import { FaMoneyBills, FaPeopleRobbery } from "react-icons/fa6";
import { PiContactlessPayment } from "react-icons/pi";
import { CgDisplayFlex, CgDisplayFullwidth, CgMediaLive } from "react-icons/cg";

import Dashboard from "../components/Dashboard";
import PlayerListPage from "../components/PlayerListPage";
import PlayerProfile from "../components/PlayerProfile";
import PlayerPaymentsPage from "../components/PlayerPaymentsPage";
import PlayerTransactionsPage from "../components/PlayerTransactionsPage";
import BettingWagerPage from "../components/BettingWagerPage";

import TransactionsPage from "../components/TransactionsPage";
import WinLossPage from "../components/WinLossPage";
import SystemSettingsPage from "../components/SystemSettingsPage";
import BackupRestorePage from "../components/BackupRestorePage";
import OwnerAccountControlPage from "../components/OwnerAccountControlPage";
import { BiAddToQueue, BiMessage, BiTrophy } from "react-icons/bi";
import DesignationManagementPage from "../components/DesignationManagementPage";
import { FiPercent } from "react-icons/fi";
import {
  TbGoGame,
  TbLicense,
  TbMapDiscount,
  TbMenuOrder,
} from "react-icons/tb";
import { BsCalendar2Event, BsShieldCheck } from "react-icons/bs";
import LanguageList from "../components/LanguageList";
import CreateAffiliate from "../components/CreateAffiliate";
import AffiliateListPage from "../components/AffiliateListPage";
import PlayerLoginHistoryPage from "../components/PlayerLoginHistoryPage";
import PlayerTurnoverPage from "../components/PlayerTurnoverPage";
import CountryList from "../components/CountryList";
import CurrencyList from "../components/CurrencyList";
import DropdownConfiguration from "../components/DropdownConfiguration";
import { VscGitPullRequestCreate } from "react-icons/vsc";
import {
  MdAddchart,
  MdControlCamera,
  MdCurrencyExchange,
  MdDisplaySettings,
  MdFormatListBulletedAdd,
  MdMessage,
  MdOutlineDisplaySettings,
  MdOutlinePayment,
  MdOutlineSecurity,
  MdOutlineSpaceDashboard,
} from "react-icons/md";
import CreatePromotion from "../components/CreatePromotion";
import PromotionsList from "../components/PromotionsList";
import Banner from "../components/Banner";
import Announcement from "../components/Announcement";
import Popup from "../components/Popup";
import Advertisement from "../components/Advertisement";
import Sponsor from "../components/Sponsor";
import Ambassador from "../components/Ambassador";
import GamingLicense from "../components/GamingLicense";
import ResponsibleGaming from "../components/ResponsibleGaming";
import AffiliateProfile from "../components/AffiliateProfile";
import SubAffiliatesList from "../components/SubAffiliatesList";
import PaymentMethodsPage from "../components/PaymentMethodsPage";
import PaymentMethodTypesPage from "../components/PaymentMethodTypesPage";
import PaymentGatewaysPage from "../components/PaymentGatewaysPage";
import PaymentProvidersPage from "../components/PaymentProvidersPage";
import ProviderProfilePage from "../components/ProviderProfilePage";
import GatewayManagementPage from "../components/GatewayManagementPage";
import AffiliatePlayerList from "../components/AffiliatePlayerList";
import AffiliateWithdrawHistory from "../components/AffiliateWithdrawHistory";
import AddParentProvider from "../components/AddParentProvider";
import GameProvidersList from "../components/GameProvidersList";
import AddGameProvider from "../components/AddGameProvider";
import GameProviderProfile from "../components/GameProviderProfile";
import ChildProviderList from "../components/GameProviderInner/ChildProviderList";
import DepositHistory from "../components/GameProviderInner/DepositHistory";
import GameExpenseHistory from "../components/GameProviderInner/GameExpenseHistory";
import AddOrUpdateGame from "../components/GameInner/AddOrUpdateGame";
import GameList from "../components/GameInner/GameList";
import AddSportParentProvider from "../components/SportProviderInner/AddSportParentProvider";
import AddSportProvider from "../components/SportProviderInner/AddSportProvider";
import SportProvidersList from "../components/SportProviderInner/SportProvidersList";
import AddOrUpdateSport from "../components/SportInner/AddOrUpdateSport";
import SportList from "../components/SportInner/SportList";
import SportProviderProfile from "../components/SportProviderInner/SportProviderProfile";
import SportChildProviderList from "../components/SportProviderInner/SportChildProviderList";
import SportsTransactionHistory from "../components/SportProviderInner/SportsTransactionHistory";
import ProviderWiseGameList from "../components/GameProviderInner/ProviderWiseGameList";
import SportsProviderWiseSport from "../components/SportProviderInner/SportsProviderWiseSport";
import EventList from "../components/EventList";
import AffiliateCommissionListPage from "../components/AffiliateCommissionPage";
import PlayerGamesPage from "../components/PlayerGamesPage";
import MenuManagement from "../components/MenuManagement";
import AffiliateWithdrawRequestListPage from "../components/AffiliateWithdrawRequestListPage";
import KYCVerificationPage from "../components/KYCVerificationPage";
import KYCRequestList from "../components/KYCRequestList";
import FeaturedGames from "../components/FeaturedGames";
import AdminBalancePage from "../components/AdminBalancePage";
import { IoWalletOutline } from "react-icons/io5";
import { GrAnnounce, GrGamepad, GrGlobe } from "react-icons/gr";
import { SlGameController } from "react-icons/sl";
import { LuMapPin } from "react-icons/lu";
import {
  LiaAdSolid,
  LiaHistorySolid,
  LiaLanguageSolid,
  LiaPeopleCarrySolid,
} from "react-icons/lia";
import { SiLegacygames } from "react-icons/si";
import { RiDropdownList } from "react-icons/ri";
import SocialList from "../components/SocialList";
import { FaWallet } from "react-icons/fa";
import Faqs from "../components/Faqs";
import SupportLayout from "../components/SupportPanel/SupportLayout";
import AffiliateSupportLayout from "../components/SupportPanel/AffiliateSupportLayout";
import NotificationList from "../components/Notifications";
import { HelpCenterIconWithChatsCount } from "../components/HelpCenterIcon";
import SpinBonus from "../components/SpinBonus";

export const menu = [
  {
    label: "Dashboard",
    path: "/",
    icon: <MdOutlineSpaceDashboard />,
    component: Dashboard,
    accessCategory: "DASHBOARD",
    props: {},
  },
  {
    label: "Players",
    icon: <FaUserFriends />,
    accessCategory: "PLAYER",
    children: [
      {
        label: "Player List",
        path: "/players",
        component: PlayerListPage,
        icon: <FaUserFriends />,
        accessKey: "player_view_player_list",
      },
      {
        label: "Player Transactions",
        path: "/transactions",
        component: TransactionsPage,
        icon: <FaMoneyCheckAlt />,
        accessKey: "player_view_player_transactions",
      },
      {
        label: "Login History",
        path: "/players/:playerId/login-history",
        component: PlayerLoginHistoryPage,
        icon: <LiaHistorySolid />,
        skipFromMenu: true,
        accessKey: "player_view_player_login_history",
      },
      {
        label: "Promotion History",
        path: "/players/:playerId/promotion",
        component: TransactionsPage,
        props: {
          title: "Promotion History",
          params: {
            historyType: "promotion",
          },
        },
        icon: <FaHistory />,
        skipFromMenu: true,
        accessKey: "player_view_player_promotion_history",
      },
      {
        label: "Win/Loss",
        path: "/win-loss",
        component: WinLossPage,
        accessKey: "player_view_player_win_loss",
        icon: <BiTrophy />,
      },
      {
        label: "Player Profile",
        path: "/players/:playerId/profile",
        component: PlayerProfile,
        skipFromMenu: true,
        accessKey: "player_view_player_profile",
      },
      {
        label: "Player Payments",
        path: "/players/:playerId/payments",
        component: PlayerPaymentsPage,
        skipFromMenu: true,
        accessKey: "player_view_player_payments",
      },
      {
        label: "Player Transactions",
        path: "/players/:playerId/profile/transactions",
        component: PlayerTransactionsPage,
        skipFromMenu: true,
        accessKey: "player_view_player_transactions",
      },
      {
        label: "Player Wagers",
        path: "/players/:playerId/profile/wagers",
        component: BettingWagerPage,
        skipFromMenu: true,
        accessKey: "player_view_player_wagers",
      },
      {
        label: "Player Games",
        path: "/players/:playerId/profile/games",
        component: PlayerGamesPage,
        skipFromMenu: true,
        accessKey: "player_view_player_games",
      },
      {
        label: "Player Turnover",
        path: "/players/:playerId/profile/turnover",
        component: PlayerTurnoverPage,
        skipFromMenu: true,
        accessKey: "player_view_player_turnover",
      },
      {
        label: "Betting Wager",
        path: "/betting-wager",
        component: BettingWagerPage,
        icon: <BiTrophy />,
        accessKey: "player_view_player_wagers",
      },
    ],
    // Full DB list, max winning filter, etc.
  },
  {
    label: "Help Line (Support)",
    path: "/message-chat-box",
    component: SupportLayout,
    icon: <BiMessage />,
    rightIcons: (
      <HelpCenterIconWithChatsCount userType={"admin"} iconClassName={""} />
    ),
    accessKey: "player_manage_player_chat",
  },
  {
    label: "KYC Request History",
    path: "/kyc-request-history",
    icon: <BsShieldCheck />,
    component: KYCRequestList,
    accessCategory: "KYC",
  },
  {
    label: "Notifications",
    path: "/notification-history",
    icon: <BsShieldCheck />,
    component: NotificationList,
    accessCategory: "notifications",
  },
  {
    label: "Affiliate",
    icon: <FaUsers />,
    accessCategory: "AFFILIATE",
    children: [
      {
        label: "Create Affiliate",
        path: "/create-affiliate",
        component: CreateAffiliate,
        icon: <FaUserPlus />,
        accessKey: "affiliate_create_affiliate",
        skipPermissionUsers: ["superAffiliate"], // Skip permission check for admin
        props: {},
      },
      {
        label: "Affiliate List",
        path: "/affiliate-list",
        component: AffiliateListPage,
        icon: <FaListUl />,
        accessKey: "affiliate_view_affiliate_list",
        props: {},
      },
      {
        label: "Affiliate Commissions",
        path: "/affiliate-commissions",
        component: AffiliateCommissionListPage,
        icon: <FiPercent />,
        accessKey: "affiliate_view_affiliate_commissions",
        props: {},
      },
      {
        label: "Withdraw History",
        path: "/affiliate-withdraw-requests",
        component: AffiliateWithdrawRequestListPage,
        icon: <IoWalletOutline />,
        accessKey: "affiliate_view_affiliate_withdraw_history",
        props: {},
      },
    ],
  },
  {
    label: "Promotions",
    icon: <TbMapDiscount />,
    accessCategory: "PROMOTION",
    children: [
      {
        label: "Create Promotion",
        path: "/create-promotion",
        component: CreatePromotion,
        icon: <MdAddchart />,
        accessKey: "promotion_create_promotion",
        props: {},
      },
      {
        label: "Promotion List",
        path: "/promotion-list",
        component: PromotionsList,
        icon: <FaListUl />,
        accessKey: "promotion_view_promotion_list",
        props: {},
      },
    ],
  },
  {
    label: "Spin Bonus",
    path: "/spin-bonus",
    icon: <RxColorWheel />,
    component: SpinBonus,
    accessCategory: "notifications",
  },

  {
    label: "Payment Method",
    icon: <MdOutlinePayment />,
    accessCategory: "PAYMENT",
    children: [
      {
        label: "Payment Methods",
        path: "/payment-methods",
        component: PaymentMethodsPage,
        icon: <FaCreditCard />,
        accessKey: "payment_manage_payment_methods",
      },
      {
        label: "Payment Method Types",
        path: "/payment-method-types",
        component: PaymentMethodTypesPage,
        icon: <FaMoneyBills />,
        accessKey: "payment_manage_payment_method_types",
      },

      {
        label: "Payment Gateway",
        path: "/payment-gateways",
        component: PaymentGatewaysPage,
        icon: <PiContactlessPayment />,
        accessKey: "payment_manage_payment_gateways",
      },
      {
        label: "Payment Providers",
        path: "/payment-providers",
        component: PaymentProvidersPage,
        icon: <FaCreditCard />,
        accessKey: "payment_manage_payment_providers",
      },
      {
        label: "Transactions",
        path: "/transactions",
        component: TransactionsPage,
        icon: <FaMoneyCheckAlt />,
        accessKey: "payment_view_transactions",
      },
      {
        label: "Gateway Management",
        path: "/gateway-management/:gatewayId/provider/:providerId/gateway-provider/:gatewayProviderId",
        component: GatewayManagementPage,
        icon: <FaCogs />,
        skipFromMenu: true,
        accessKey: "payment_view_gateway_management",
      },
      {
        label: "Provider Profile",
        path: "/payment-providers/:providerId",
        skipFromMenu: true,
        component: ProviderProfilePage,
        accessKey: "payment_view_provider_profile",
      },
    ],
  },
  {
    label: "Finance",
    icon: <FaWallet />,
    accessCategory: "FINANCE",
    children: [
      {
        label: "Admin Balance",
        path: "/admin-balance",
        component: AdminBalancePage,
        icon: <FaWallet />,
        accessKey: "finance_view_admin_balance",
      },
    ],
  },
  {
    label: "Game Provider",
    icon: <TbGoGame />,
    accessCategory: "GAME_PROVIDER",
    children: [
      {
        label: "Add Parent Provider",
        path: "/add-parent-game-provider",
        component: AddParentProvider,
        icon: <FaUserPlus />,
        accessKey: "game_manage_game_providers",
      },
      {
        label: "Add Sub Provider",
        path: "/add-game-provider",
        component: AddGameProvider,
        icon: <FaUserPlus />,
        accessKey: "game_manage_game_providers",
      },
      {
        label: "Provider List",
        path: "/game-provider-list",
        component: GameProvidersList,
        icon: <FaListUl />,
        accessKey: "game_view_game_provider_list",
      },
    ],
  },
  {
    label: "Games",
    icon: <SlGameController />,
    accessCategory: "GAME",
    children: [
      {
        label: "Add Game",
        path: "/add-game",
        component: AddOrUpdateGame,
        icon: <BiAddToQueue />,
        accessKey: "game_create_game",
      },
      {
        label: "Game List",
        path: "/game-list",
        component: GameList,
        icon: <MdFormatListBulletedAdd />,
        accessKey: "game_view_game_list",
      },
    ],
  },

  {
    label: "Sport Provider",
    icon: <TbGoGame />,
    accessCategory: "SPORTS_PROVIDER",
    children: [
      {
        label: "Add Parent Provider",
        path: "/add-parent-sport-provider",
        component: AddSportParentProvider,
        icon: <FaUserPlus />,
        accessKey: "sports_manage_sports_providers",
      },
      {
        label: "Add Sub Provider",
        path: "/add-sport-provider",
        component: AddSportProvider,
        icon: <FaUserPlus />,
        accessKey: "sports_manage_sports_sub_providers",
      },
      {
        label: "Provider List",
        path: "/sport-provider-list",
        component: SportProvidersList,
        icon: <FaListUl />,
        accessKey: "sports_view_sports_provider_list",
      },
    ],
  },
  {
    label: "Live Sports",
    icon: <SlGameController />,
    accessCategory: "LIVE_SPORTS",
    children: [
      {
        label: "Add Sport",
        path: "/add-sport",
        component: AddOrUpdateSport,
        icon: <BiAddToQueue />,
        accessKey: "live_sports_create_sport",
      },
      {
        label: "Sport List",
        path: "/sport-list",
        component: SportList,
        icon: <MdFormatListBulletedAdd />,
        accessKey: "live_sports_view_sport_list",
      },
    ],
  },

  {
    label: "Country Management",
    icon: <FaGlobe />,
    accessCategory: "COUNTRY",
    children: [
      {
        label: "Countries",
        path: "/countries",
        component: CountryList,
        accessKey: "country_manage_countries",
        icon: <LuMapPin />,
      },
      {
        label: "Currencies",
        path: "/currencies",
        component: CurrencyList,
        accessKey: "country_manage_currencies",
        icon: <MdCurrencyExchange />,
      },
      {
        label: "Languages",
        path: "/languages",
        component: LanguageList,
        icon: <LiaLanguageSolid />,
        accessKey: "country_manage_languages",
      },
    ],
  },

  {
    label: "CMS",
    icon: <MdDisplaySettings />,
    onlyOwner: true,
    accessCategory: "CMS",
    children: [
      {
        label: "Banners",
        path: "/banners",
        component: Banner,
        icon: <CgDisplayFullwidth />,
        accessKey: "cms_manage_banners",
      },
      {
        label: "Popup",
        path: "/popup",
        component: Popup,
        icon: <CgDisplayFlex />,
        accessKey: "cms_manage_popups",
      },
      {
        label: "Announcements",
        path: "/announcements",
        component: Announcement,
        icon: <GrAnnounce />,
        accessKey: "cms_manage_announcements",
      },
      {
        label: "Advertisement",
        path: "/advertisement",
        component: Advertisement,
        icon: <LiaAdSolid />,
        accessKey: "cms_manage_advertisements",
      },
      {
        label: "Sponsor",
        path: "/sponsor",
        component: Sponsor,
        icon: <LiaPeopleCarrySolid />,
        accessKey: "cms_manage_sponsors",
      },
      {
        label: "Ambassador",
        path: "/ambassador",
        component: Ambassador,
        icon: <FaPeopleRobbery />,
        accessKey: "cms_manage_ambassadors",
      },
      {
        label: "Gaming License",
        path: "/gaming-license",
        component: GamingLicense,
        icon: <TbLicense />,
        accessKey: "cms_manage_gaming_licenses",
      },
      {
        label: "Responsible Gaming",
        path: "/responsible-gaming",
        component: ResponsibleGaming,
        icon: <SiLegacygames />,
        accessKey: "cms_manage_responsible_gaming",
      },
      {
        label: "Events",
        path: "/event",
        component: EventList,
        icon: <BsCalendar2Event />,
        accessKey: "cms_manage_events",
      },
      {
        label: "Featured Game",
        path: "/featured-game",
        component: FeaturedGames,
        icon: <MdOutlineDisplaySettings />,
        accessKey: "cms_manage_featured_games",
      },
      {
        label: "Social Media",
        path: "/social-media",
        component: SocialList,
        icon: <MdOutlineDisplaySettings />,
        accessKey: "cms_manage_social_media",
      },
      {
        label: "FAQ'S",
        path: "/faqs",
        component: Faqs,
        icon: <MdOutlineDisplaySettings />,
        accessKey: "cms_manage_social_media",
      },
    ],
  },
  {
    label: "Configuration",
    icon: <VscGitPullRequestCreate />,
    onlyOwner: true, // Only visible to owner
    accessCategory: "CONFIGURATION",
    children: [
      {
        label: "Dropdowns",
        path: "/dropdowns",
        component: DropdownConfiguration,
        icon: <RiDropdownList />,
        accessKey: "settings_manage_dropdowns",
      },
      {
        label: "Menu Management",
        path: "/menu-management",
        component: MenuManagement,
        icon: <TbMenuOrder />,
        accessKey: "settings_manage_menu_management",
      },
    ],
  },

  {
    label: "Owner Controls",
    icon: <FaShieldAlt />,
    onlyOwner: true, // Only visible to owner
    accessCategory: "OWNER_CONTROLS",
    children: [
      {
        label: "Account Control",
        path: "/owner/account-control",
        component: OwnerAccountControlPage,
        icon: <MdControlCamera />,
        accessKey: "owner_manage_account_control",
      },

      {
        label: "Designation Management",
        path: "/owner/designation-management",
        icon: <MdOutlineSecurity />,
        component: DesignationManagementPage,
        accessKey: "owner_manage_designations",
      },
    ],
  },
  {
    label: "Settings",
    icon: <FaCogs />,
    accessCategory: "SETTINGS",
    children: [
      {
        label: "System Settings",
        path: "/settings/system",
        component: SystemSettingsPage,
        accessKey: "settings_view_system_settings",
        icon: <FaCogs />,
      },
      {
        label: "Backup & Restore",
        path: "/settings/backup",
        component: BackupRestorePage,
        accessKey: "settings_manage_backup_restore",
        icon: <FaDatabase />,
      },
    ],
  },
];
export const affiliateOutsideRoute = [
  {
    label: "Profile",
    path: "/affiliate-list/:affiliateId",
    component: AffiliateProfile,
    accessKey: "affiliate_view_affiliate_profile",
  },
  {
    label: "Sub Affiliates List",
    path: "/affiliate-list/:affiliateId/sub-affiliates-list",
    component: SubAffiliatesList,
    accessKey: "affiliate_view_sub_affiliate_list",
  },

  {
    label: "Players List",
    path: "/affiliate-list/:affiliateId/players-list",
    component: AffiliatePlayerList,
    accessKey: "affiliate_view_affiliate_players",
  },
  {
    label: "Withdraw History",
    path: "/affiliate-list/:affiliateId/withdraw-history",
    component: AffiliateWithdrawHistory,
    accessKey: "affiliate_view_affiliate_withdraw_history",
  },
  {
    label: "Commission History",
    path: "/affiliate-list/:affiliateId/affiliate-commission-history",
    component: AffiliateCommissionListPage,
    accessKey: "affiliate_view_affiliate_commissions",
  },
  {
    label: "KYC Verification",
    path: "/affiliate-list/:affiliateId/kyc-verification",
    component: KYCVerificationPage,
    accessKey: "affiliate_manage_kyc_verification",
  },
  {
    label: "Support",
    path: "/affiliate-list/:affiliateId/support",
    accessKey: "affiliate_support",
    component: AffiliateSupportLayout,
  },
];
export const gameProviderOutsideRoute = [
  {
    label: "Profile",
    path: "/game-provider-list/:gameProviderId",
    component: GameProviderProfile,
    accessKey: "game_manage_game_provider_profile",
  },
  {
    label: "Sub Provider List",
    path: "/game-provider-list/:gameProviderId/child-provider-list",
    component: ChildProviderList,
    accessKey: "game_view_sub_game_provider_list",
  },
  {
    label: "Deposit History",
    path: "/game-provider-list/:gameProviderId/deposit-history",
    component: DepositHistory,
    accessKey: "game_view_game_provider_deposits",
  },
  {
    label: "Game Expense History",
    path: "/game-provider-list/:gameProviderId/game-expense-history",
    component: GameExpenseHistory,
    accessKey: "game_view_game_provider_expenses",
  },
  {
    label: "Game List",
    path: "/game-provider-list/:gameProviderId/games-list",
    component: ProviderWiseGameList,
    accessKey: "game_view_game_list",
  },
];

export const sportProviderOutsideRoute = [
  {
    label: "Profile",
    path: "/sport-provider-list/:sportProviderId",
    component: SportProviderProfile,
    accessKey: "sports_manage_sports_provider_profile",
  },
  {
    label: "Sub Provider List",
    path: "/sport-provider-list/:sportProviderId/child-provider-list",
    component: SportChildProviderList,
    accessKey: "sports_view_sports_provider_list",
  },
  {
    label: "Sports Transaction History",
    path: "/sport-provider-list/:sportProviderId/sport-transaction-history",
    component: SportsTransactionHistory,
    accessKey: "sports_view_sports_provider_expenses",
  },
  {
    label: "Sport List",
    path: "/sport-provider-list/:sportProviderId/Sport-list",
    component: SportsProviderWiseSport,
    accessKey: "sports_view_sport_list",
  },
];
