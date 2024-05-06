let currentCategoryID;
let tableSortOrder = {};
let currentImageUrls = {}; 
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
    resetUploadImageSrc('uploadImage', 'uploadedImage', 'uploadedImageId', 'removeImgUpload');
    resetTagInput();
}

/* function togglePopupProductDetail() {
    togglePopup('productDetailPopup');
    /* resetUploadImageSrc('editUploadImage', 'editUploadedImage', 'editUploadedImageId', 'removeEditImgUpload'); */
/* } */
 
function resetTagInput() {
    let tagIdInput = document.getElementById('tagId');
    if (tagIdInput) {
        tagIdInput.value = ''; 
    }
}

function resetUploadImageSrc(uploadInputElementId, uploadedImageElementId, uploadedImageIdInputId, removeImgElementID) {
    let uploadedImageElement = document.getElementById(uploadedImageElementId);
    if (uploadedImageElement) {
        uploadedImageElement.src = '';
        uploadedImageElement.style.display = 'none';
    }
    let uploadedImageIdInput = document.getElementById(uploadedImageIdInputId);
    if (uploadedImageIdInput) {
        uploadedImageIdInput.value = ''; 
    }
    let uploadInputElement = document.getElementById(uploadInputElementId);
    if (uploadInputElement) {
        uploadInputElement.value = null;
    }
    let removeImgElement = document.getElementById(removeImgElementID);
    if (removeImgElement) {
        removeImgElement.style.display = 'none';
    }
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
        tbody.innerHTML += generateTableRow(product, categoryID, tag, image);
    } else {
        console.error('Category container not found for category ID:', categoryID);
    }
}

function sortTable(tableID, columnIndex) {
    let table = document.getElementById(tableID);
    if (!table) return; 

    let rows = Array.from(table.rows).slice(1);
    let sortOrder = tableSortOrder[tableID] || 'asc';

    if (columnIndex === 3) {
        sortByDescription(columnIndex, rows, sortOrder);
    } else if (columnIndex === 4) {
        sortByTag(columnIndex, rows, sortOrder);
    } else {
        sortByNameAmountValue(columnIndex, rows, sortOrder);
    }

    let tbody = table.querySelector('tbody');
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
    tableSortOrder[tableID] = sortOrder === 'asc' ? 'desc' : 'asc';
}

function sortByDescription(columnIndex, rows, sortOrder) {
    rows.sort((a, b) => {
        let descriptionA = a.cells[columnIndex].textContent.toLowerCase().trim();
        let descriptionB = b.cells[columnIndex].textContent.toLowerCase().trim();
        if (descriptionA === '' && descriptionB === '') {
            return 0;
        } else if (descriptionA === '') {
            return 1;
        } else if (descriptionB === '') {
            return -1;
        } else if (sortOrder === 'asc') {
            return descriptionA.localeCompare(descriptionB);
        } else {
            return descriptionB.localeCompare(descriptionA);
        }
    });
}

function sortByTag(columnIndex, rows, sortOrder) {
    rows.sort((a, b) => {
        let tagA = a.cells[columnIndex].textContent.toLowerCase().trim();
        let tagB = b.cells[columnIndex].textContent.toLowerCase().trim();
        if (tagA === '' && tagB === '') {
            return 0;
        } else if (tagA === '') {
            return 1;
        } else if (tagB === '') {
            return -1;
        } else if (sortOrder === 'asc') {
            return tagA.localeCompare(tagB);
        } else {
            return tagB.localeCompare(tagA);
        }
    });
}

function sortByNameAmountValue(columnIndex, rows, sortOrder) {
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

function formatPrice(price) {
    let parsedPrice = parseFloat(price.replace(',', '.'));

    if (!isNaN(parsedPrice)) {
        let roundedPrice = parsedPrice.toFixed(2);
        let formattedPrice = new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR'
        }).format(roundedPrice);
        return formattedPrice;
    } else {
        return '';
    }
}

async function openProductDetailPopup(productID, name, amount, price, information, tagName, tagStyle, imageUrl) {
    togglePopup('productDetailPopup');
    let formattedPrice = formatPrice(price);
    let tagHtml = '';

    if (tagName && tagStyle) {
        let backgroundColor = tagStyle.match(/background-color:\s*([^;]+)/)[1];
        let additionalStyles = `height: unset; width: 100px; padding: 3px 10px; font-size: 17px; border-radius: 5px`;
        tagHtml = /*html*/`<span class="tag" style="background-color: ${backgroundColor}; ${additionalStyles};">${tagName}</span>`;
    }

    let infoItems = [
        { label: 'Name', value: name },
        { label: 'Menge', value: amount },
        { label: 'Preis', value: formattedPrice},
        { label: 'Tag', value: tagHtml },
        { label: 'Information', value: information }
    ];
    let editUploadedImage = currentImageUrls[productID] ? currentImageUrls[productID] : imageUrl;
    let infoHtml = generateItemInfoHTML(infoItems, editUploadedImage, productID);
    document.getElementById('productDetailContent').innerHTML = infoHtml;
}

function showImage(file, imageElementId, removeImgElementID) {
    let uploadedImageElement = document.getElementById(imageElementId);
    if (uploadedImageElement) {
        let reader = new FileReader();
        reader.onload = function(e) {
            uploadedImageElement.src = e.target.result;
            uploadedImageElement.style.display = 'block';
            let removeImgElement = document.getElementById(removeImgElementID);
            if (removeImgElement) {
                removeImgElement.style.display = 'inline';
            }
        };
        reader.readAsDataURL(file);
    }
}

document.addEventListener('change', async function(event) {
    if (event.target && (event.target.id === 'uploadImage' || event.target.id === 'editUploadImage')) {
        let file = event.target.files[0];
        if (file) {
            if (event.target.id === 'uploadImage') {
                showImage(file, 'uploadedImage', 'removeImgUpload');
            } else if (event.target.id === 'editUploadImage') {
                showImage(file, 'editUploadedImage', 'removeEditImgUpload');
                await productAlreadyExist(file);
            }
        }
    }
});

async function productAlreadyExist(file) {
    let productID = document.getElementById('editUploadedImageId').value; 
            
    if (productID) {
        let formData = new FormData();
        formData.append('editUploadImage', file); 
        formData.append('productID', productID); 
        await saveUploadImageInDatabase(file, formData);
    }
}

async function updateProductImage(updatedProduct, productID) {
    try {
        let imageCell = document.getElementById(`imageColumn_${productID}_${updatedProduct.categoryID}`);
        let previewImage = document.getElementById(`previewImage_${productID}`);

        if (imageCell && previewImage) {
            let imageHTML = updatedProduct.imageURL ? `<img src="php/uploads/${updatedProduct.imageURL}">` : '';
            imageCell.innerHTML = imageHTML;
            previewImage.innerHTML = imageHTML;
        } else {
            console.error('Bildzelle oder Vorschau-Bild nicht gefunden.');
        }
    } catch (error) {
        console.error('Fehler beim Aktualisieren des Produktbilds:', error.message);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    getCategories();
    addNewItemAfterLoadDOM();
    selectTagNewItem();
    generateColorOptions();
    showTagsOptions();
});