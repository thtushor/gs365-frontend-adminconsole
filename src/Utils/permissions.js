import Dashboard from "../components/Dashboard";

// Permission categories and their respective permissions
export const PERMISSION_CATEGORIES = {
    DASHBOARD: {
        label: "Dashboard",
        icon: "📊",
        permissions: [
            "dashboard_view_overview",
            "dashboard_view_sales",
            "dashboard_view_user_activity",
            // "dashboard_view_system_health"
        ]
    },
    PLAYER: {
        label: "Players",
        icon: "👥",
        permissions: [
            "player_create_player",
            "player_edit_player",
            "player_delete_player",
            "player_view_player",
            "player_view_player_list",
            "player_view_player_profile",
            "player_manage_player_chat",
            "player_view_player_transactions",
            "player_view_player_payments",
            "player_view_player_login_history",
            "player_view_player_promotion_history",
            "player_view_player_wagers",
            "player_view_player_win_loss",
            "player_view_player_games",
            "player_view_player_turnover",
            "player_export_player_data",
            "player_change_player_password",
        ]
    },
     KYC: {
        label: "KYC Request History",
        icon: "🛡️",
        permissions: [
            "kyc_view_kyc_requests",
            "kyc_approve_kyc",
            "kyc_reject_kyc",
            "kyc_send_kyc_requests",
            "kyc_view_kyc_history"
        ]
    },
    AFFILIATE: {
        label: "Affiliate",
        icon: "🤝",
        permissions: [
            "affiliate_create_affiliate",
            "affiliate_edit_affiliate",
            "affiliate_delete_affiliate",
            "affiliate_view_affiliate",
            "affiliate_view_affiliate_list",
            "affiliate_view_affiliate_profile",
            "affiliate_view_sub_affiliate_list",
            "affiliate_view_affiliate_commissions",
            "affiliate_view_affiliate_withdraw_history",
            "affiliate_view_sub_affiliates",
            "affiliate_view_affiliate_players",
            "affiliate_approve_withdraw_requests",
            "affiliate_manage_commission_rates",
            "affiliate_manage_kyc_verification"
        ]
    },
    PROMOTION: {
        label: "Promotions",
        icon: "🎯",
        permissions: [
            "promotion_create_promotion",
            "promotion_edit_promotion",
            "promotion_delete_promotion",
            "promotion_view_promotion",
            "promotion_view_promotion_list",
            "promotion_manage_promotion_status"
        ]
    },
    // AGENT: {
    //     label: "Agent Management",
    //     icon: "👤",
    //     permissions: [
    //         "agent_create_agent",
    //         "agent_edit_agent",
    //         "agent_delete_agent",
    //         "agent_view_agent",
    //         "agent_view_agent_list",
    //         "agent_view_agent_profile",
    //         "agent_manage_prepayment",
    //         "agent_view_commission",
    //         "agent_manage_agent_balance"
    //     ]
    // },
    PAYMENT: {
        label: "Payment Method",
        icon: "💳",
        permissions: [
            "payment_view_transactions",
            "payment_view_deposits",
            "payment_view_withdrawals",
            "payment_view_pending_deposits",
            "payment_view_pending_withdrawals",
            "payment_approve_deposits",
            "payment_approve_withdrawals",
            "payment_reject_deposits",
            "payment_reject_withdrawals",
            "payment_manage_payment_methods",
            "payment_manage_payment_gateways",
            "payment_manage_payment_method_types",
            "payment_manage_payment_providers",
            "payment_view_gateway_management",
            "payment_view_provider_profile"

        ]
    },
     FINANCE: {
        label: "Finance",
        icon: "💰",
        permissions: [
            "finance_view_admin_balance",
            "finance_manage_admin_balance",
            "finance_view_commission_reports",
            "finance_manage_commission_settings"
        ]
    },
    GAME_PROVIDER: {
        label: "Game Provider",
        icon: "🕹️",
        permissions: [
            "game_manage_game_providers",
            "game_view_game_provider_list",
            "game_view_sub_game_provider_list",
            "game_manage_game_provider_profile",
            "game_view_game_provider_deposits",
            "game_view_game_provider_expenses",
            "game_manage_featured_games"
        ],
    },
    GAME: {
        label: "Games",
        icon: "🎮",
        permissions: [
            "game_create_game",
            "game_edit_game",
            "game_delete_game",
            "game_view_game",
            "game_view_game_list",
        ]
    },
    
    SPORTS_PROVIDER: {
        label: "Sport Provider",
        icon: "🕹️",
        permissions: [
            "sports_manage_sports_providers",
            "sports_manage_sports_sub_providers",
            "sports_view_sports_provider_list",
            "sports_manage_sports_provider_profile",
            "sports_view_sports_provider_deposits",
            "sports_view_sports_provider_expenses",
            "sports_manage_featured_sports"
        ],
    },
    // SPORTS: {
    //     label: "Sports Management",
    //     icon: "⚽",
    //     permissions: [
    //         "sports_create_sport",
    //         "sports_edit_sport",
    //         "sports_delete_sport",
    //         "sports_view_sport",
    //         "sports_view_sport_list",
    //         "sports_manage_sport_providers",
    //         "sports_view_sport_provider_list",
    //         "sports_manage_sport_provider_profile",
    //         "sports_view_sport_transaction_history",
    //         "sports_view_betting_wagers",
    //         "sports_view_win_loss_reports"
    //     ]
    // },
     LIVE_SPORTS: {
        label: "Live Sports",
        icon: "⚽",
        permissions: [
            "live_sports_create_sport",
            "live_sports_view_sport_list"
        ]
    },
    
    CMS: {
        label: "CMS",
        icon: "📝",
        permissions: [
            "cms_manage_banners",
            "cms_manage_popups",
            "cms_manage_announcements",
            "cms_manage_advertisements",
            "cms_manage_sponsors",
            "cms_manage_ambassadors",
            "cms_manage_gaming_licenses",
            "cms_manage_responsible_gaming",
            "cms_manage_events",
            "cms_manage_featured_games",
            "cms_manage_social_media"
        ]
    },
    COUNTRY: {
        label: "Country Management",
        icon: "🌍",
        permissions: [
            "country_manage_countries",
            "country_manage_currencies",
            "country_manage_languages",
            "country_assign_country_languages",
            "country_update_country_status",
            "country_update_language_status",
            "country_manage_currency_conversion"
        ]
    },
   
    REPORTS: {
        label: "Reports & Analytics",
        icon: "📊",
        permissions: [
            "reports_view_dashboard",
            "reports_view_game_stats",
            "reports_view_product_analytics",
            "reports_view_coin_analytics",
            "reports_view_net_profit_loss",
            "reports_view_turnover_reports",
            "reports_export_reports"
        ]
    },
   
     CONFIGURATION: {
        label: "Configuration",
        icon: "⚙️",
        permissions: [
            "settings_manage_dropdowns",
            "settings_manage_menu_management",
            // "settings_view_login_history"
        ]
    },

     SETTINGS: {
        label: "Settings",
        icon: "⚙️",
        permissions: [
            "settings_view_system_settings",
            "settings_update_system_settings",
            "settings_manage_turnover_settings",
            "settings_manage_backup_restore",
        ]
    },
    // ADMIN: {
    //     label: "Admin Management",
    //     icon: "👑",
    //     permissions: [
    //         "admin_create_admin",
    //         "admin_edit_admin",
    //         "admin_delete_admin",
    //         "admin_view_admin_list",
    //         "admin_view_admin_profile",
    //         "admin_manage_admin_permissions",
    //         "admin_view_owner_controls",
    //         "admin_manage_account_control",
    //         "admin_manage_designations"
    //     ]
    // },
    OWNER_CONTROLS: {  
    label: "Owner Controls",
    icon: "🔒",
    permissions: [
        "owner_view_owner_controls",
        // "owner_manage_account_control",
        "owner_manage_designations",    
    ]
    },
   
};

