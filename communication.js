// Communication & Collaboration System
class CommunicationSystem {
    constructor() {
        this.selectedChat = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadConversations();
        this.loadAnnouncements();
        this.loadStaffDirectory();
        this.loadMeetings();
    }

    setupEventListeners() {
        // Tab functionality
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Modal functionality
        document.getElementById('new-announcement-btn').addEventListener('click', () => {
            this.openModal('new-announcement-modal');
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

        // Message sending
        document.getElementById('send-message').addEventListener('click', () => {
            this.sendMessage();
        });

        document.getElementById('message-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Announcement publishing
        document.getElementById('publish-announcement').addEventListener('click', () => {
            this.publishAnnouncement();
        });

        // Search functionality
        document.getElementById('conversation-search').addEventListener('input', (e) => {
            this.filterConversations(e.target.value);
        });

        document.getElementById('staff-search').addEventListener('input', (e) => {
            this.filterStaff(e.target.value);
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

    // Mock data
    conversations = [
        {
            id: 1,
            name: "Mathematics Department",
            lastMessage: "New curriculum guidelines uploaded",
            time: "2 min ago",
            unread: 3,
            type: "group"
        },
        {
            id: 2,
            name: "John Smith (Parent)",
            lastMessage: "Thank you for the update about Sarah's progress",
            time: "1 hour ago",
            unread: 0,
            type: "parent"
        },
        {
            id: 3,
            name: "Science Lab Team",
            lastMessage: "Equipment maintenance completed",
            time: "3 hours ago",
            unread: 1,
            type: "group"
        }
    ];

    announcements = [
        {
            id: 1,
            title: "Parent-Teacher Meeting Scheduled",
            content: "Annual parent-teacher meetings will be held from March 15-20, 2024. Please check the schedule.",
            author: "Principal Johnson",
            date: "2024-03-10",
            priority: "high",
            views: 156,
            pinned: true
        },
        {
            id: 2,
            title: "New Library Books Available",
            content: "We've added 200 new books to our library collection. Students can now borrow them.",
            author: "Librarian Smith",
            date: "2024-03-08",
            priority: "normal",
            views: 89,
            pinned: false
        }
    ];

    staffDirectory = [
        {
            id: 1,
            name: "Dr. Emily Johnson",
            role: "Principal",
            department: "Administration",
            email: "emily.johnson@school.edu",
            phone: "+234-801-234-5678",
            status: "online"
        },
        {
            id: 2,
            name: "Prof. Michael Brown",
            role: "Head of Mathematics",
            department: "Mathematics",
            email: "michael.brown@school.edu",
            phone: "+234-802-234-5678",
            status: "busy"
        }
    ];

    meetings = [
        {
            id: 1,
            title: "Parent-Teacher Conference",
            date: "15 MAR",
            time: "2:00 PM - 4:00 PM",
            department: "Mathematics Department",
            participants: 12
        },
        {
            id: 2,
            title: "Staff Weekly Meeting",
            date: "18 MAR",
            time: "10:00 AM - 11:00 AM",
            department: "All Departments",
            participants: 25
        }
    ];

    loadConversations() {
        const container = document.getElementById('conversation-list');
        container.innerHTML = this.conversations.map(conversation => `
            <div class="conversation-item ${this.selectedChat === conversation.id ? 'active' : ''}" 
                 data-conversation-id="${conversation.id}">
                <div class="conversation-avatar">
                    ${conversation.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div class="conversation-content">
                    <div class="conversation-header">
                        <h4>${conversation.name}</h4>
                        <span class="conversation-time">${conversation.time}</span>
                    </div>
                    <p class="conversation-preview">${conversation.lastMessage}</p>
                </div>
                ${conversation.unread > 0 ? `
                    <div class="conversation-badge">${conversation.unread}</div>
                ` : ''}
            </div>
        `).join('');

        // Add click event listeners
        document.querySelectorAll('.conversation-item').forEach(item => {
            item.addEventListener('click', () => {
                const conversationId = parseInt(item.dataset.conversationId);
                this.selectConversation(conversationId);
            });
        });
    }

    selectConversation(conversationId) {
        this.selectedChat = conversationId;
        
        // Update UI
        document.querySelectorAll('.conversation-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-conversation-id="${conversationId}"]`).classList.add('active');

        const conversation = this.conversations.find(c => c.id === conversationId);
        document.getElementById('selected-chat-name').textContent = conversation.name;
        document.getElementById('chat-actions').style.display = 'flex';
        document.getElementById('chat-input').style.display = 'block';

        // Load chat messages
        this.loadChatMessages(conversationId);
    }

    loadChatMessages(conversationId) {
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.innerHTML = `
            <div class="chat-message received">
                <div class="message-avatar">${this.conversations.find(c => c.id === conversationId).name.split(' ').map(n => n[0]).join('')}</div>
                <div class="message-content">
                    <p>Hello! I wanted to discuss the upcoming parent-teacher meeting.</p>
                    <span class="message-time">10:30 AM</span>
                </div>
            </div>
            <div class="chat-message sent">
                <div class="message-content">
                    <p>Of course! I'm available this afternoon. What time works best for you?</p>
                    <span class="message-time">10:32 AM</span>
                </div>
                <div class="message-avatar">You</div>
            </div>
        `;
    }

    sendMessage() {
        const input = document.getElementById('message-input');
        const message = input.value.trim();
        
        if (message && this.selectedChat) {
            const messagesContainer = document.getElementById('chat-messages');
            const newMessage = `
                <div class="chat-message sent">
                    <div class="message-content">
                        <p>${message}</p>
                        <span class="message-time">Just now</span>
                    </div>
                    <div class="message-avatar">You</div>
                </div>
            `;
            messagesContainer.innerHTML += newMessage;
            input.value = '';
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    loadAnnouncements() {
        const container = document.getElementById('announcements-list');
        container.innerHTML = this.announcements.map(announcement => `
            <div class="announcement-card ${announcement.pinned ? 'pinned' : ''}">
                <div class="announcement-header">
                    <div class="announcement-title">
                        ${announcement.pinned ? '<i data-lucide="pin"></i>' : ''}
                        <h4>${announcement.title}</h4>
                        <span class="badge ${this.getPriorityColor(announcement.priority)}">${announcement.priority}</span>
                    </div>
                    <div class="announcement-views">
                        <i data-lucide="eye"></i>
                        <span>${announcement.views}</span>
                    </div>
                </div>
                <div class="announcement-meta">
                    By ${announcement.author} • ${announcement.date}
                </div>
                <div class="announcement-content">
                    ${announcement.content}
                </div>
            </div>
        `).join('');

        // Re-initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    loadStaffDirectory() {
        const container = document.getElementById('staff-grid');
        container.innerHTML = this.staffDirectory.map(staff => `
            <div class="staff-card">
                <div class="staff-header">
                    <div class="staff-avatar">
                        ${staff.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div class="staff-info">
                        <h4>${staff.name}</h4>
                        <p>${staff.role}</p>
                        <div class="staff-status">
                            <div class="status-dot ${staff.status}"></div>
                            <span>${staff.status}</span>
                        </div>
                    </div>
                </div>
                <div class="staff-details">
                    <p><strong>Department:</strong> ${staff.department}</p>
                    <p class="staff-contact">
                        <i data-lucide="mail"></i>
                        ${staff.email}
                    </p>
                    <p class="staff-contact">
                        <i data-lucide="phone"></i>
                        ${staff.phone}
                    </p>
                </div>
                <div class="staff-actions">
                    <button class="btn btn-outline btn-sm">
                        <i data-lucide="message-square"></i>
                        Message
                    </button>
                    <button class="btn btn-outline btn-sm">
                        <i data-lucide="phone"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Re-initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    loadMeetings() {
        const container = document.getElementById('meetings-list');
        container.innerHTML = this.meetings.map(meeting => `
            <div class="meeting-card">
                <div class="meeting-date">
                    <div class="date-number">${meeting.date.split(' ')[0]}</div>
                    <div class="date-month">${meeting.date.split(' ')[1]}</div>
                </div>
                <div class="meeting-details">
                    <h4>${meeting.title}</h4>
                    <p>${meeting.department} • ${meeting.time}</p>
                    <div class="meeting-participants">
                        <i data-lucide="users"></i>
                        <span>${meeting.participants} participants</span>
                    </div>
                </div>
                <div class="meeting-actions">
                    <button class="btn btn-outline btn-sm">
                        <i data-lucide="video"></i>
                        Join
                    </button>
                    <button class="btn btn-outline btn-sm">
                        Details
                    </button>
                </div>
            </div>
        `).join('');

        // Re-initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    getPriorityColor(priority) {
        switch (priority) {
            case "high": return "destructive";
            case "medium": return "outline";
            default: return "secondary";
        }
    }

    filterConversations(searchTerm) {
        const filtered = this.conversations.filter(conversation =>
            conversation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        const container = document.getElementById('conversation-list');
        container.innerHTML = filtered.map(conversation => `
            <div class="conversation-item ${this.selectedChat === conversation.id ? 'active' : ''}" 
                 data-conversation-id="${conversation.id}">
                <div class="conversation-avatar">
                    ${conversation.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div class="conversation-content">
                    <div class="conversation-header">
                        <h4>${conversation.name}</h4>
                        <span class="conversation-time">${conversation.time}</span>
                    </div>
                    <p class="conversation-preview">${conversation.lastMessage}</p>
                </div>
                ${conversation.unread > 0 ? `
                    <div class="conversation-badge">${conversation.unread}</div>
                ` : ''}
            </div>
        `).join('');

        // Re-add click event listeners
        document.querySelectorAll('.conversation-item').forEach(item => {
            item.addEventListener('click', () => {
                const conversationId = parseInt(item.dataset.conversationId);
                this.selectConversation(conversationId);
            });
        });
    }

    filterStaff(searchTerm) {
        const filtered = this.staffDirectory.filter(staff =>
            staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.department.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        const container = document.getElementById('staff-grid');
        container.innerHTML = filtered.map(staff => `
            <div class="staff-card">
                <div class="staff-header">
                    <div class="staff-avatar">
                        ${staff.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div class="staff-info">
                        <h4>${staff.name}</h4>
                        <p>${staff.role}</p>
                        <div class="staff-status">
                            <div class="status-dot ${staff.status}"></div>
                            <span>${staff.status}</span>
                        </div>
                    </div>
                </div>
                <div class="staff-details">
                    <p><strong>Department:</strong> ${staff.department}</p>
                    <p class="staff-contact">
                        <i data-lucide="mail"></i>
                        ${staff.email}
                    </p>
                    <p class="staff-contact">
                        <i data-lucide="phone"></i>
                        ${staff.phone}
                    </p>
                </div>
                <div class="staff-actions">
                    <button class="btn btn-outline btn-sm">
                        <i data-lucide="message-square"></i>
                        Message
                    </button>
                    <button class="btn btn-outline btn-sm">
                        <i data-lucide="phone"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Re-initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    publishAnnouncement() {
        const title = document.getElementById('announcement-title').value;
        const content = document.getElementById('announcement-content').value;
        const priority = document.getElementById('announcement-priority').value;
        const target = document.getElementById('announcement-target').value;

        if (!title || !content) {
            this.showNotification('Please fill all required fields', 'error');
            return;
        }

        // Simulate API call
        setTimeout(() => {
            this.showNotification('Announcement published successfully', 'success');
            this.closeModal(document.getElementById('new-announcement-modal'));
            
            // Reset form
            document.getElementById('announcement-title').value = '';
            document.getElementById('announcement-content').value = '';
            document.getElementById('announcement-priority').value = 'normal';
            document.getElementById('announcement-target').value = 'all';
        }, 1000);
    }

    showNotification(message, type = 'info') {
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
    new CommunicationSystem();
});