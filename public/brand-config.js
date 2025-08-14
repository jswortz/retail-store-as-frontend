// Brand configuration - easily switch between different brand themes
const BRAND_CONFIG = {
    google: {
        name: 'Google',
        logo: {
            url: 'https://www.gstatic.com/images/branding/product/2x/googleg_96dp.png',
            width: '48px',
            height: '48px'
        },
        favicon: 'https://www.google.com/favicon.ico',
        colors: {
            primary: '#1a73e8',
            primaryHover: '#1765cc',
            secondary: '#34a853',
            accent: '#fbbc04',
            danger: '#ea4335',
            background: '#fff',
            surface: '#f8f9fa',
            text: '#202124',
            textSecondary: '#5f6368',
            border: '#dadce0'
        },
        fonts: {
            primary: '"Google Sans", Roboto, Arial, sans-serif',
            secondary: 'Roboto, Arial, sans-serif'
        }
    },
    microsoft: {
        name: 'Microsoft',
        logo: {
            url: 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b',
            width: '108px',
            height: '24px'
        },
        favicon: 'https://www.microsoft.com/favicon.ico',
        colors: {
            primary: '#0078d4',
            primaryHover: '#106ebe',
            secondary: '#40e0d0',
            accent: '#ffb900',
            danger: '#d13438',
            background: '#fff',
            surface: '#f3f2f1',
            text: '#323130',
            textSecondary: '#605e5c',
            border: '#e1dfdd'
        },
        fonts: {
            primary: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
            secondary: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif'
        }
    },
    amazon: {
        name: 'Amazon',
        logo: {
            url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
            width: '100px',
            height: '30px'
        },
        favicon: 'https://www.amazon.com/favicon.ico',
        colors: {
            primary: '#ff9900',
            primaryHover: '#e88600',
            secondary: '#146eb4',
            accent: '#ff9900',
            danger: '#d13212',
            background: '#fff',
            surface: '#f7f7f7',
            text: '#0f1111',
            textSecondary: '#565959',
            border: '#d5d9d9'
        },
        fonts: {
            primary: '"Amazon Ember", Arial, sans-serif',
            secondary: 'Arial, sans-serif'
        }
    },
    ulta: {
        name: 'Ulta Beauty',
        logo: {
            url: '/ulta-logo.svg',
            width: '80px',
            height: '40px'
        },
        favicon: 'https://www.ulta.com/favicon.ico',
        colors: {
            primary: '#e3006a',      // Ulta's signature magenta/pink
            primaryHover: '#c20056',
            secondary: '#f47321',    // Orange accent
            accent: '#7c4799',       // Purple accent
            danger: '#dc2626',
            background: '#ffffff',
            surface: '#fafafa',
            text: '#000000',
            textSecondary: '#666666',
            border: '#e5e5e5',
            // Ulta-specific colors
            ultaPink: '#e3006a',
            ultaOrange: '#f47321',
            ultaPurple: '#7c4799',
            ultaLightPink: '#fce4ec',
            ultaLightGray: '#f5f5f5'
        },
        fonts: {
            primary: '"Avenir Next", "Helvetica Neue", Arial, sans-serif',
            secondary: '"Helvetica Neue", Arial, sans-serif'
        }
    },
    walmart: {
        name: 'Walmart',
        logo: {
            url: '/walmart-logo.svg',
            width: '120px',
            height: '40px'
        },
        favicon: 'https://www.walmart.com/favicon.ico',
        colors: {
            primary: '#0071ce',      // Walmart blue
            primaryHover: '#004c91',
            secondary: '#ffc220',    // Walmart yellow
            accent: '#76c043',       // Walmart green
            danger: '#e60023',
            background: '#ffffff',
            surface: '#f0f2f5',
            text: '#2d2d2d',
            textSecondary: '#5a5a5a',
            border: '#e1e5eb',
            // Walmart-specific colors
            walmartBlue: '#0071ce',
            walmartYellow: '#ffc220',
            walmartOrange: '#ff6900',
            walmartLightBlue: '#e7f3ff'
        },
        fonts: {
            primary: '"Bogle", "Helvetica Neue", Helvetica, Arial, sans-serif',
            secondary: '"Helvetica Neue", Helvetica, Arial, sans-serif'
        }
    },
    mcdonalds: {
        name: "McDonald's",
        logo: {
            url: '/mcdonalds-logo.svg',
            width: '60px',
            height: '60px'
        },
        favicon: 'https://www.mcdonalds.com/favicon.ico',
        colors: {
            primary: '#ffbc0d',      // McDonald's yellow
            primaryHover: '#e5a800',
            secondary: '#da291c',    // McDonald's red
            accent: '#27251f',       // McDonald's brown
            danger: '#da291c',
            background: '#ffffff',
            surface: '#fff8e7',
            text: '#292929',
            textSecondary: '#5c5c5c',
            border: '#e0e0e0',
            // McDonald's-specific colors
            mcYellow: '#ffbc0d',
            mcRed: '#da291c',
            mcBrown: '#27251f',
            mcLightYellow: '#fff8e7'
        },
        fonts: {
            primary: '"Speedee", -apple-system, BlinkMacSystemFont, sans-serif',
            secondary: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        }
    },
    wendys: {
        name: "Wendy's",
        logo: {
            url: '/wendys-logo.svg',
            width: '100px',
            height: '40px'
        },
        favicon: 'https://www.wendys.com/favicon.ico',
        colors: {
            primary: '#e2231a',      // Wendy's red
            primaryHover: '#c91e16',
            secondary: '#0e8ed9',    // Wendy's blue
            accent: '#ffc600',       // Yellow accent
            danger: '#e2231a',
            background: '#ffffff',
            surface: '#fafafa',
            text: '#333333',
            textSecondary: '#666666',
            border: '#e0e0e0',
            // Wendy's-specific colors
            wendysRed: '#e2231a',
            wendysBlue: '#0e8ed9',
            wendysLightRed: '#ffeeed'
        },
        fonts: {
            primary: '"Klavika", "Helvetica Neue", Arial, sans-serif',
            secondary: '"Helvetica Neue", Arial, sans-serif'
        }
    },
    kroger: {
        name: 'Kroger',
        logo: {
            url: '/kroger-logo.svg',
            width: '100px',
            height: '40px'
        },
        favicon: 'https://www.kroger.com/favicon.ico',
        colors: {
            primary: '#0b1f5f',      // Kroger blue
            primaryHover: '#081747',
            secondary: '#e31837',    // Kroger red
            accent: '#00a6e2',       // Light blue
            danger: '#e31837',
            background: '#ffffff',
            surface: '#f7f7f7',
            text: '#333333',
            textSecondary: '#666666',
            border: '#dddddd',
            // Kroger-specific colors
            krogerBlue: '#0b1f5f',
            krogerRed: '#e31837',
            krogerLightBlue: '#00a6e2',
            krogerGray: '#f7f7f7'
        },
        fonts: {
            primary: '"Graphik", "Helvetica Neue", Arial, sans-serif',
            secondary: '"Helvetica Neue", Arial, sans-serif'
        }
    },
    jewelosco: {
        name: 'Jewel-Osco',
        logo: {
            url: '/jewelosco-logo.svg',
            width: '120px',
            height: '40px'
        },
        favicon: '/favicon.ico',
        colors: {
            primary: '#00447c',      // Jewel-Osco blue
            primaryHover: '#003560',
            secondary: '#ff6900',    // Orange
            accent: '#fdb913',       // Yellow
            danger: '#d32f2f',
            background: '#ffffff',
            surface: '#f5f5f5',
            text: '#333333',
            textSecondary: '#666666',
            border: '#e0e0e0',
            // Jewel-Osco-specific colors
            jewelBlue: '#00447c',
            jewelOrange: '#ff6900',
            jewelYellow: '#fdb913',
            jewelLightBlue: '#e6f2ff'
        },
        fonts: {
            primary: '"Albertsons", "Helvetica Neue", Arial, sans-serif',
            secondary: '"Helvetica Neue", Arial, sans-serif'
        }
    },
    custom: {
        name: 'Agent Space',
        logo: {
            url: '/default-logo.svg', // Or use your custom logo: /logo.png
            width: '150px',
            height: '40px'
        },
        favicon: '/favicon.ico',
        colors: {
            primary: '#4285f4',
            primaryHover: '#357ae8',
            secondary: '#34a853',
            accent: '#fbbc04',
            danger: '#ea4335',
            background: '#fff',
            surface: '#f8f9fa',
            text: '#202124',
            textSecondary: '#5f6368',
            border: '#e8eaed'
        },
        fonts: {
            primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            secondary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }
    }
};