// Admin user types
export const ADMIN_USER_TYPES = [
    { value: "admin", label: "Admin", color: "bg-red-100 text-red-800" },
    { value: "superAgent", label: "Super Agent", color: "bg-blue-100 text-blue-800" },
    { value: "agent", label: "Agent", color: "bg-green-100 text-green-800" },
    { value: "superAffiliate", label: "Super Affiliate", color: "bg-purple-100 text-purple-800" },
    { value: "affiliate", label: "Affiliate", color: "bg-yellow-100 text-yellow-800" }
];

export const checkHasCategoryPermission = (userPermissions, categoryKey) => {
    const categoryPermissions = PERMISSION_CATEGORIES[categoryKey]?.permissions || [];
    const hasPermission = categoryPermissions.some(permission =>
        userPermissions?.includes(permission)
    );
    console.log({ categoryKey, categoryPermissions, userPermissions, hasPermission })
    return hasPermission;
}

// Get all permissions as a flat array
export const getAllPermissions = () => {
    return Object.values(PERMISSION_CATEGORIES).flatMap(category =>
        category.permissions
    );
};


// Get permissions by category
export const getPermissionsByCategory = (categoryKey) => {
    return PERMISSION_CATEGORIES[categoryKey]?.permissions || [];
};

// Check if user has specific permission
export const hasPermission = (userPermissions, requiredPermission) => {
    return userPermissions?.includes(requiredPermission) || false;
};

// Check if user has any of the required permissions
export const hasAnyPermission = (userPermissions, requiredPermissions) => {
    return requiredPermissions.some(permission =>
        userPermissions?.includes(permission)
    );
};

// Check if user has all required permissions
export const hasAllPermissions = (userPermissions, requiredPermissions) => {
    return requiredPermissions.every(permission =>
        userPermissions?.includes(permission)
    );
};

export function removeFirstUnderScoreWord(str) {
    // Split by underscore
    const parts = str.split("_");

    // Remove the first part ("agent") and join the rest with spaces
    return parts.slice(1).join(" ");
}
