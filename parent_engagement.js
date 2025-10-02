// Parent Engagement System
class ParentEngagementSystem {
    constructor() {
        this.selectedMessage = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadParentAnnouncements();
        this.loadParentMessages();
        this.loadEngagementActivity();
    }

    setupEventListeners() {
        // Tab functionality
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Modal functionality
        document.getElementById('new-parent-announcement-btn').addEventListener('click', () => {
            this.openModal('new-parent-announcement-modal');
        });

        document.getElementById('send-message-btn').addEventListener('click', () => {
            this.openModal('send-message-modal');
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
        document.getElementById('publish-parent-announcement').addEventListener('click', () => {
            this.publishParentAnnouncement();
        });

        document.getElementById('send-parent-message').addEventListener('click', () => {
            this.sendParentMessage();
        });

        document.getElementById('save-draft-btn').addEventListener('click', () => {
            this.saveAnnouncementDraft();
        });

        document.getElementById('save-message-draft').addEventListener('click', () => {
            this.saveMessageDraft();
        });

        // Search and filter functionality
        document.getElementById('announcement-search').addEventListener('input', (e) => {
            this.filterAnnouncements(e.target.value);
        });

        document.getElementById('priority-filter').addEventListener('change', (e) => {
            this.filterByPriority(e.target.value);
        });

        document.getElementById('message-search').addEventListener('input', (e) => {
            this.filterMessages(e.target.value);
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
    parentAnnouncements = [
        {
            id: 1,
            title: "Parent-Teacher Meeting Scheduled",
            content: "We have scheduled parent-teacher meetings for all classes. Please confirm your attendance.",
            priority: "high",
            audience: "All Parents",
            status: "published",
            date: "2024-01-15",
            author: "Admin Office",
            views: 145,
            responses: 23
        },
        {
            id: 2,
            title: "School Fee Payment Reminder",
            content: "Friendly reminder that the second term fees are due by January 20th, 2024.",
            priority: "medium",
            audience: "Fee Defaulters",
            status: "draft",
            date: "2024-01-10",
            author: "Accounts Department",
            views: 87,
            responses: 12
        }
    ];

    parentMessages = [
        {
            id: 1,
            parentName: "Mrs. Sarah Johnson",
            studentName: "Michael Johnson",
            class: "JSS 2A",
            subject: "Academic Performance Inquiry",
            message: "I would like to discuss my son's mathematics performance this term.",
            date: "2024-01-15 10:30 AM",
            status: "unread",
            priority: "medium",
            phone: "+234 801 234 5678",
            email: "sarah.johnson@email.com"
        },
        {
            id: 2,
            parentName: "Mr. David Okafor",
            studentName: "Grace Okafor",
            class: "SS 1B",
            subject: "Permission for School Trip",
            message: "I am writing to give permission for my daughter to participate in the upcoming science excursion.",
            date: "2024-01-14 2:15 PM",
            status: "read",
            priority: "low",
            phone: "+234 802 345 6789",
            email: "d.okafor@email.com"
        }
    ];

    engagementActivities = [
        { parent: "Mrs. Johnson", action: "Responded to fee reminder", time: "2 hours ago", type: "response" },
        { parent: "Mr. Okafor", action: "Viewed sports day announcement", time: "4 hours ago", type: "view" },
        { parent: "Mrs. Abdullahi", action: "Sent message about medical leave", time: "6 hours ago", type: "message" }
    ];

    loadParentAnnouncements() {
        const container = document.getElementById('parent-announcements-list');
        container.innerHTML = this.parentAnnouncements.map(announcement => `
            <div class="announcement-card ${announcement.status === 'draft' ? 'draft' : ''}">
                <div class="announcement-header">
                    <div class="announcement-title">
                        <h4>${announcement.title}</h4>
                        <div class="announcement-badges">
                            <span class="badge ${this.getPriorityColor(announcement.priority)}">${announcement.priority}</span>
                            <span class="badge ${this.getStatusColor(announcement.status)}">${announcement.status}</span>
                        </div>
                    </div>
                    <div class="announcement-actions">
                        <button class="btn btn-ghost btn-sm view-announcement" data-id="${announcement.id}">
                            <i data-lucide="eye"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm edit-announcement" data-id="${announcement.id}">
                            <i data-lucide="edit"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm delete-announcement" data-id="${announcement.id}">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
                <div class="announcement-meta">
                    By ${announcement.author} • ${announcement.date}
                </div>
                <div class="announcement-content">
                    ${announcement.content}
                </div>
                <div class="announcement-footer">
                    <span>Audience: ${announcement.audience}</span>
                    <div class="announcement-stats">
                        <span class="stat">
                            <i data-lucide="eye"></i>
                            ${announcement.views} views
                        </span>
                        <span class="stat">
                            <i data-lucide="message-square"></i>
                            ${announcement.responses} responses
                        </span>
                    </div>
                </div>
            </div>
        `).join('');

        // Re-initialize Lucide icons and add event listeners
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        this.setupAnnouncementEventListeners();
    }

    loadParentMessages() {
        const tableBody = document.getElementById('parent-messages-table');
        tableBody.innerHTML = this.parentMessages.map(message => `
            <tr>
                <td>
                    <div class="user-info">
                        <div class="user-avatar">
                            ${message.parentName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <div class="user-name">${message.parentName}</div>
                            <div class="user-contact">
                                <i data-lucide="phone"></i>
                                ${message.phone}
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div>
                        <div class="student-name">${message.studentName}</div>
                        <div class="student-class">${message.class}</div>
                    </div>
                </td>
                <td>${message.subject}</td>
                <td class="text-muted">${message.date}</td>
                <td>${this.getStatusBadge(message.status)}</td>
                <td>${this.getPriorityBadge(message.priority)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-ghost btn-sm view-message" data-id="${message.id}">
                            <i data-lucide="eye"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm reply-message" data-id="${message.id}">
                            <i data-lucide="send"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm call-parent" data-id="${message.id}">
                            <i data-lucide="phone"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Re-initialize Lucide icons and add event listeners
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        this.setupMessageEventListeners();
    }

    loadEngagementActivity() {
        const container = document.getElementById('engagement-activity');
        container.innerHTML = this.engagementActivities.map(activity => `
            <div class="activity-item">
                <div class="activity-indicator"></div>
                <div class="activity-content">
                    <div class="activity-header">
                        <span class="activity-parent">${activity.parent}</span>
                        <span class="activity-time">${activity.time}</span>
                    </div>
                    <div class="activity-action">${activity.action}</div>
                </div>
            </div>
        `).join('');
    }

    setupAnnouncementEventListeners() {
        document.querySelectorAll('.view-announcement').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const announcementId = parseInt(e.target.closest('button').dataset.id);
                this.viewAnnouncement(announcementId);
            });
        });

        document.querySelectorAll('.edit-announcement').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const announcementId = parseInt(e.target.closest('button').dataset.id);
                this.editAnnouncement(announcementId);
            });
        });

        document.querySelectorAll('.delete-announcement').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const announcementId = parseInt(e.target.closest('button').dataset.id);
                this.deleteAnnouncement(announcementId);
            });
        });
    }

    setupMessageEventListeners() {
        document.querySelectorAll('.view-message').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const messageId = parseInt(e.target.closest('button').dataset.id);
                this.viewMessage(messageId);
            });
        });

        document.querySelectorAll('.reply-message').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const messageId = parseInt(e.target.closest('button').dataset.id);
                this.replyToMessage(messageId);
            });
        });

        document.querySelectorAll('.call-parent').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const messageId = parseInt(e.target.closest('button').dataset.id);
                this.callParent(messageId);
            });
        });
    }

    getPriorityColor(priority) {
        switch (priority) {
            case "high": return "destructive";
            case "medium": return "default";
            case "low": return "secondary";
            default: return "outline";
        }
    }

    getStatusColor(status) {
        switch (status) {
            case "published": return "default";
            case "draft": return "secondary";
            default: return "outline";
        }
    }

    getStatusBadge(status) {
        const statusConfig = {
            unread: { variant: "destructive", label: "Unread" },
            read: { variant: "default", label: "Read" },
            replied: { variant: "default", label: "Replied" }
        };
        
        const config = statusConfig[status] || statusConfig.read;
        return `<span class="badge ${config.variant}">${config.label}</span>`;
    }

    getPriorityBadge(priority) {
        const config = {
            high: { variant: "destructive", label: "High" },
            medium: { variant: "default", label: "Medium" },
            low: { variant: "secondary", label: "Low" }
        };
        
        const priorityConfig = config[priority] || config.medium;
        return `<span class="badge ${priorityConfig.variant}">${priorityConfig.label}</span>`;
    }

    filterAnnouncements(searchTerm) {
        const filtered = this.parentAnnouncements.filter(announcement =>
            announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            announcement.author.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        this.renderFilteredAnnouncements(filtered);
    }

    filterByPriority(priority) {
        const filtered = priority === 'all' 
            ? this.parentAnnouncements 
            : this.parentAnnouncements.filter(announcement => announcement.priority === priority);
        
        this.renderFilteredAnnouncements(filtered);
    }

    filterMessages(searchTerm) {
        const filtered = this.parentMessages.filter(message =>
            message.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.subject.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        this.renderFilteredMessages(filtered);
    }

    renderFilteredAnnouncements(announcements) {
        const container = document.getElementById('parent-announcements-list');
        container.innerHTML = announcements.map(announcement => `
            <div class="announcement-card ${announcement.status === 'draft' ? 'draft' : ''}">
                <div class="announcement-header">
                    <div class="announcement-title">
                        <h4>${announcement.title}</h4>
                        <div class="announcement-badges">
                            <span class="badge ${this.getPriorityColor(announcement.priority)}">${announcement.priority}</span>
                            <span class="badge ${this.getStatusColor(announcement.status)}">${announcement.status}</span>
                        </div>
                    </div>
                    <div class="announcement-actions">
                        <button class="btn btn-ghost btn-sm view-announcement" data-id="${announcement.id}">
                            <i data-lucide="eye"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm edit-announcement" data-id="${announcement.id}">
                            <i data-lucide="edit"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm delete-announcement" data-id="${announcement.id}">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
                <div class="announcement-meta">
                    By ${announcement.author} • ${announcement.date}
                </div>
                <div class="announcement-content">
                    ${announcement.content}
                </div>
                <div class="announcement-footer">
                    <span>Audience: ${announcement.audience}</span>
                    <div class="announcement-stats">
                        <span class="stat">
                            <i data-lucide="eye"></i>
                            ${announcement.views} views
                        </span>
                        <span class="stat">
                            <i data-lucide="message-square"></i>
                            ${announcement.responses} responses
                        </span>
                    </div>
                </div>
            </div>
        `).join('');

        // Re-initialize Lucide icons and add event listeners
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        this.setupAnnouncementEventListeners();
    }

    renderFilteredMessages(messages) {
        const tableBody = document.getElementById('parent-messages-table');
        tableBody.innerHTML = messages.map(message => `
            <tr>
                <td>
                    <div class="user-info">
                        <div class="user-avatar">
                            ${message.parentName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <div class="user-name">${message.parentName}</div>
                            <div class="user-contact">
                                <i data-lucide="phone"></i>
                                ${message.phone}
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div>
                        <div class="student-name">${message.studentName}</div>
                        <div class="student-class">${message.class}</div>
                    </div>
                </td>
                <td>${message.subject}</td>
                <td class="text-muted">${message.date}</td>
                <td>${this.getStatusBadge(message.status)}</td>
                <td>${this.getPriorityBadge(message.priority)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-ghost btn-sm view-message" data-id="${message.id}">
                            <i data-lucide="eye"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm reply-message" data-id="${message.id}">
                            <i data-lucide="send"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm call-parent" data-id="${message.id}">
                            <i data-lucide="phone"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Re-initialize Lucide icons and add event listeners
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        this.setupMessageEventListeners();
    }

    viewAnnouncement(announcementId) {
        const announcement = this.parentAnnouncements.find(a => a.id === announcementId);
        this.showNotification(`Viewing announcement: ${announcement.title}`, 'info');
    }

    editAnnouncement(announcementId) {
        const announcement = this.parentAnnouncements.find(a => a.id === announcementId);
        this.showNotification(`Editing announcement: ${announcement.title}`, 'info');
    }

    deleteAnnouncement(announcementId) {
        if (confirm('Are you sure you want to delete this announcement?')) {
            this.parentAnnouncements = this.parentAnnouncements.filter(a => a.id !== announcementId);
            this.loadParentAnnouncements();
            this.showNotification('Announcement deleted successfully', 'success');
        }
    }

    viewMessage(messageId) {
        this.selectedMessage = this.parentMessages.find(m => m.id === messageId);
        this.showMessageDetail();
    }

    showMessageDetail() {
        if (!this.selectedMessage) return;

        const content = document.getElementById('message-detail-content');
        content.innerHTML = `
            <div class="message-header">
                <div class="message-sender">
                    <div class="user-avatar large">
                        ${this.selectedMessage.parentName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <h4>${this.selectedMessage.parentName}</h4>
                        <p>Parent of ${this.selectedMessage.studentName} (${this.selectedMessage.class})</p>
                    </div>
                </div>
                <div class="message-actions">
                    <button class="btn btn-outline btn-sm" id="call-parent-btn">
                        <i data-lucide="phone"></i>
                        Call
                    </button>
                    <button class="btn btn-outline btn-sm" id="email-parent-btn">
                        <i data-lucide="mail"></i>
                        Email
                    </button>
                </div>
            </div>
            
            <div class="message-details">
                <div class="message-meta">
                    <h5>Subject: ${this.selectedMessage.subject}</h5>
                    <p class="message-date">${this.selectedMessage.date}</p>
                </div>
                <div class="message-content">
                    <p>${this.selectedMessage.message}</p>
                </div>
            </div>

            <div class="message-reply">
                <label for="reply-content">Reply to Parent</label>
                <textarea id="reply-content" class="form-input" placeholder="Type your reply here..." rows="4"></textarea>
                <div class="reply-actions">
                    <button class="btn btn-outline" id="close-message-btn">
                        Close
                    </button>
                    <button class="btn btn-primary" id="send-reply-btn">
                        <i data-lucide="send"></i>
                        Send Reply
                    </button>
                </div>
            </div>
        `;

        // Add event listeners for the new buttons
        document.getElementById('call-parent-btn').addEventListener('click', () => {
            this.callParent(this.selectedMessage.id);
        });

        document.getElementById('email-parent-btn').addEventListener('click', () => {
            this.emailParent(this.selectedMessage.id);
        });

        document.getElementById('close-message-btn').addEventListener('click', () => {
            this.closeModal(document.getElementById('message-detail-modal'));
        });

        document.getElementById('send-reply-btn').addEventListener('click', () => {
            this.sendReply();
        });

        this.openModal('message-detail-modal');

        // Re-initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    replyToMessage(messageId) {
        this.selectedMessage = this.parentMessages.find(m => m.id === messageId);
        this.showMessageDetail();
    }

    callParent(messageId) {
        const message = this.parentMessages.find(m => m.id === messageId);
        this.showNotification(`Calling ${message.parentName} at ${message.phone}`, 'info');
    }

    emailParent(messageId) {
        const message = this.parentMessages.find(m => m.id === messageId);
        this.showNotification(`Opening email to ${message.email}`, 'info');
    }

    sendReply() {
        const replyContent = document.getElementById('reply-content').value;
        if (replyContent.trim()) {
            this.showNotification('Reply sent successfully', 'success');
            this.closeModal(document.getElementById('message-detail-modal'));
        } else {
            this.showNotification('Please enter a reply message', 'error');
        }
    }

    publishParentAnnouncement() {
        const title = document.getElementById('parent-announcement-title').value;
        const content = document.getElementById('parent-announcement-content').value;
        const priority = document.getElementById('parent-announcement-priority').value;
        const audience = document.getElementById('parent-announcement-audience').value;

        if (!title || !content) {
            this.showNotification('Please fill all required fields', 'error');
            return;
        }

        // Simulate API call
        setTimeout(() => {
            this.showNotification('Announcement published successfully', 'success');
            this.closeModal(document.getElementById('new-parent-announcement-modal'));
            
            // Reset form
            document.getElementById('parent-announcement-title').value = '';
            document.getElementById('parent-announcement-content').value = '';
            document.getElementById('parent-announcement-priority').value = 'high';
            document.getElementById('parent-announcement-audience').value = 'all';
        }, 1000);
    }

    sendParentMessage() {
        const recipient = document.getElementById('message-recipient').value;
        const subject = document.getElementById('message-subject').value;
        const content = document.getElementById('message-content').value;

        if (!recipient || !subject || !content) {
            this.showNotification('Please fill all required fields', 'error');
            return;
        }

        // Simulate API call
        setTimeout(() => {
            this.showNotification('Message sent successfully', 'success');
            this.closeModal(document.getElementById('send-message-modal'));
            
            // Reset form
            document.getElementById('message-recipient').value = '';
            document.getElementById('message-subject').value = '';
            document.getElementById('message-content').value = '';
        }, 1000);
    }

    saveAnnouncementDraft() {
        this.showNotification('Announcement saved as draft', 'info');
        this.closeModal(document.getElementById('new-parent-announcement-modal'));
    }

    saveMessageDraft() {
        this.showNotification('Message saved as draft', 'info');
        this.closeModal(document.getElementById('send-message-modal'));
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
            background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
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
    new ParentEngagementSystem();
});