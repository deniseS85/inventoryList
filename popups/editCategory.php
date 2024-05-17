<div id="editCategoryPopup" class="new-category-popup-bg" onclick="togglePopupEditCategory(null)">
    <div class="new-category-container" onclick="doNotClose(event)">
        <h4 class="popup-title">Kategorie ändern</h4>
        <form id="updateCategoryForm" action="php/editCategory.php" method="post" autocomplete="off">
            <input onkeydown="return /[a-zäöüß]/i.test(event.key)" id="categoryCurrentInput" class="input-new-category" type="text" name="newCategoryName" placeholder="Kategoriename" oninput="validateInput('editCategoryButton', this)">
            <input type="hidden" id="categoryIdInput" name="categoryId" value="">
            <div class="btn-container">
                <button type="reset" onclick="togglePopupEditCategory(null)">Abbrechen</button>
                <button type="submit" id="editCategoryButton">Speichern</button>
            </div>
        </form>
    </div>
</div>