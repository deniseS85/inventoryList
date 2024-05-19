<div id="deleteImageConfirmation" class="new-category-popup-bg" onclick="togglePopup('deleteImageConfirmation')">
    <div class="delete-category-container" onclick="doNotClose(event)">
        <h4 class="popup-title">Bilder löschen</h4>
        <p id="confirmationTextImage" class="confirmation-message"></p>
        <div class="btn-container">
            <button onclick="togglePopup('deleteImageConfirmation')">Abbrechen</button>
            <button onclick="deleteImages()">Löschen</button>
        </div>
    </div>
</div>