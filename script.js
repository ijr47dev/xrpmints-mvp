// Navigation Bar JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const connectWalletBtn = document.getElementById('connectWalletBtn');
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');

    // Wallet connection state
    let isWalletConnected = false;
    let connectedAddress = '';

    // Search functionality
    function handleSearch() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            console.log('Searching for:', searchTerm);
            // Here you would typically make an API call to search for tokens/NFTs
            // For demo purposes, we'll just log the search term
            alert(`Searching for: "${searchTerm}"\n\nThis would typically connect to your XRPL search API.`);
        }
    }

    // Search event listeners
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Mobile menu toggle functionality
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Connect Wallet functionality
    connectWalletBtn.addEventListener('click', async function() {
        if (!isWalletConnected) {
            await connectWallet();
        } else {
            disconnectWallet();
        }
    });

    // Connect wallet function
    async function connectWallet() {
        try {
            // Check if MetaMask is installed
            if (typeof window.ethereum !== 'undefined') {
                // Request account access
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });
                
                if (accounts.length > 0) {
                    connectedAddress = accounts[0];
                    isWalletConnected = true;
                    updateWalletButton();
                    console.log('Wallet connected:', connectedAddress);
                }
            } else {
                // Fallback for demo purposes - simulate wallet connection
                console.log('No crypto wallet detected - simulating connection');
                connectedAddress = '0x742d...5f3a'; // Truncated address for demo
                isWalletConnected = true;
                updateWalletButton();
            }
        } catch (error) {
            console.error('Error connecting wallet:', error);
            alert('Failed to connect wallet. Please try again.');
        }
    }

    // Disconnect wallet function
    function disconnectWallet() {
        isWalletConnected = false;
        connectedAddress = '';
        updateWalletButton();
        console.log('Wallet disconnected');
    }

    // Update wallet button appearance and text
    function updateWalletButton() {
        const walletText = connectWalletBtn.querySelector('.wallet-text');
        const walletIcon = connectWalletBtn.querySelector('.wallet-icon');
        
        if (isWalletConnected) {
            connectWalletBtn.classList.add('connected');
            walletIcon.textContent = '✅';
            walletText.textContent = `${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-4)}`;
            connectWalletBtn.title = 'Click to disconnect wallet';
        } else {
            connectWalletBtn.classList.remove('connected');
            walletIcon.textContent = '👛';
            walletText.textContent = 'Connect Wallet';
            connectWalletBtn.title = 'Connect your crypto wallet';
        }
    }

    // Listen for account changes (MetaMask)
    if (typeof window.ethereum !== 'undefined') {
        window.ethereum.on('accountsChanged', function(accounts) {
            if (accounts.length === 0) {
                disconnectWallet();
            } else if (isWalletConnected) {
                connectedAddress = accounts[0];
                updateWalletButton();
            }
        });

        // Check if already connected on page load
        window.ethereum.request({ method: 'eth_accounts' })
            .then(accounts => {
                if (accounts.length > 0) {
                    connectedAddress = accounts[0];
                    isWalletConnected = true;
                    updateWalletButton();
                }
            })
            .catch(console.error);
    }

    // Close mobile menu when clicking outside the navbar
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar')) {
            navMenu.classList.remove('active');
        }
    });

    // Close mobile menu when window is resized to desktop size
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
        }
    });

    // Optional: Add smooth scrolling for anchor links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"], .dropdown-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#') && href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                // Close mobile menu after clicking a link
                navMenu.classList.remove('active');
            }
        });
    });

    // Optional: Add active state management
    function setActiveNavItem() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link, .dropdown-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Call on page load
    setActiveNavItem();

    // Optional: Handle browser back/forward buttons
    window.addEventListener('popstate', setActiveNavItem);
});
