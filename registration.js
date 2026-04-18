/**
 * EventOrch Registration Module
 * Handles the secure spot booking flow.
 */

window.Registration = (function() {
    let selectedEventId = '';
    
    const regModal = document.getElementById('reg-modal');
    const regMsg = document.getElementById('reg-msg');
    const regTitle = document.getElementById('reg-title');
    const regDesc = document.getElementById('reg-desc');
    const regDate = document.getElementById('reg-date');
    const regCap = document.getElementById('reg-capacity');
    const regBadge = document.getElementById('reg-badge');
    const confirmBtn = document.getElementById('confirm-reg-btn');

    async function openModal(eventId) {
        try {
            const user = await window.auth.getUser();
            if (!user) {
                window.openAuthModal();
                return;
            }

            selectedEventId = eventId;
            regMsg.textContent = '';
            
            // Get event data from the main script's store
            const event = window.getEventById(eventId);
            if (!event) throw new Error('Event data not found. Please refresh.');

            // Populate Modal
            regTitle.textContent = event.title;
            regDesc.textContent = event.description;
            regDate.textContent = new Date(event.date).toLocaleDateString();
            regCap.textContent = `Max Space: ${event.capacity}`;
            regBadge.className = `badge ${event.category.toLowerCase()}`;
            regBadge.textContent = event.category;

            regModal.setAttribute('aria-hidden', 'false');
        } catch (e) {
            alert(e.message);
        }
    }

    function closeModal() {
        regModal.setAttribute('aria-hidden', 'true');
    }

    async function handleConfirm() {
        if (!selectedEventId) return;
        
        try {
            confirmBtn.disabled = true;
            regMsg.textContent = 'Securing your spot...';
            
            await window.db.registerForEvent(selectedEventId);
            
            regMsg.textContent = 'Success! Your ticket is ready.';
            
            // Auto-refresh tickets if list is open
            if (typeof window.refreshTicketList === 'function') {
                window.refreshTicketList();
            }

            setTimeout(() => {
                closeModal();
                confirmBtn.disabled = false;
            }, 2000);
        } catch (e) {
            regMsg.textContent = e.message;
            confirmBtn.disabled = false;
        }
    }

    // Initialize
    if (confirmBtn) {
        confirmBtn.onclick = handleConfirm;
    }

    return {
        openModal,
        closeModal
    };
})();
