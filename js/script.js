let currentCategoryID;
let tableSortOrder = {};
let expanded = false;
const colors = ['#FF5733', '#38761d', '#3366FF', '#FF33F3', '#bf9000', '#FF0000', '#6a329f', '#2BB8EE', '#5b5b5b'];

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
    let selectedOption = document.getElementById('selectedOption');
    selectedOption.innerHTML = '';
    selectedOption.style.border = "none";
    selectedOption.style.backgroundColor = '';
    document.getElementById('categoryId').value = categoryID;
    togglePopup('newItemPopup');
    focusInput('productName');
    clearInputValues('.input-new-item');
    validateInput('addItemButton', document.getElementById('productName'));
    resetUploadImageSrc();
    resetTagInput();
}

function togglePopupProductDetail() {
    togglePopup('productDetailPopup');
}

function resetTagInput() {
    let tagIdInput = document.getElementById('tagId');
    if (tagIdInput) {
        tagIdInput.value = ''; 
    }
}

function resetUploadImageSrc() {
    let uploadedImageElement = document.getElementById('uploadedImage');
    if (uploadedImageElement) {
        uploadedImageElement.src = '';
        uploadedImageElement.style.display = 'none';
    }
    let uploadedImageIdInput = document.getElementById('uploadedImageId');
    if (uploadedImageIdInput) {
        uploadedImageIdInput.value = ''; 
    }
    document.getElementById('uploadImage').value = null;
}

function togglePopup(popupID) {
    let popup = document.getElementById(popupID);
    popup.style.display = popup.style.display === 'flex' ? 'none' : 'flex';
}

function togglePopupNewTag() {
    let newTagPopup = document.getElementById('newTagPopup');
    newTagPopup.style.display = newTagPopup.style.display === 'flex' ? 'none' : 'flex';

    if (newTagPopup.style.display === 'flex') {
        newTagPopup.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    } else {
        focusInput('tagInput');
        clearInputValues('.input-new-tag');
        validateInput('addTagButton', document.getElementById('tagInput'));
        document.getElementById('tagInput').style.backgroundColor = '';
    }
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
        let categoryID = category.dataset.categoryId;
        let categoryContainer = document.querySelector(`.item-info[data-category-id="${categoryID}"]`);

        category.style.display = categoryName.startsWith(input) ? 'flex' : 'none';
        if (categoryContainer) {
            categoryContainer.style.display = categoryName.startsWith(input) ? 'block' : 'none';
        }
    });
}

function validateInput(buttonId, inputElement) {
    document.getElementById(buttonId).disabled = inputElement.value.trim() === '';
}

async function showCategoryItems(category) {
    let container = document.querySelector('.category-item-container');
    let categoryElement = document.createElement('div');
    categoryElement.classList.add('category-item');
    categoryElement.innerHTML = category.name;
    categoryElement.dataset.categoryId = category.id; 

    let products = await getProductsByCategory(category.id);
    let productCount = products.length;
    openCategoryItem(categoryElement, category.name, category.id, productCount);
    container.appendChild(categoryElement);
}

function openCategoryItem(item, categoryName, categoryID, productCount) {
    let itemContainer = document.getElementById('itemContainer');

    item.onclick = async function() {
        if (item.classList.contains('active')) {
            removeItem(item, itemContainer, categoryName);
        } else {
            showItem(item, itemContainer, categoryName, categoryID, productCount); 
            let products = await getProductsByCategory(categoryID);
            products.forEach(product => {
                showProduct(product, categoryID);
            });
            let itemInfo = itemContainer.querySelector(`.item-info[data-category-id="${categoryID}"]`);
            itemInfo.classList.add('open');
        }
    };
}

function removeItem(item, itemContainer, category) {
    item.classList.remove('active');
    let items = itemContainer.querySelectorAll('.item-info');

    items.forEach(function(element) {
        let titleElement = element.querySelector('.item-title h4');
        if (titleElement && titleElement.textContent === category) {
            element.classList.remove('open');
            setTimeout(function() {
                element.remove();
            }, 500); 
        }
    });
}

