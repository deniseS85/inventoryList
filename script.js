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

function validateInput(buttonId, inputElement) {
    document.getElementById(buttonId).disabled = inputElement.value.trim() === '';
}

async function getCategories() {
    try {
        fetch('getCategories.php')
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
    return /*html*/`
        <div class="item-info" data-category-id="${categoryID}">
            <div class="item-header">
                <img onclick="deleteCategoryItem(${categoryID})" class="delete-icon" src="./assets/img/delete.png">
                <div class="item-title">
                    <h4>${categoryName}</h4>
                    <h6>Artikelmenge</h6>
                </div>
                <img onclick="togglePopupNewItem()" class="add-icon" src="./assets/img/add.png">
            </div>

        </div>`;
}

async function deleteCategoryItem(categoryID) {
    try {
        const response = await fetch('deleteCategory.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ID: categoryID })
        });
        
        if (!response.ok) {
            throw new Error('Fehler beim Löschen der Kategorie');
        }
        removeCategoryFromHTML(categoryID);
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

function addNewItem() {
    let productName = document.getElementById('productName').value;
    let productAmount = document.getElementById('productAmount').value;
    let productValue = document.getElementById('productValue').value;
    let productInfo = document.getElementById('productInfo').value;

}      

document.addEventListener('DOMContentLoaded', getCategories);

