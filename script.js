let itemAdded = false;

function togglePopupNewCategory() {
    togglePopup('newCategoryPopup');
    focusInput('categoryInput');
    clearInputValues('.input-new-category');
}

function togglePopupNewItem() {
    togglePopup('newItemPopup');
    focusInput('productName');
    clearInputValues('.input-new-item');
}

function togglePopup(popupID) {
    let popup = document.getElementById(popupID);
    popup.style.display = popup.style.display === 'flex' ? 'none' : 'flex';
}

function focusInput(inputID) {
    document.getElementById(inputID).focus();
}

function clearInputValues(selector) {
    document.querySelectorAll(selector).forEach(input => input.value = '');
}

function doNotClose(event) {
    event.stopPropagation();
}

function filterCategories() {
    let input = document.getElementById('categoryFilterInput').value.toLowerCase();
    let categories = document.querySelectorAll('.category-item');

    categories.forEach(category => {
        let categoryName = category.innerHTML.toLowerCase();
        category.style.display = categoryName.substring(0, input.length) === input ? 'flex' : 'none';
    });
}

function addCategoryItem() {
    let categoryName = document.querySelector('.input-new-category').value;
    let newItem = document.createElement('div');
    let container = document.querySelector('.category-item-container');

    newItem.classList.add('category-item');
    newItem.innerHTML = categoryName;

    openNewCategory(newItem, categoryName);
    
    container.appendChild(newItem);
    togglePopupNewCategory();
    clearInputValues('.input-new-category');
}

function openNewCategory(item, category) {
    let itemContainer = document.getElementById('itemContainer');

    item.onclick = function() {
        if (item.classList.contains('active')) {
            removeItem(item, itemContainer, category);
        } else {
            showItem(item, itemContainer, category); 
        }
    };
}

function removeItem(item, itemContainer, category) {
    item.classList.remove('active');
    let items = itemContainer.querySelectorAll('.item-info');

    items.forEach(function(element) {
        let titleElement = element.querySelector('.item-title h4');
        if (titleElement && titleElement.textContent === category) {
            element.remove();
        }
    });
}

function showItem(item, itemContainer, category) {
    item.classList.add('active');
    itemContainer.innerHTML += generateItemHTML(category);
}

function generateItemHTML(category) {
    return /*html*/`
        <div class="item-info">
            <div class="item-header">
                <div class="item-title">
                    <h4>${category}</h4>
                    <h6>Artikelmenge</h6>
                </div>
                <img onclick="togglePopupNewItem()" class="add-icon" src="./assets/img/add.png">
            </div>
        
        </div>`;
}

function generateTableHTML(productName, productAmount, productValue, productInfo) {
    return /*html*/`
        <div class="separator"></div>
        <table>
            <thead>
                <tr>
                    <th>Produktname</th>
                    <th>Menge</th>
                    <th>Wert</th>
                    <th>Produktinformationen</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${productName}</td>
                    <td>${productAmount}</td>
                    <td>${productValue}</td>
                    <td>${productInfo}</td>
                </tr>
            </tbody>
        </table>`;
}

function addNewItem() {
    let productName = document.getElementById('productName').value;
    let productAmount = document.getElementById('productAmount').value;
    let productValue = document.getElementById('productValue').value;
    let productInfo = document.getElementById('productInfo').value;
}      

function validateInput(buttonId, inputElement) {
    document.getElementById(buttonId).disabled = !(inputElement.value.trim() !== '');
}