function showItem(item, itemContainer, categoryName, categoryID, productCount) {
    item.classList.add('active');
    itemContainer.innerHTML += generateItemHTML(categoryName, categoryID, productCount);
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

async function showProduct(product, categoryID) {
    let categoryContainer = document.querySelector(`.item-info[data-category-id="${categoryID}"]`);
   
    if (categoryContainer) {
        let productContainer = categoryContainer.querySelector('.productContainer');
        let table = productContainer.querySelector('table');
        
        if (!table) {
            productContainer.innerHTML += generateTableHTML(product, categoryID);
            table = productContainer.querySelector('table');
        }

        let tbody = table.querySelector('tbody');
        let tag = await getTagPerProduct(product.tag_ID);
        let image = await getImagePerProduct(product.image_ID);
        tbody.innerHTML += generateTableRow(product, tag, image);
    } else {
        console.error('Category container not found for category ID:', categoryID);
    }
}

function sortTable(tableID, columnIndex) {
    let table = document.getElementById(tableID);
    if (!table) return; 

    let rows = Array.from(table.rows).slice(1);
    let sortOrder = tableSortOrder[tableID] || 'asc';

    rows.sort((a, b) => {
        let xCell = a.cells[columnIndex];
        let yCell = b.cells[columnIndex];
        if (!xCell || !yCell) return 0;

        let x, y;

        if (columnIndex === 1 || columnIndex === 2) {
            x = parseFloat(xCell.textContent.replace(',', '.'));
            y = parseFloat(yCell.textContent.replace(',', '.'));
        } else {
            let xString = xCell.textContent.toLowerCase();
            let yString = yCell.textContent.toLowerCase();

            if (sortOrder === 'asc') {
                return xString.localeCompare(yString);
            } else {
                return yString.localeCompare(xString);
            }
        }
        if (sortOrder === 'asc') {
            return x - y;
        } else {
            return y - x;
        }
    });

    let tbody = table.querySelector('tbody');
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
    tableSortOrder[tableID] = sortOrder === 'asc' ? 'desc' : 'asc';
}

function toggleDropdown() {
    let dropDown = document.getElementById("dropdownContent");
    dropDown.classList.toggle("expanded");
}

function selectTagNewItem() {
    let dropDown = document.getElementById("dropdownContent");

    document.addEventListener("click", function(event) {
        if (!event.target.closest(".selectBox")) {
            dropDown.classList.remove("expanded");
        }
    });
}

function generateColorOptions() {
    let colorContainer = document.querySelector('.select-colors');

    colors.forEach(color => {
        let circle = document.createElement('p');
        circle.classList.add('circle');
        circle.style.backgroundColor = color;

        circle.addEventListener('click', function() {
            let tagColorInput = document.getElementById('tagColorInput');
            tagColorInput.value = color;
            let tagInput = document.getElementById('tagInput');
            tagInput.style.backgroundColor = color;
        });

        colorContainer.appendChild(circle);
    });
}

function selectTag(tag) {
    let selectedOption = document.getElementById("selectedOption");
    selectedOption.classList.add("selected-option");
    selectedOption.style.border = "1px solid #2BB8EE";
    selectedOption.style.backgroundColor = tag.color;
    selectedOption.innerHTML = tag.tag_name;
    document.getElementById("dropdownContent").classList.remove("expanded");
    document.getElementById("tagId").value = tag.ID;
}

function uploadImage() {
    document.getElementById('uploadImage').addEventListener('change', function(event) {
        let file = event.target.files[0];
        if (file) {
            showUploadedImage(file);
        }
    });
}

function showUploadedImage(file) {
    let uploadedImageElement = document.getElementById('uploadedImage');
    if (uploadedImageElement) {
        let reader = new FileReader();
        reader.onload = function(e) {
            uploadedImageElement.src = e.target.result;
            uploadedImageElement.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

function addNewItem(event) {
    event.preventDefault();

    let formData = new FormData(this);
    let file = document.getElementById('uploadImage').files[0];
    let uploadedImageId = document.getElementById('uploadedImageId').value;
    if (file) {
        formData.append('uploadedImageId', uploadedImageId);    
        saveUploadImageInDatabase(file, formData);
    } else {
        formData.append('uploadedImageId', '');
        saveProductInDatabase(formData);
    }
}

function addNewItemAfterLoadDOM() {
    document.getElementById('addProductForm').addEventListener('submit', addNewItem);
}

function scrollToLastElement(containerPath, itemSelector) {
    let container = document.querySelector(containerPath);
    if (container) {
        let items = container.querySelectorAll(itemSelector);
        if (items.length > 0) {
            let lastItem = items[items.length - 1];
            lastItem.scrollIntoView({ behavior: 'smooth', block: 'end'});
        }
    }
}

function updateProductCount(categoryID) {
    let categoryElement = document.querySelector(`.item-info[data-category-id="${categoryID}"]`);
    if (categoryElement) {
        let productCountElement = categoryElement.querySelector('.item-title h6');
        if (productCountElement) {
            let currentCount = parseInt(productCountElement.textContent.split(' ')[0]);
            let newCount = currentCount + 1;
            let productLabel = newCount === 1 ? 'Produkt' : 'Produkte';
            productCountElement.textContent = `${newCount} ${productLabel}`;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    getCategories();
    addNewItemAfterLoadDOM();
    selectTagNewItem();
    generateColorOptions();
    showTagsOptions();
    uploadImage();
});