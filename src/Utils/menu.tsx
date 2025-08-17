import React, { Children } from "react";
import {
  FaUserFriends,
  FaMoneyCheckAlt,
  FaListUl,
  FaGamepad,
  FaUserPlus,
  FaUsers,
  FaCoins,
  FaCreditCard,
  FaFutbol,
  FaCogs,
  FaKey,
  FaDatabase,
  FaChartPie,
  FaShieldAlt,
  FaGlobe,
  FaHistory,
  FaSignOutAlt,
} from "react-icons/fa";
import Dashboard from "../components/Dashboard";
import ComingSoon from "../components/ComingSoon";
import PlayerListPage from "../components/PlayerListPage";
import BettingWagerPage from "../components/BettingWagerPage";
import AllDepositPage from "../components/AllDepositPage";
import PendingDepositPage from "../components/PendingDepositPage";
import AllWithdrawPage from "../components/AllWithdrawPage";
import PendingWithdrawPage from "../components/PendingWithdrawPage";
import BetListPage from "../components/BetListPage";
import PendingBetListPage from "../components/PendingBetListPage";
import GamesPage from "../components/GamesPage";
import CreateAgentPage from "../components/CreateAgentPage";
import AgentListPage from "../components/AgentListPage";
import PrepaymentPage from "../components/PrepaymentPage";
import CommissionPage from "../components/CommissionPage";
import CreateMethodPage from "../components/CreateMethodPage";
// import PaymentMethodsPage from "../components/PaymentMethodsPage";
import PaymentListPage from "../components/PaymentListPage";
import TransactionsPage from "../components/TransactionsPage";
import AddSportPage from "../components/AddSportPage";
import PlayersPage from "../components/PlayersPage";
import NetProfitLossPage from "../components/NetProfitLossPage";
import ProductAnalyticsPage from "../components/ProductAnalyticsPage";
import CoinAnalyticsPage from "../components/CoinAnalyticsPage";
import ProviderPaymentsPage from "../components/ProviderPaymentsPage";
import AffiliatePanelPage from "../components/AffiliatePanelPage";
import TurnoverSettingsPage from "../components/TurnoverSettingsPage";
import SystemSettingsPage from "../components/SystemSettingsPage";
import BackupRestorePage from "../components/BackupRestorePage";
import OwnerAccountControlPage from "../components/OwnerAccountControlPage";
import { BiLoader, BiMessage, BiTrophy } from "react-icons/bi";
import OwnerPermissionPage from "../components/OwnerPermissionPage";
import SportsListPage from "../components/SportsListPage";
import { GiAmericanFootballBall } from "react-icons/gi";
import { FiStar } from "react-icons/fi";
import { TbFileStar } from "react-icons/tb";
import { BsStarFill, BsTrophy } from "react-icons/bs";
import AddPopularSports from "../components/AddPopularSports";
import PopularSportsList from "../components/PopularSportsList";
import AddSlider from "../components/AddSlider";
import SliderList from "../components/SliderList";
import AddLanguage from "../components/AddLanguage";
import LanguageList from "../components/LanguageList";
import AddProvider from "../components/AddProvider";
import ProviderList from "../components/ProviderList";
import LoginHistoryPage from "../components/LoginHistoryPage";
import CreateAffiliate from "../components/CreateAffiliate";
import AffiliateListPage from "../components/AffiliateListPage";
import CountryManagementPage from "../components/CountryManagementPage";
import CountryList from "../components/CountryList";
import CurrencyList from "../components/CurrencyList";
import CountryManagementDemo from "../components/CountryManagementDemo";
import DropdownConfiguration from "../components/DropdownConfiguration";
import { VscGitPullRequestCreate } from "react-icons/vsc";
import { MdAddchart, MdDisplaySettings, MdMessage } from "react-icons/md";
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
import StatusChipDemo from "../components/test/StatusChipDemo";
import AffiliatePlayerList from "../components/AffiliatePlayerList";
import AffiliateWithdrawHistory from "../components/AffiliateWithdrawHistory";
import SubAffiliateComHistory from "../components/SubAffiliateComHistory";
import AffiliatePlayerComHistory from "../components/AffiliatePlayerComHistory";
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

