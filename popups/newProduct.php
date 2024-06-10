<div id="newItemPopup" class="new-category-popup-bg" onclick="togglePopupNewItem(null)">
    <div class="new-item-container" onclick="doNotClose(event)">
        <h4 class="popup-title">Neues Produkt</h4>
        <form id="addProductForm" action="php/addItem.php" method="post" autocomplete="off" enctype="multipart/form-data">
            <div class="form-group">
                <label for="productName">Name:</label>
                <input id="productName" class="input-new-item" type="text" name="product-name" required onkeydown="return /[a-zA-Z0-9\säöüß.,]/.test(event.key)" oninput="validateInput('addItemButton', this)" maxlength="20">
            </div>
            <div class="form-group">
                <label for="productAmount">Menge:</label>
                <input id="productAmount" class="input-new-item" type="text" name="product-amount" onkeydown="if (event.key !== 'Tab' && event.key !== 'Backspace' && !/[0-9]/.test(event.key)) { event.preventDefault(); return false; }" maxlength="3">
            </div>
            <div class="form-group">
                <label for="productValue">Wert:</label>
                <input id="productValue" class="input-new-item" type="text" name="product-value" oninput="validateInputDecimal(this)" maxlength="6">
            </div>
            <div class="form-group">
                <label for="productInfo">Beschreibung:</label>
                <input id="productInfo" class="input-new-item" type="text" name="product-info" onkeydown="return /[a-zA-Z0-9\säöüß.,]/.test(event.key)" maxlength="35">
            </div>

            <div class="tagImage">
                <div>
                    <div class="selectBox">
                        <div class="label-header" onclick="toggleDropdown('dropdownContent')">
                            <div class="label-tags">Tags:</div>
                            <p><i class="arrow-down"></i></p>
                        </div>

                        <div id="selectedOption"></div>
                        <div class="dropdownContent" id="dropdownContent">
                            <div class="add-tag-container" onclick="togglePopupNewTag()">
                                <img src="./assets/img/add.png">
                                <p>Neuer Tag</p>
                            </div>
                            <div id="tagOptionsContainer"></div>
                        </div>
                    </div>
                </div>
                <div class="upload-container">
                    <div class="img-upload">
                        <label for="uploadImage" class="custom-file-upload">Bild<br> hinzufügen</label>
                        <input type="file" id="uploadImage" name="uploadImage" style="display:none;">
                        <img id="uploadedImage" class="uploaded-image" style="display:none;">
                    </div>
                    <img onclick="resetUploadImageSrc('uploadImage', 'uploadedImage', 'uploadedImageId', 'removeImgUpload')" src="./assets/img/remove-img.png" id="removeImgUpload" class="remove-img-upload" style="display:none;">
                </div>
            </div>
            <input type="hidden" id="categoryId" name="category-id" value="">
            <input type="hidden" id="tagId" name="tag-id" value="">
            <input type="hidden" id="uploadedImageId" name="uploadImageId" value="">
            
            <div class="btn-container">
                <button type="reset" onclick="togglePopupNewItem(null)">Abbrechen</button>
                <button type="submit" id="addItemButton" disabled>Hinzufügen</button>
            </div>
        </form>
    </div>
    <div id="itemContainer" class="itemsContainer open"></div>
</div>