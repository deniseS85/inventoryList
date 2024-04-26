<div id="deleteCategoryConfirmation" class="new-category-popup-bg" onclick="togglePopupDeleteCategory()">
    <div class="delete-category-container" onclick="doNotClose(event)">
        <h4 class="popup-title">Kategorie löschen</h4>
        <p class="confirmation-message">Bist du sicher, dass du diese Kategorie löschen möchtest?</p>
        <div class="btn-container">
            <button onclick="togglePopupDeleteCategory()">Abbrechen</button>
            <button onclick="deleteCategoryItem()">Löschen</button>
        </div>
    </div>
</div>