// Set the active brand (change this to switch brands)
const ACTIVE_BRAND = 'ulta'; // Change to 'google', 'microsoft', 'amazon', 'ulta', 'walmart', 'mcdonalds', 'wendys', 'kroger', 'jewelosco', or 'custom'

// Apply brand configuration
function applyBrand() {
    const brand = BRAND_CONFIG[ACTIVE_BRAND] || BRAND_CONFIG.google;
    
    // Set CSS variables
    const root = document.documentElement;
    Object.entries(brand.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
    });
    
    // Set fonts
    root.style.setProperty('--font-primary', brand.fonts.primary);
    root.style.setProperty('--font-secondary', brand.fonts.secondary);
    
    // Set brand-specific class for special styling
    document.body.className = `brand-${ACTIVE_BRAND}`;
    
    // Update favicon
    updateFavicon(brand.favicon);
    
    // Return brand for use in other scripts
    return brand;
}

// Update favicon dynamically
function updateFavicon(faviconUrl) {
    // Remove existing favicons
    const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
    existingFavicons.forEach(favicon => favicon.remove());
    
    // Add new favicon
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/x-icon';
    link.href = faviconUrl;
    document.head.appendChild(link);
    
    // Also add alternative favicon formats
    const link32 = document.createElement('link');
    link32.rel = 'icon';
    link32.type = 'image/png';
    link32.sizes = '32x32';
    link32.href = faviconUrl;
    document.head.appendChild(link32);
}