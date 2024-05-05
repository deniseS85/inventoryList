<div id="newItemPopup" class="new-category-popup-bg" onclick="togglePopupNewItem(null)">
    <div class="new-item-container" onclick="doNotClose(event)">
        <h4 class="popup-title">Neues Produkt</h4>
        <form id="addProductForm" action="php/addItem.php" method="post" autocomplete="off" enctype="multipart/form-data">
            <div class="form-group">
                <label for="productName">Name:</label>
                <input id="productName" class="input-new-item" type="text" name="product-name" required oninput="validateInput('addItemButton', this)">
            </div>
            <div class="form-group">
                <label for="amount">Menge:</label>
                <input id="productAmount" class="input-new-item" type="text" name="product-amount">
            </div>
            <div class="form-group">
                <label for="value">Wert:</label>
                <input id="productValue" class="input-new-item" type="text" name="product-value">
            </div>
            <div class="form-group">
                <label for="productInfo">Beschreibung:</label>
                <input id="productInfo" class="input-new-item" type="text" name="product-info">
            </div>

            <div class="tagImage">
                <div>
                    <div class="selectBox">
                        <div class="label-header" onclick="toggleDropdown()">
                            <div class="label-tags">Tags:</div>
                            <p><i class="arrow-down"></i></p>
                        </div>

                        <div id="selectedOption"></div>
                        <div class="dropdownContent" id="dropdownContent">
                            <div class="add-tag-container" onclick="togglePopupNewTag()">
                                <img src="./assets/img/add.png">
                                <p>Neuer Tag</p>
                            </div>
                            <div class="tagOptionsContainer"></div>
                        </div>
                    </div>
                </div>
                <div class="upload-container">
                    <div class="img-upload">
                        <label for="uploadImage" class="custom-file-upload">Bild hinzufügen</label>
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
    <div id="itemContainer" class="itemsContainer open">
</div>