export const menu = [
  {
    label: "Dashboard",
    path: "/",
    icon: <FaListUl />,
    component: Dashboard,
    props: {},
  },
  {
    label: "Players",
    icon: <FaUserFriends />,
    children: [
      {
        label: "Player List",
        path: "/players",
        component: PlayerListPage,
        icon: <FaUserFriends />,
      },
      {
        label: "Transactions",
        path: "/transactions",
        component: TransactionsPage,
        icon: <FaMoneyCheckAlt />,
      },
      {
        label: "Win/Loss",
        path: "/win-loss",
        component: ComingSoon,
        icon: <BiTrophy/>
      },
      {
        label: "Betting Wager",
        path: "/betting-wager",
        component: BettingWagerPage,
        icon: <BiTrophy/>
      },
      {
        label: "Message/Chat Box",
        path: "/message-chat-box",
        component: ComingSoon,
        icon: <BiMessage/>
      },
        ],
    // Full DB list, max winning filter, etc.
  },
  {
    label: "Finance",
    icon: <FaChartPie />,
    children: [
      {
        label: "Net Profit/Loss",
        path: "/finance/net",
        component: NetProfitLossPage,
      },
      {
        label: "Product Analytics",
        path: "/finance/products",
        component: ProductAnalyticsPage,
      },
      {
        label: "Coin Analytics",
        path: "/finance/coins",
        component: CoinAnalyticsPage,
      },
      {
        label: "Provider Payments",
        path: "/finance/providers",
        component: ProviderPaymentsPage,
      },
    ],
  },
  // {
  //   label: "Affiliate",
  //   path: "/affiliate",
  //   icon: <FaUsers />,
  //   component: AffiliatePanelPage,
  // },
  {
    label: "Affiliate",
    icon: <FaUsers />,
    children: [
      {
        label: "Create Affiliate",
        path: "/create-affiliate",
        component: CreateAffiliate,
        icon: <FaUserPlus />,
        props: {},
      },
      {
        label: "Affiliate List",
        path: "/affiliate-list",
        component: AffiliateListPage,
        icon: <FaListUl />,
        props: {},
      },
    ],
  },
  {
    label: "Agent",
    children: [
      {
        label: "Create Agent",
        path: "/create-agent",
        component: CreateAgentPage,
        icon: <FaUserPlus />,
      },
      {
        label: "Agent List",
        path: "/agent-list",
        component: AgentListPage,
        icon: <FaUsers />,
      },
      {
        label: "Prepayment",
        path: "/prepayment",
        component: PrepaymentPage,
        icon: <FaCoins />,
      },
      {
        label: "Commission",
        path: "/commission",
        component: CommissionPage,
        icon: <FaCoins />,
      },
    ],
  },
  {
    label: "Promotions",
    children: [
      {
        label: "Create Promotion",
        path: "/create-promotion",
        component: CreatePromotion,
        icon: <MdAddchart />,
        props: {},
      },
      {
        label: "Promotion List",
        path: "/promotion-list",
        component: PromotionsList,
        icon: <FaListUl />,
        props: {},
      },
    ],
  },
  {
    label: "Bets",
    children: [
      {
        label: "Bet List",
        path: "/bet-list",
        component: BetListPage,
        icon: <FaListUl />,
        props: {},
      },
      {
        label: "Pending Bet",
        path: "/pending-bet",
        component: PendingBetListPage,
        icon: <FaListUl />,
        props: {},
      },
      {
        label: "Games",
        path: "/games",
        component: GamesPage,
        icon: <FaGamepad />,
        props: {},
      },
    ],
  },
  {
    label: "Provider Profile",
    path: "/payment-providers/:providerId",
    skipFromMenu: true,
    component: ProviderProfilePage,
  },
  {
    label: "Payment Method",
    children: [
      // {
      //   label: "Create Method",
      //   path: "/create-method",
      //   component: CreateMethodPage,
      //   icon: <FaCreditCard />,
      // },
      {
        label: "Payment Methods",
        path: "/payment-methods",
        component: PaymentMethodsPage,
        icon: <FaCreditCard />,
      },
      {
        label: "Payment Method Types",
        path: "/payment-method-types",
        component: PaymentMethodTypesPage,
        icon: <FaCreditCard />,
      },
      // {
      //   label: "Payment List",
      //   path: "/payment-list",
      //   component: PaymentListPage,
      //   icon: <FaCreditCard />,
      // },
      {
        label: "Payment Gateway",
        path: "/payment-gateways",
        component: PaymentGatewaysPage,
        icon: <FaCreditCard />,
      },
      {
        label: "Payment Providers",
        path: "/payment-providers",
        component: PaymentProvidersPage,
        icon: <FaCreditCard />,
      },
      {
        label: "Transactions",
        path: "/transactions",
        component: TransactionsPage,
        icon: <FaMoneyCheckAlt />,
      },
      {
        label: "Gateway Management",
        path: "/gateway-management/:gatewayId/provider/:providerId/gateway-provider/:gatewayProviderId",
        // path: "/gateway-management/:gatewayId/provider/:providerId",
        component: GatewayManagementPage,
        icon: <FaCogs />,
        skipFromMenu: true,
      },
    ],
  },
  {
    label: "Sports",
    children: [
      // {
      //   label: "Add Sport",
      //   path: "/add-sport",
      //   component: AddSportPage,
      //   icon: <FaFutbol />,
      // },
      // {
      //   label: "Sports List",
      //   path: "/sports",
      //   component: SportsListPage,
      //   icon: <GiAmericanFootballBall />,
      // },
      {
        label: "Add Popular",
        path: "/add-popular-sports",
        component: AddPopularSports,
        icon: <FiStar />,
      },
      {
        label: "Popular List",
        path: "/popular-sports",
        component: PopularSportsList,
        icon: <BsStarFill />,
      },
    ],
  },
  {
    label: "Game Provider",
    icon: <FaShieldAlt />,
    children: [
      {
        label: "Add Parent Provider",
        path: "/add-parent-game-provider",
        component: AddParentProvider,
        icon: <FaUserPlus />,
      },
      {
        label: "Add Sub Provider",
        path: "/add-game-provider",
        component: AddGameProvider,
        icon: <FaUserPlus />,
      },
      {
        label: "Provider List",
        path: "/game-provider-list",
        component: GameProvidersList,
        icon: <FaListUl />,
      },
    ],
  },
  {
    label: "Games",
    icon: <FaShieldAlt />,
    children: [
      {
        label: "Add Game",
        path: "/add-game",
        component: AddOrUpdateGame,
        icon: <FaUserPlus />,
      },
      {
        label: "Game List",
        path: "/game-list",
        component: GameList,
        icon: <FaUserPlus />,
      },
    ],
  },

  {
    label: "Sport Provider",
    icon: <FaShieldAlt />,
    children: [
      {
        label: "Add Parent Provider",
        path: "/add-parent-sport-provider",
        component: AddSportParentProvider,
        icon: <FaUserPlus />,
      },
      {
        label: "Add Sub Provider",
        path: "/add-sport-provider",
        component: AddSportProvider,
        icon: <FaUserPlus />,
      },
      {
        label: "Provider List",
        path: "/sport-provider-list",
        component: SportProvidersList,
        icon: <FaListUl />,
      },
    ],
  },
  {
    label: "Live Sports",
    icon: <FaShieldAlt />,
    children: [
      {
        label: "Add Sport",
        path: "/add-sport",
        component: AddOrUpdateSport,
        icon: <FaUserPlus />,
      },
      {
        label: "Sport List",
        path: "/sport-list",
        component: SportList,
        icon: <FaUserPlus />,
      },
    ],
  },
  {
    label: "Slider",
    icon: <TbFileStar />,
    children: [
      {
        label: "Add Slider",
        path: "/add-slider",
        component: AddSlider,
        icon: <FiStar />,
      },
      {
        label: "Slider List",
        path: "/slider-list",
        component: SliderList,
        icon: <TbFileStar />,
      },
    ],
  },
  {
    label: "Language",
    icon: <FaGlobe />,
    children: [
      {
        label: "Add Language",
        path: "/add-language",
        component: AddLanguage,
        icon: <FaGlobe />,
      },
      {
        label: "Language List",
        path: "/language-list",
        component: LanguageList,
        icon: <FaGlobe />,
      },
      {
        label: "Country List",
        path: "/country-list",
        component: CountryList,
        icon: <FaGlobe />,
      },
    ],
  },
  {
    label: "Country Management",
    icon: <FaGlobe />,
    children: [
      {
        label: "Overview",
        path: "/country-management",
        component: CountryManagementPage,
        icon: <FaGlobe />,
      },
      {
        label: "Demo",
        path: "/country-demo",
        component: CountryManagementDemo,
        icon: <FaGlobe />,
      },
      {
        label: "Countries",
        path: "/countries",
        component: CountryList,
        icon: <FaGlobe />,
      },
      {
        label: "Currencies",
        path: "/currencies",
        component: CurrencyList,
        icon: <FaCoins />,
      },
      {
        label: "Languages",
        path: "/languages",
        component: LanguageList,
        icon: <FaGlobe />,
      },
    ],
  },
  {
    label: "Settings",
    icon: <FaCogs />,
    children: [
      {
        label: "System Settings",
        path: "/settings/system",
        component: SystemSettingsPage,
        icon: <FaCogs />,
      },
      {
        label: "Turnover",
        path: "/settings/turnover",
        component: TurnoverSettingsPage,
        icon: <BiLoader />,
      },
      {
        label: "Backup & Restore",
        path: "/settings/backup",
        component: BackupRestorePage,
        onlyOwner: true, // Only visible to owner
        icon: <FaDatabase />,
      },
    ],
  },
  {
    label: "Owner Controls",
    icon: <FaShieldAlt />,
    onlyOwner: true, // Only visible to owner
    children: [
      {
        label: "Account Control",
        path: "/owner/account-control",
        component: OwnerAccountControlPage,
      },
      {
        label: "Permission",
        path: "/owner/permission",
        component: OwnerPermissionPage,
      },
    ],
  },
  {
    label: "Login History",
    path: "/login-history",
    icon: <FaHistory />,
    component: LoginHistoryPage,
  },
  {
    label: "CMS",
    icon: <MdDisplaySettings />,
    onlyOwner: true, // Only visible to owner
    children: [
      {
        label: "Banners",
        path: "/banners",
        component: Banner,
      },
      {
        label: "Popup",
        path: "/popup",
        component: Popup,
      },
      {
        label: "Announcements",
        path: "/announcements",
        component: Announcement,
      },
      {
        label: "Advertisement",
        path: "/advertisement",
        component: Advertisement,
      },
      {
        label: "Sponsor",
        path: "/sponsor",
        component: Sponsor,
      },
      {
        label: "Ambassador",
        path: "/ambassador",
        component: Ambassador,
      },
      {
        label: "Gaming License",
        path: "/gaming-license",
        component: GamingLicense,
      },
      {
        label: "Responsible Gaming",
        path: "/responsible-gaming",
        component: ResponsibleGaming,
      },
    ],
  },
  {
    label: "Configuration",
    icon: <VscGitPullRequestCreate />,
    onlyOwner: true, // Only visible to owner
    children: [
      {
        label: "Dropdowns",
        path: "/dropdowns",
        component: DropdownConfiguration,
      },
      {
        label: "StatusChip Demo",
        path: "/status-chip-demo",
        component: StatusChipDemo,
      },
    ],
  },
];
export const affiliateOutsideRoute = [
  {
    label: "Profile",
    path: "/affiliate-list/:affiliateId",
    component: AffiliateProfile,
  },
  {
    label: "Sub Affiliates List",
    path: "/affiliate-list/:affiliateId/sub-affiliates-list",
    component: SubAffiliatesList,
  },

  {
    label: "Players List",
    path: "/affiliate-list/:affiliateId/players-list",
    component: AffiliatePlayerList,
  },
  {
    label: "Withdraw History",
    path: "/affiliate-list/:affiliateId/withdraw-history",
    component: AffiliateWithdrawHistory,
  },
  {
    label: "Sub Affiliate C. History",
    path: "/affiliate-list/:affiliateId/sub-affiliate-commission-history",
    component: SubAffiliateComHistory,
  },
  {
    label: "Player C. History",
    path: "/affiliate-list/:affiliateId/player-commission-history",
    component: AffiliatePlayerComHistory,
  },
];
export const gameProviderOutsideRoute = [
  {
    label: "Profile",
    path: "/game-provider-list/:gameProviderId",
    component: GameProviderProfile,
  },
  {
    label: "Sub Provider List",
    path: "/game-provider-list/:gameProviderId/child-provider-list",
    component: ChildProviderList,
  },
  {
    label: "Deposit History",
    path: "/game-provider-list/:gameProviderId/deposit-history",
    component: DepositHistory,
  },
  {
    label: "Game Expense History",
    path: "/game-provider-list/:gameProviderId/game-expense-history",
    component: GameExpenseHistory,
  },
  {
    label: "Game List",
    path: "/game-provider-list/:gameProviderId/games-list",
    component: ProviderWiseGameList,
  },
];

export const sportProviderOutsideRoute = [
  {
    label: "Profile",
    path: "/sport-provider-list/:sportProviderId",
    component: SportProviderProfile,
  },
  {
    label: "Sub Provider List",
    path: "/sport-provider-list/:sportProviderId/child-provider-list",
    component: SportChildProviderList,
  },
  {
    label: "Sports Transaction History",
    path: "/sport-provider-list/:sportProviderId/sport-transaction-history",
    component: SportsTransactionHistory,
  },
  {
    label: "Sport List",
    path: "/sport-provider-list/:sportProviderId/Sport-list",
    component: SportsProviderWiseSport,
  },
];
