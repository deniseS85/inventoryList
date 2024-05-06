function generateItemHTML(categoryName, categoryID, productCount) {
    currentCategoryID = categoryID;
    let productLabel = productCount === 1 ? 'Produkt' : 'Produkte';

    return /*html*/`
        <div class="item-info" data-category-id="${categoryID}">
            <div class="item-header">
                <div>
                    <img onclick="togglePopupDeleteCategory()" class="delete-icon" src="./assets/img/delete.png">
                    <img onclick="togglePopupEditCategory('${categoryName}', ${categoryID})" class="edit-icon" src="./assets/img/edit.png">
                </div>
                <div class="item-title">
                    <h4>${categoryName}</h4>
                    <h6>${productCount} ${productLabel}</h6>
                </div>
                <img onclick="togglePopupNewItem(${categoryID})" class="add-icon" src="./assets/img/add.png">
            </div>
            <div class="productContainer">
                ${generateTableHTML(null)}
            </div>
        </div>`;
}

function generateTableHTML(product, categoryID) {
    if (product) {
        let tableID = `productTable_${categoryID}`; 
     
        return /*html*/`
            <table id="${tableID}">
                <thead class="table-separator">
                    <tr>
                        <th onclick="sortTable('${tableID}', 0)">Produkt</th>
                        <th onclick="sortTable('${tableID}', 1)">Menge</th>
                        <th onclick="sortTable('${tableID}', 2)">Wert</th>
                        <th onclick="sortTable('${tableID}', 3)">Beschreibung</th>
                        <th onclick="sortTable('${tableID}', 4)">Tag</th>
                        <th>Bild</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>`;
    } else {
        return '';
    }
}

function generateTableRow(product, categoryID, tag, image) { 
    let formattedPrice = formatPrice(product.price);
    let tagStyle = tag ? `background-color: ${tag.color}; height: 20px; padding: 5px 10px; border-radius: 5px; font-size: 15px` : '';
    return /*html*/`
        <tr onclick="openProductDetailPopup('${product.id}', '${product.name}', '${product.amount}', '${product.price}', '${product.information}', '${tag ? tag.tag_name : ''}', '${tagStyle}','${image ? image.url : ''}')">
            <td>${product.name}</td>
            <td>${product.amount}</td>
            <td>${formattedPrice}</td>
            <td>${product.information}</td>
            <td>${tag ? `<span style="${tagStyle}">${tag.tag_name}</span>` : ''}</td>
            <td id="imageColumn_${product.id}_${categoryID}" >${image ? `<img src="php/uploads/${image.url}">` : ''}</td>
        </tr>`;
}

function generateItemInfoHTML(infoItems, imageUrl, productID) {
    let infoHtml = '';
   
    infoItems.forEach(item => {
        infoHtml += /*html*/`
            <div class="product">
                <div class="label">${item.label}:</div>
                <div class="value">${item.value}</div>
            </div>`;
    });
    
    let isUploadedImage = imageUrl ? `<img src="php/uploads/${imageUrl}">` : generateImageUploadHtml(productID);
    return /*html*/`
        <div id="previewImage_${productID}" class="left">${isUploadedImage}</div>
        <div class="right">
            <div class="product-detail-info">${infoHtml}</div>
        </div>`;
}

function generateImageUploadHtml(productID) {
    return /*html*/`
        <form id="editUploadImageForm" enctype="multipart/form-data">
            <div class="edit-img-upload">
                <label for="editUploadImage" class="edit-file-upload">Bild hinzufügen</label>
                <input type="file" id="editUploadImage" name="editUploadImage" style="display:none;">
                <img id="editUploadedImage" class="uploaded-image" style="display:none;">
            </div>
            <input type="hidden" id="editUploadedImageId" name="editUploadImageId" value="${productID}">
        </form>`;
}






