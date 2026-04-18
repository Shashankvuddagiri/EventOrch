/**
 * EventOrch Registration Module v2
 * Handles expanded metadata (phone, department, role).
 */

window.Registration = (function() {
    let selectedEventId = '';
    
    // Modal & Alert Elements
    const regModal = document.getElementById('reg-modal');
    const regMsg = document.getElementById('reg-msg');
    const regTitle = document.getElementById('reg-title');
    const regDesc = document.getElementById('reg-desc');
    const regDate = document.getElementById('reg-date');
    const regCap = document.getElementById('reg-capacity');
    const regBadge = document.getElementById('reg-badge');
    const confirmBtn = document.getElementById('confirm-reg-btn');

    // Input Fields
    const phoneInput = document.getElementById('reg-phone');
    const deptInput = document.getElementById('reg-dept');
    const roleInput = document.getElementById('reg-role');

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
            // Validate inputs
            const metadata = {
                phone: phoneInput.value,
                department: deptInput.value,
                userRole: roleInput.value
            };

            if (!metadata.phone || !metadata.department) {
                regMsg.textContent = 'Please fill in all details.';
                return;
            }

            confirmBtn.disabled = true;
            regMsg.textContent = 'Securing your spot...';
            
            await window.db.registerForEvent(selectedEventId, metadata);
            
            regMsg.textContent = 'Success! Your ticket is ready.';
            
            // Auto-refresh tickets if list is open
            if (typeof window.openTicketsModal === 'function') {
                // Background refresh if needed, but the success message is main.
            }

            setTimeout(() => {
                closeModal();
                confirmBtn.disabled = false;
                // Clear form
                phoneInput.value = '';
                deptInput.value = '';
                roleInput.value = 'Student';
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

    // Expose closeRegModal for the close button
    window.closeRegModal = closeModal;

    return {
        openModal,
        closeModal
    };
})();
