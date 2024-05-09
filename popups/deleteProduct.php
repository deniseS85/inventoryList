<div id="deleteProductConfirmation" class="new-category-popup-bg" onclick="togglePopup('deleteProductConfirmation')">
    <div class="delete-category-container" onclick="doNotClose(event)">
        <h4 class="popup-title">Produkt löschen</h4>
        <p id="confirmationTextProduct" class="confirmation-message"></p>
        <div class="btn-container">
            <button onclick="togglePopup('deleteProductConfirmation')">Abbrechen</button>
            <button onclick="deleteProductItem()">Löschen</button>
        </div>
    </div>
</div>