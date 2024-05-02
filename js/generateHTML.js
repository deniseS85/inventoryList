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
                        <th>Tag</th>
                        <th>Bild</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>`;
    } else {
        return '';
    }
}

function generateTableRow(product, tag,  image) {
    let tagStyle = tag ? `background-color: ${tag.color}; height: 20px; padding: 5px 10px; border-radius: 5px; font-size: 15px` : '';
    return /*html*/`
        <tr onclick="openProductDetailPopup('${product.name}', '${product.amount}', '${product.price}', '${product.information}', '${tag ? tag.tag_name : ''}', '${tagStyle}','${image ? image.url : ''}')">
            <td>${product.name}</td>
            <td>${product.amount}</td>
            <td>${product.price}</td>
            <td>${product.information}</td>
            <td>${tag ? `<span style="${tagStyle}">${tag.tag_name}</span>` : ''}</td>
            <td>${image ? `<img src="php/uploads/${image.url}">` : ''}</td>
        </tr>`;
}


function openProductDetailPopup(name, amount, price, information, tagName, tagStyle, imageUrl) {
    togglePopup('productDetailPopup');
    
    let tagHtml = '';
    if (tagName && tagStyle) {
        let backgroundColor = tagStyle.match(/background-color:\s*([^;]+)/)[1];
        let additionalStyles = `height: unset; width: 100px; padding: 3px 10px; font-size: 17px; border-radius: 5px`;
        tagHtml = `<span class="tag" style="background-color: ${backgroundColor}; ${additionalStyles};">${tagName}</span>`;
    }

    let infoItems = [
        { label: 'Name', value: name },
        { label: 'Menge', value: amount },
        { label: 'Preis', value: price },
        { label: 'Tag', value: tagHtml },
        { label: 'Information', value: information }
    ];
    
    let infoHtml = generateItemInfoHTML(infoItems, imageUrl);

    document.getElementById('productDetailContent').innerHTML = infoHtml;
}

function generateItemInfoHTML(infoItems, imageUrl) {
    let infoHtml = '';

    infoItems.forEach(item => {
        infoHtml += /*html*/`
            <div class="product">
                <div class="label">${item.label}:</div>
                <div class="value">${item.value}</div>
            </div>`;
    });

    return /*html*/`
        <div class="left">
            <img src="php/uploads/${imageUrl}">
        </div>
        <div class="right">
            <div class="product-detail-info">
                ${infoHtml}
            </div>
        </div>`;
}

