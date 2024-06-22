let userAccountView = '';

function generateItemHTML(categoryName, categoryID, productCount) {
    currentCategoryID = categoryID;
    let productLabel = productCount === 1 ? 'Produkt' : 'Produkte';

    return /*html*/`
        <div class="item-info" data-category-id="${categoryID}">
            <div class="item-header">
                <div>
                    <img onclick="togglePopupDeleteCategory('${categoryName}', '${productCount} ${productLabel}')" class="delete-icon" src="./assets/img/delete.png">
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
        let activeColumns = switchData.filter(item => item.sliderValue === 'checked');
        let headerHTML = activeColumns.map((item, index) => {
            let dataLabel = item.userID ? item.dataType : item.value;  
            let displayText = item.value; 
            let textAlign = index === 0 ? 'text-align: left; padding-left: 20px;' : ''; 
            return `<th data-label="${dataLabel}" data-id="${item.columnID || ''}" onclick="sortTable('${tableID}', ${index})" style="${textAlign}">${displayText}</th>`;
        }).join('');

        let tableHTML = /*html*/`
            <table id="${tableID}">
                <thead class="table-separator">
                    <tr>
                        ${headerHTML}
                    </tr>
                </thead>
                <tbody></tbody>
            </table>`;
        
        calculateColumnWidths();

        return tableHTML;
    } else {
        return '';
    }
}

function generateTableRow(product, categoryID, tag, image) {
    let tagStyle = tag ? `background-color: ${tag.color};` : '';

    let columns = [
        { label: 'Produkt', value: product.name },
        { label: 'Menge', value: product.amount },
        { label: 'Wert', value: formatPrice(product.price) },
        { label: 'Beschreibung', value: product.information },
        { label: 'Tag', value: tag ? generateTag(tag, tagStyle) : '' },
        { label: 'Bild', value: image ? generateImage(image) : '' }    
    ];

    switchData.forEach(item => {
        if (item.sliderValue === 'checked' && !columns.some(column => column.label === item.value)) {
            columns.push({ label: item.value, value: '', columnID: item.columnID || '' });
        }
    });
    let filteredColumns = filterColumns(columns);
    let rowHTML = buildRowHTML(filteredColumns, categoryID, product, tag, tagStyle, image);
    return rowHTML;
}

function generateTag(tag, tagStyle) {
    return `<div class="table-tag" style="${tagStyle}">${tag.tag_name}</div>`;
}

function generateImage(image) {
    return `<img src="php/uploads/${image.url}" class="table-image">`;
}

function filterColumns(columns) {
    return columns.filter(column => {
        let switchItem = switchData.find(item => item.value === column.label);
        return switchItem && switchItem.sliderValue === 'checked';
    }).map((column, index) => {
        return { column, index };
    });
}

function buildRowHTML(filteredColumns, categoryID, product, tag, tagStyle, image) {
    if (hideEmptyRows(filteredColumns)) { return ''; }

    let isOnlyOneColumnSelected = filteredColumns.length === 1;
    let lastElementIndex = filteredColumns.length - 1;
    let totalColumns = switchData.filter(item => item.sliderValue === 'checked').length;

    let rowHTML = filteredColumns.map((item, index) => {
        let column = item.column;
        let classList = (column.label === 'Tag') ? 'table-column-tag' : '';
        let style = '';
       
        if (column.label === 'Tag') {
            columTagStyle(column, style, index, totalColumns, isOnlyOneColumnSelected, tagStyle);  
        }

        if (index === lastElementIndex) {
            classList += ' last-element';
        }

        if (index === 0) {
            classList += ' first-element';
            style += 'text-align: left; padding-left: 20px;';
        } 
        return `<td class="${classList}" data-label="${column.label}" data-id="${item.column.columnID || ''}" style="${style}">${column.value || ''}</td>`;
    }).join('');
    return `<tr id="productRow_${product.id}" onclick="openProductDetailPopup('${categoryID}', '${product.id}', '${product.name}', '${product.amount}', '${product.price}', '${product.information}', '${tag ? tag.tag_name : ''}', '${tagStyle}', '${image ? image.url : ''}')">${rowHTML}</tr>`;
}

function hideEmptyRows(filteredColumns) {
    return filteredColumns.every(item => {
        const value = item.column.value;
        return !value || (typeof value === 'string' && value.trim() === '');
    });
}

function columTagStyle(column, style, index, totalColumns, isOnlyOneColumnSelected, tagStyle) {
    style += 'height: 40px; padding-right: 10px;';
    let tagDivStyle = '';

    if (index === 0) {
        tagDivStyle += 'width: 150px;';
    } 
    
    if (index === totalColumns - 1 || totalColumns <= 4) {
        tagDivStyle += 'margin: 0 auto;'; /*  width: 145px; */
    }

    if (index === 0 && !isOnlyOneColumnSelected) {
        tagDivStyle += 'margin: 0 20px;'
    }

    if (column.value.trim().startsWith('<div')) {
        let additionalStyle = isOnlyOneColumnSelected ? 'width: 150px; margin: 0 20px;' : tagDivStyle;
        column.value = column.value.replace('<div', `<div style="${additionalStyle} ${tagStyle}"`);
    }
}

function generateItemInfoHTML(categoryID, infoItems, imageUrl, productID) {
    let infoHtml = '';

    infoItems.forEach(item => {
        let itemClass = item.isDescription ? 'product description' : 'product';
        infoHtml += /*html*/`
           <div class="${itemClass}">
                <div class="label">${item.label}:</div>
                <div class="value">${item.value}</div>
            </div>`;
    });
    
    let switchImage = switchData.find(s => s.value.toLowerCase() === 'bild');
    let isUploadedImage = '';
    let displayImageDiv = 'flex';
    let widthInfoDiv = '50%';

    if (switchImage && switchImage.sliderValue === 'checked') {
        isUploadedImage = imageUrl ? generateImagePreviewUploadHTML(imageUrl) : generateImageFormUploadHTML(categoryID, productID);
    } else {
        displayImageDiv = 'none';
        widthInfoDiv = '100%';
    }

    return /*html*/`
        <div id="previewImage_${productID}" class="left" style="display: ${displayImageDiv};">${isUploadedImage}</div>
        <div class="right" style="width: ${widthInfoDiv}">
            <div class="product-detail-info">${infoHtml}</div>
        </div>`;
}

function generateImagePreviewUploadHTML(imageUrl) {
    return /*html*/`
        <img src="php/uploads/${imageUrl}">`;
}

function generateImageFormUploadHTML(categoryID, productID) {
    return /*html*/`
        <form id="editUploadImageForm" enctype="multipart/form-data">
            <div class="edit-img-upload">
                <label for="editUploadImage" class="edit-file-upload">Bild hinzufügen</label>
                <input type="file" id="editUploadImage" name="editUploadImage" style="display:none;">
                <img id="editUploadedImage" class="uploaded-image" style="display:none;">
            </div>
            <input type="hidden" id="editUploadedImageId" name="editUploadImageId" value="${productID}">
            <img src="./assets/img/remove-img.png" id="removeEditImgUpload" class="remove-edit-img-upload" onclick="deleteUploadedImage('${categoryID}', '${productID}', 'editUploadImage', 'editUploadedImage', 'editUploadedImageId', 'removeEditImgUpload')" style="display:none;">
        </form>`;
}

function generateImageView(image) {
    return /*html*/`
        <div class="image-container">
            <img src="php/uploads/${image.url}" id="${image.ID}" onclick="toggleCheckbox(${image.ID}, 'image')">
            <input type="checkbox" class="image-checkbox" data-image-id="${image.ID}" style="display:none;">
        </div>`;
}

function generateTagsView(tag) {
    return /*html*/`
        <div class="tags-container">
            <div id="${tag.ID}" onclick="toggleCheckbox(${tag.ID}, 'tag')" style="background-color:${tag.color}">${tag.tag_name}</div>
            <input type="checkbox" class="tag-checkbox" data-tag-id="${tag.ID}" style="display:none;">
        </div>`;
}

async function generateEditTable(data) {
    try {
        let currentUserID = await getCurrentUserID();
        let defaultData = data.filter(item => !item.userID || item.userID === '');
        let userSpecificData = data.filter(item => item.userID && item.userID === parseInt(currentUserID, 10));
        
        if (userSpecificData.length > 0) {
            document.getElementById('deleteColumnIcon').style.display = 'flex';
        } else {
            document.getElementById('deleteColumnIcon').style.display = 'none';
        }

        let switchContent = '';

        [...defaultData, ...userSpecificData].forEach(item => {
            switchContent += /*html*/`
                <div class="switch-item">
                    <div>${item.value}</div>
                    <label class="switch">
                        <input type="checkbox" name="switch" ${item.sliderValue === 'checked' ? 'checked' : ''}>
                        <span class="slider round" data-name="${item.value}" data-id="${item.columnID || ''}"></span>
                    </label>
                </div>`;
        });

        return switchContent;
    } catch (error) {
        return '';
    }
}


function generateUserInfo(userData) {
    let user = userData[0];
    if (user) {
        let accountContainer = document.getElementById('accountContainer');
        userAccountView = /*html*/`
            <div class="user-content">
                <div class="left-user-content">
                    <div>Vorname: </div>
                    <div>Email: </div>
                    <div>Mitglied seit: </div>
                    <div class="forgot-container">
                        <a style="font-size: 16px" onclick="changePasswort()" class="forgot-link">Passwort ändern</a>
                    </div>
                </div>
                <div class="right-user-content">
                    <div class="username">
                        ${user.username}
                        <img onclick="changeValueUserInfo('${user.username}', '.username', 'text')" class="edit-icon right-10" src="./assets/img/edit.png">
                    </div>
                    <div class="email">
                        ${user.email}
                        <img onclick="changeValueUserInfo('${user.email}', '.email', 'email')" class="edit-icon right-10" src="./assets/img/edit.png">
                    </div>
                    <div>${formatDate(user.registration_date)}</div>
                    <div class="forgot-container">
                        <a style="font-size: 16px" onclick="togglePopupDeleteUser()" class="forgot-link">Konto löschen</a>
                    </div>
                </div>
            </div>`;
            accountContainer.innerHTML = userAccountView;
    } 
}