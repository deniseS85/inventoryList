let itemAdded = false;
let currentCategoryID;


function togglePopupNewCategory() {
    togglePopup('newCategoryPopup');
    focusInput('categoryInput');
    clearInputValues('.input-new-category');
    validateInput('addCategoryButton', document.getElementById('categoryInput'));
}

function togglePopupDeleteCategory() {
    togglePopup('deleteCategoryConfirmation');
}

function togglePopupEditCategory(categoryName, categoryID) {
    document.getElementById('categoryCurrentInput').value = categoryName;
    document.getElementById('categoryIdInput').value = categoryID;
    togglePopup('editCategoryPopup');
}

function togglePopupNewItem(categoryID) {
    document.getElementById('categoryId').value = categoryID;
    togglePopup('newItemPopup');
    focusInput('productName');
    clearInputValues('.input-new-item');
    validateInput('addItemButton', document.getElementById('productName'));
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

function validateInput(buttonId, inputElement) {
    document.getElementById(buttonId).disabled = inputElement.value.trim() === '';
}

async function getCategories() {
    try {
        fetch('php/getCategories.php')
        .then(response => response.json())
        .then(categories => {
            categories.forEach(category => {
                showCategoryItems(category);
            });
            
        })
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

function showCategoryItems(category) {
    let container = document.querySelector('.category-item-container');
    let categoryElement = document.createElement('div');
    categoryElement.classList.add('category-item');
    categoryElement.innerHTML = category.name;
    categoryElement.dataset.categoryId = category.id; 
    openCategoryItem(categoryElement, category.name, category.id);
    container.appendChild(categoryElement);
}

function openCategoryItem(item, categoryName, categoryID) {
    let itemContainer = document.getElementById('itemContainer');

    item.onclick = function() {
        if (item.classList.contains('active')) {
            removeItem(item, itemContainer, categoryName);
        } else {
            showItem(item, itemContainer, categoryName, categoryID); 
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

function showItem(item, itemContainer, categoryName, categoryID) {
    item.classList.add('active');
    itemContainer.innerHTML += generateItemHTML(categoryName, categoryID);
}

function generateItemHTML(categoryName, categoryID) {
    currentCategoryID = categoryID;
    return /*html*/`
        <div class="item-info" data-category-id="${categoryID}">
            <div class="item-header">
                <div>
                    <img onclick="togglePopupDeleteCategory()" class="delete-icon" src="./assets/img/delete.png">
                    <img onclick="togglePopupEditCategory('${categoryName}', ${categoryID})" class="edit-icon" src="./assets/img/edit.png">
                </div>
                <div class="item-title">
                    <h4>${categoryName}</h4>
                    <h6>Artikelmenge</h6>
                </div>
                <img onclick="togglePopupNewItem(${categoryID})" class="add-icon" src="./assets/img/add.png">
            </div>

        </div>`;
}

async function deleteCategoryItem() {
    try {
        const response = await fetch('php/deleteCategory.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ID: currentCategoryID })
        });

        if (!response.ok) {
            throw new Error('Fehler beim Löschen der Kategorie');
        }
        removeCategoryFromHTML(currentCategoryID);
        togglePopupDeleteCategory();
    } catch (error) {
        console.error('Fehler beim Löschen der Kategorie:', error.message);
    }
}

function removeCategoryFromHTML(categoryID) {
    let categoryElement = document.querySelector(`.category-item[data-category-id="${categoryID}"]`);
    let categoryViewElement = document.querySelector(`.item-info[data-category-id="${categoryID}"]`);

    if (categoryElement) {
        categoryElement.remove();
    }
    if (categoryViewElement) {
        categoryViewElement.remove();
    }
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

    

document.addEventListener('DOMContentLoaded', getCategories);

