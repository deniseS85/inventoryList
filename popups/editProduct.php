<div id="editProductPopup" class="new-category-popup-bg" onclick="togglePopupEditProduct(null)">
    <div class="new-item-container" onclick="doNotClose(event)">
        <h4 class="popup-title">Produkt bearbeiten</h4>
        <form id="editProductForm" action="php/editProduct.php" method="post" autocomplete="off">
            <div class="form-group">
                <label for="productCurrentName">Produkt:</label>
                <input id="productCurrentName" class="input-new-item" type="text" name="product-name" onkeydown="return /[a-zA-Z0-9\säöüß.,]/.test(event.key)" oninput="validateInput('editItemButton', this)" maxlength="20">
            </div>
            <div class="form-group">
                <label for="currentAmount">Menge:</label>
                <input id="currentAmount" class="input-new-item" type="text" name="product-amount" onkeydown="if (event.key !== 'Tab' && event.key !== 'Backspace' && !/[0-9]/.test(event.key)) { event.preventDefault(); return false; }" maxlength="3">
            </div>
            <div class="form-group">
                <label for="currentProductValue">Wert:</label>
                <input id="currentProductValue" class="input-new-item" type="text" name="product-value" oninput="validateInputDecimal(this)" maxlength="6">
            </div>
            <div class="form-group">
                <label for="currentProductInfo">Beschreibung:</label>
                <input id="currentProductInfo" class="input-new-item" type="text" name="product-info" onkeydown="return /[a-zA-Z0-9\säöüß.,]/.test(event.key)" maxlength="35">
            </div>

            <div class="selectBox-edit">
                <div class="label-header" style="margin-bottom:10px" onclick="toggleDropdown('dropdownContentEdit')">
                    <div class="current-tag">
                        <div class="label-tags">Tag:</div>
                        <div id="currentTag" style="position: relative;"></div>
                    </div>
                    <p><i class="arrow-down"></i></p>
                </div>

                <div id="selectedOptionEdit"></div>
                <div class="dropdownContent" id="dropdownContentEdit">
                    <div class="add-tag-container" onclick="togglePopupNewTag()">
                        <img src="./assets/img/add.png">
                        <p>Neuer Tag</p>
                    </div>
                    <div id="tagOptionsEditContainer"></div>
                </div>
            </div>

            <div class="upload-container edit-upload-container">
                <div class="img-upload">
                    <label for="currentImage" class="custom-file-upload">Bild<br> hinzufügen</label>
                    <input type="file" id="currentImage" name="uploadImage" style="display:none;">
                    <img id="newImage" class="uploaded-new-image" style="display:none;">
                </div>
                <img src="./assets/img/remove-img.png" id="remove-image" class="remove-image" onclick="removeImage()" style="display:none;">
                <img src="./assets/img/remove-img.png" id="remove-new-image" class="remove-image" onclick="resetUploadImageSrc('currentImage', 'newImage', 'remove-new-image')" style="display:none;">
            </div>

            <input type="hidden" id="currentProductID" name="product-id" value="">
            <input type="hidden" id="currentCategoryID" name="category-id" value="">
            <input type="hidden" id="currentTagId" name="tag-id" value="">
            <input type="hidden" id="currentImageId" name="image-id" value="">
            <input type="hidden" id="currentImageUrl" name="current-image-url">
            <input type="hidden" id="imageToRemove" name="imageToRemove" value="">

            <div class="btn-container">
                <button type="reset" onclick="togglePopupEditProduct(null)">Abbrechen</button>
                <button type="submit" id="editItemButton">Speichern</button>
            </div>
        </form>
    </div>
</div>