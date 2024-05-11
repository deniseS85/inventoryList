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

            <!-- +++++++ -->
            <div class="selectBox-edit">
                <div class="label-header" onclick="toggleDropdown()">
                    <div class="current-tag">
                        <div class="label-tags">Tag:</div>
                        <div id="currentTag"></div>
                    </div>
                    <p><i class="arrow-down"></i></p>
                </div>

                <!-- <div id="selectedOption"></div>
                <div class="dropdownContent" id="dropdownContent">
                    <div class="add-tag-container" onclick="togglePopupNewTag()">
                        <img src="./assets/img/add.png">
                        <p>Neuer Tag</p>
                    </div>
                    <div class="tagOptionsContainer"></div>
                </div> -->
            </div>

            <input type="hidden" id="currentProductID" name="product-id" value="">
            <input type="hidden" id="currentCategoryID" name="category-id" value="">
            <input type="hidden" id="tagId" name="tag-id" value="">
            <div class="btn-container">
                <button type="reset" onclick="togglePopupEditProduct(null)">Abbrechen</button>
                <button type="submit">Speichern</button>
            </div>
        </form>
    </div>
</div>