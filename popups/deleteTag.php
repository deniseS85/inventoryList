<div id="deleteTagConfirmation" class="new-category-popup-bg" onclick="togglePopup('deleteTagConfirmation')">
    <div class="delete-category-container" onclick="doNotClose(event)">
        <h4 class="popup-title">Tags löschen</h4>
        <p id="confirmationTextTag" class="confirmation-message"></p>
        <div class="btn-container">
            <button onclick="togglePopup('deleteTagConfirmation')">Abbrechen</button>
            <button onclick="deleteTags()">Löschen</button>
        </div>
    </div>
</div>