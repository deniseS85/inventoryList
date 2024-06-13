<div id="deleteUserConfirmation" class="new-category-popup-bg" onclick="togglePopupDeleteUser()">
    <div class="delete-user-container" onclick="doNotClose(event)">
        <h4 class="popup-title">Konto löschen</h4>
        <p class="confirmation-message">Bist du sicher, dass du dein Konto löschen möchtest?<br> Diese Aktion kann nicht rückgängig gemacht werden.</p>
        <div class="btn-container">
            <button onclick="togglePopupDeleteUser()">Abbrechen</button>
            <button onclick="deleteAccount()">Löschen</button>
        </div>
    </div>
</div>