<div id="newCategoryPopup" class="new-category-popup-bg" onclick="togglePopupNewCategory()">
    <div class="new-category-container" onclick="doNotClose(event)">
        <h4 class="popup-title">Neue Kategorie</h4>
        <form id="addCategoryForm" action="php/addCategory.php" method="post" autocomplete="off">
            <input onkeydown="return /[a-z]/i.test(event.key)" id="categoryInput" class="input-new-category" type="text" name="category-name" placeholder="Kategoriename" required oninput="validateInput('addCategoryButton', this)">
            <div class="btn-container">
                <button type="reset" onclick="togglePopupNewCategory()">Abbrechen</button>
                <button type="submit" id="addCategoryButton" disabled>Hinzufügen</button>
            </div>
        </form>
    </div>
</div>