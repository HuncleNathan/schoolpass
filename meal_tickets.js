// Meal Tickets System Functionality
class MealTicketSystem {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadStudentAccounts();
        this.loadVendors();
        this.loadTransactions();
    }

    setupEventListeners() {
        // Tab functionality
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Modal functionality
        document.getElementById('top-up-modal-btn').addEventListener('click', () => {
            this.openModal('top-up-modal');
        });

        document.getElementById('add-vendor-modal-btn').addEventListener('click', () => {
            this.openModal('add-vendor-modal');
        });

        // Close modals
        document.querySelectorAll('.modal-close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                this.closeModal(e.target.closest('.modal'));
            });
        });

        // Close modal when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });

        // Form submissions
        document.getElementById('process-top-up').addEventListener('click', () => {
            this.processTopUp();
        });

        document.getElementById('add-vendor').addEventListener('click', () => {
            this.addVendor();
        });

        // Search functionality
        document.getElementById('student-search').addEventListener('input', (e) => {
            this.filterStudentAccounts(e.target.value);
        });

        // Vendor filter
        document.getElementById('vendor-filter').addEventListener('change', (e) => {
            this.filterTransactions(e.target.value);
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    openModal(modalId) {
        document.getElementById(modalId).style.display = 'flex';
    }

    closeModal(modal) {
        modal.style.display = 'none';
    }

    // Mock data for student accounts
    studentAccounts = [
        { 
            id: "ST001", 
            name: "Alice Johnson", 
            class: "Grade 10A", 
            balance: 150.50, 
            status: "active",
            lastTransaction: "2024-01-15"
        },
        { 
            id: "ST002", 
            name: "Bob Smith", 
            class: "Grade 9B", 
            balance: 25.75, 
            status: "low_balance",
            lastTransaction: "2024-01-14"
        },
        { 
            id: "ST003", 
            name: "Carol Davis", 
            class: "Grade 11C", 
            balance: 0.00, 
            status: "inactive",
            lastTransaction: "2024-01-10"
        }
    ];

    // Mock data for vendors
    vendors = [
        { 
            id: "V001", 
            name: "School Cafeteria", 
            type: "internal", 
            commission: 0, 
            totalSales: 2450.00, 
            status: "active"
        },
        { 
            id: "V002", 
            name: "Healthy Bites Co.", 
            type: "external", 
            commission: 15, 
            totalSales: 1875.50, 
            status: "active"
        },
        { 
            id: "V003", 
            name: "Fresh Foods Ltd.", 
            type: "external", 
            commission: 12, 
            totalSales: 980.25, 
            status: "pending"
        }
    ];

    // Mock data for transactions
    transactions = [
        { 
            id: "T001", 
            student: "Alice Johnson", 
            vendor: "School Cafeteria", 
            amount: -12.50, 
            type: "purchase", 
            date: "2024-01-15 12:30"
        },
        { 
            id: "T002", 
            student: "Bob Smith", 
            vendor: "Healthy Bites Co.", 
            amount: -8.75, 
            type: "purchase", 
            date: "2024-01-15 11:45"
        },
        { 
            id: "T003", 
            student: "Alice Johnson", 
            vendor: "Top-up", 
            amount: +50.00, 
            type: "top_up", 
            date: "2024-01-14 09:15"
        }
    ];

    loadStudentAccounts() {
        const tableBody = document.getElementById('student-accounts-table');
        tableBody.innerHTML = this.studentAccounts.map(account => `
            <tr>
                <td class="font-medium">${account.id}</td>
                <td>${account.name}</td>
                <td>${account.class}</td>
                <td>
                    <span class="${account.balance < 30 ? 'text-destructive font-medium' : ''}">
                        $${account.balance.toFixed(2)}
                    </span>
                </td>
                <td>${this.getStatusBadge(account.status)}</td>
                <td>${account.lastTransaction}</td>
                <td>
                    <div class="flex space-x-2">
                        <button class="btn btn-outline btn-sm top-up-btn" data-student-id="${account.id}">
                            <i data-lucide="credit-card"></i>
                            Top Up
                        </button>
                        <button class="btn btn-outline btn-sm history-btn" data-student-id="${account.id}">
                            <i data-lucide="history"></i>
                            History
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Re-initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    loadVendors() {
        const tableBody = document.getElementById('vendors-table');
        tableBody.innerHTML = this.vendors.map(vendor => `
            <tr>
                <td class="font-medium">${vendor.id}</td>
                <td>${vendor.name}</td>
                <td>${this.getTypeBadge(vendor.type)}</td>
                <td>${vendor.commission}%</td>
                <td>$${vendor.totalSales.toFixed(2)}</td>
                <td>${this.getStatusBadge(vendor.status)}</td>
                <td>
                    <div class="flex space-x-2">
                        <button class="btn btn-outline btn-sm edit-vendor-btn" data-vendor-id="${vendor.id}">
                            Edit
                        </button>
                        <button class="btn btn-outline btn-sm reports-btn" data-vendor-id="${vendor.id}">
                            <i data-lucide="trending-up"></i>
                            Reports
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Re-initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    loadTransactions() {
        const tableBody = document.getElementById('transactions-table');
        tableBody.innerHTML = this.transactions.map(transaction => `
            <tr>
                <td class="font-medium">${transaction.id}</td>
                <td>${transaction.student}</td>
                <td>${transaction.vendor}</td>
                <td>
                    <span class="${transaction.amount > 0 ? 'text-success' : 'text-destructive'}">
                        $${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                </td>
                <td>${this.getTransactionTypeBadge(transaction.type)}</td>
                <td>${transaction.date}</td>
            </tr>
        `).join('');

        // Re-initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    getStatusBadge(status) {
        const statusConfig = {
            active: { variant: "success", label: "Active" },
            low_balance: { variant: "warning", label: "Low Balance" },
            inactive: { variant: "destructive", label: "Inactive" },
            pending: { variant: "outline", label: "Pending" }
        };
        
        const config = statusConfig[status] || statusConfig.active;
        return `<span class="badge ${config.variant}">${config.label}</span>`;
    }

    getTypeBadge(type) {
        const variant = type === "internal" ? "default" : "secondary";
        return `<span class="badge ${variant}">${type}</span>`;
    }

    getTransactionTypeBadge(type) {
        const variant = type === "purchase" ? "destructive" : "default";
        const label = type === "purchase" ? "Purchase" : "Top Up";
        return `<span class="badge ${variant}">${label}</span>`;
    }

    filterStudentAccounts(searchTerm) {
        const filtered = this.studentAccounts.filter(account =>
            account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            account.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            account.class.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        const tableBody = document.getElementById('student-accounts-table');
        tableBody.innerHTML = filtered.map(account => `
            <tr>
                <td class="font-medium">${account.id}</td>
                <td>${account.name}</td>
                <td>${account.class}</td>
                <td>
                    <span class="${account.balance < 30 ? 'text-destructive font-medium' : ''}">
                        $${account.balance.toFixed(2)}
                    </span>
                </td>
                <td>${this.getStatusBadge(account.status)}</td>
                <td>${account.lastTransaction}</td>
                <td>
                    <div class="flex space-x-2">
                        <button class="btn btn-outline btn-sm top-up-btn" data-student-id="${account.id}">
                            <i data-lucide="credit-card"></i>
                            Top Up
                        </button>
                        <button class="btn btn-outline btn-sm history-btn" data-student-id="${account.id}">
                            <i data-lucide="history"></i>
                            History
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Re-initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    filterTransactions(vendor) {
        const filtered = vendor === 'all' 
            ? this.transactions 
            : this.transactions.filter(transaction => 
                transaction.vendor.toLowerCase().includes(vendor.toLowerCase())
            );
        
        const tableBody = document.getElementById('transactions-table');
        tableBody.innerHTML = filtered.map(transaction => `
            <tr>
                <td class="font-medium">${transaction.id}</td>
                <td>${transaction.student}</td>
                <td>${transaction.vendor}</td>
                <td>
                    <span class="${transaction.amount > 0 ? 'text-success' : 'text-destructive'}">
                        $${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                </td>
                <td>${this.getTransactionTypeBadge(transaction.type)}</td>
                <td>${transaction.date}</td>
            </tr>
        `).join('');

        // Re-initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    processTopUp() {
        const studentId = document.getElementById('student-id').value;
        const amount = document.getElementById('amount').value;
        const paymentMethod = document.getElementById('payment-method').value;

        if (!studentId || !amount || !paymentMethod) {
            this.showNotification('Please fill all fields', 'error');
            return;
        }

        // Simulate API call
        setTimeout(() => {
            this.showNotification(`Successfully topped up $${amount} for student ${studentId}`, 'success');
            this.closeModal(document.getElementById('top-up-modal'));
            
            // Reset form
            document.getElementById('student-id').value = '';
            document.getElementById('amount').value = '';
            document.getElementById('payment-method').value = '';
        }, 1000);
    }

    addVendor() {
        const vendorName = document.getElementById('vendor-name').value;
        const vendorType = document.getElementById('vendor-type').value;
        const commission = document.getElementById('commission').value;

        if (!vendorName || !vendorType) {
            this.showNotification('Please fill all required fields', 'error');
            return;
        }

        // Simulate API call
        setTimeout(() => {
            this.showNotification(`Successfully added vendor ${vendorName}`, 'success');
            this.closeModal(document.getElementById('add-vendor-modal'));
            
            // Reset form
            document.getElementById('vendor-name').value = '';
            document.getElementById('vendor-type').value = '';
            document.getElementById('commission').value = '';
        }, 1000);
    }

    showNotification(message, type = 'info') {
        // Use your existing notification system or create a simple one
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 4px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize the system
document.addEventListener('DOMContentLoaded', function() {
    new MealTicketSystem();
});