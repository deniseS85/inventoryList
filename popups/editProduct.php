<div id="editProductPopup" class="new-category-popup-bg" onclick="togglePopupEditProduct(null)">
    <div class="new-item-container" onclick="doNotClose(event)">
        <h4 class="popup-title">Produkt bearbeiten</h4>
        <form id="editProductForm" action="php/editProduct.php" method="post" autocomplete="off">
            <div class="form-group">
                <label for="productCurrentName">Name:</label>
                <input id="productCurrentName" class="input-new-item" type="text" name="product-name" onkeydown="return /[a-zA-Z0-9\säöüß.,]/.test(event.key) || event.key === 'Backspace' || event.key === 'Delete' || event.key === 'ArrowLeft' || event.key === 'ArrowRight'">
            </div>
            <div class="form-group">
                <label for="currentAmount">Menge:</label>
                <input id="currentAmount" class="input-new-item" type="text" name="product-amount" onkeydown="return /[0-9]/.test(event.key) || event.key === 'Backspace' || event.key === 'Delete' || event.key === 'ArrowLeft' || event.key === 'ArrowRight'">
            </div>
            <div class="form-group">
                <label for="currentProductValue">Wert:</label>
                <input id="currentProductValue" class="input-new-item" type="text" name="product-value" oninput="validateInputDecimal(this)">
            </div>
            <div class="form-group">
                <label for="currentProductInfo">Beschreibung:</label>
                <input id="currentProductInfo" class="input-new-item" type="text" name="product-info" onkeydown="return /[a-zA-Z0-9\säöüß.,]/.test(event.key) || event.key === 'Backspace' || event.key === 'Delete' || event.key === 'ArrowLeft' || event.key === 'ArrowRight'">
            </div>
            <input type="hidden" id="productID" name="product-id" value="">
            <input type="hidden" id="categoryID" name="category-id" value="">
            <div class="btn-container">
                <button type="reset" onclick="togglePopupEditProduct(null)">Abbrechen</button>
                <button type="submit">Speichern</button>
            </div>
        </form>
    </div>
</div>