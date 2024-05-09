<div id="productDetailPopup" class="new-category-popup-bg" onclick="togglePopup('productDetailPopup')" data-product-id="">
    <div class="product-detail-container" onclick="doNotClose(event)">
        <h4 class="popup-title">Produktdetails</h4>
        <div class="separator"></div>
        <div class="icon-container-edit-product">
            <img onclick="togglePopupDeleteProduct(this)" src="./assets/img/delete.png" class="delete-icon">
            <img src="./assets/img/edit.png" class="edit-icon">
        </div>
        <div id="productDetailContent"></div>
        <div class="btn-container-product-detail">
            <button onclick="togglePopup('productDetailPopup')">Schließen</button>
        </div>
    </div>
</div>