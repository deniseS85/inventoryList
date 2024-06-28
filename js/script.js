let currentCategoryID;
let tableSortOrder = {};
let currentImageUrl = {}; 
let expanded = false;
const colors = ['#FF5733', '#38761d', '#3366FF', '#FF33F3', '#bf9000', '#FF0000', '#6a329f', '#2497c5', '#5b5b5b'];
let selectedImageIDs = [];
let selectedTagIDs = [];
let imageSelectionListenerAdded = false;
let isSelectEnabled = false;
let deleteImageFlag = false;
let deleteMode = false;
let switchData = [
    { value: 'Produkt', sliderValue: 'checked' },
    { value: 'Menge', sliderValue: 'checked' },
    { value: 'Wert', sliderValue: 'checked' },
    { value: 'Beschreibung', sliderValue: 'checked' },
    { value: 'Tag', sliderValue: 'checked' },
    { value: 'Bild', sliderValue: 'checked' }
];

function togglePopupNewCategory() {
    togglePopup('newCategoryPopup');
    focusInput('categoryInput');
    clearInputValues('.input-new-category');
    validateInput('addCategoryButton', document.getElementById('categoryInput'));
}

function togglePopupDeleteCategory(categoryName, amountProducts) {
    let confirmationText = document.getElementById('confirmationText');
    confirmationText.innerHTML = /*html*/`
        Bist du sicher, dass du <b>${categoryName}</b><br> und die <b>${amountProducts}</b> löschen möchtest?`;
    togglePopup('deleteCategoryConfirmation'); 
}

function togglePopupEditCategory(categoryName, categoryID) {
    let categoryInput = document.getElementById('categoryCurrentInput');
    let categoryIdInput = document.getElementById('categoryIdInput');
    let editCategoryButton = document.getElementById('editCategoryButton');

    if (!categoryInput.hasAttribute('data-original-value')) {
        categoryInput.setAttribute('data-original-value', categoryName);
    }
    
    categoryInput.value = categoryName;
    categoryIdInput.value = categoryID;
    editCategoryButton.disabled = false;
    togglePopup('editCategoryPopup');
}

function togglePopupNewItem(categoryID) {
    let selectedOption = document.getElementById('selectedOption');
    selectedOption.innerHTML = '';
    selectedOption.style.border = "none";
    selectedOption.style.backgroundColor = '';
    document.getElementById('categoryId').value = categoryID;
    togglePopup('newItemPopup');
    adjustFormBySwitchTableColumn('addProductForm', '.selectBox', '.upload-container', switchData);
    focusInput('productName');
    clearInputValues('.input-new-item');
    validateInput('addItemButton', document.getElementById('productName'));
    resetUploadImageSrc('uploadImage', 'uploadedImage', 'uploadedImageId', 'removeImgUpload');
    resetTagInput();
    closeAllDropdowns();
}

function resetElements(elementID, properties) {
    let element = document.getElementById(elementID);
    if (element) {
        properties.forEach(property => {
            if (property.name === 'value') {
                element.value = property.value;
            } else if (property.name.startsWith('style.')) {
                let styleProperty = property.name.split('.')[1];
                element.style[styleProperty] = property.value;
            }
        });
    }
}

function resetTagInput() {
    resetElements('tagId', [{ name: 'value', value: '' }]);
}

function resetUploadImageSrc(uploadInputElementId, uploadedImageElementId, uploadedImageIdInputId, removeImgElementID) {
    resetElements(uploadedImageElementId, [
        { name: 'src', value: '' },
        { name: 'style.display', value: 'none' }
    ]);
    resetElements(uploadedImageIdInputId, [{ name: 'value', value: '' }]);
    resetElements(uploadInputElementId, [{ name: 'value', value: null }]);
    resetElements(removeImgElementID, [{ name: 'style.display', value: 'none' }]);
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
    const button = document.getElementById(buttonId);
    const currentValue = inputElement.value.trim();
    const originalValue = inputElement.getAttribute('data-original-value');

    if (currentValue === '' && currentValue !== originalValue) {
        button.disabled = true;
    } else {
        button.disabled = false;
    }
}

function validateInputDecimal(input) {
    if (!/^(\d{1,6}([,.]?\d{0,2})?)?$/.test(input.value)) {
        input.value = input.value.slice(0, -1);
    }
}

async function showCategoryItems(categories) {
    let container = document.querySelector('.category-item-container');
    container.innerHTML = '';

    for (let i = 0; i < categories.length; i++) {
        let category = categories[i];
        let categoryElement = document.createElement('div');
        categoryElement.classList.add('category-item');
        categoryElement.innerHTML = category.name;
        categoryElement.dataset.categoryId = category.id; 
        let products = await getProductsByCategory(category.id);
        let productCount = products.length;
        openCategoryItem(categoryElement, category.name, category.id, productCount);
        container.appendChild(categoryElement);
    }
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

function toggleDropdown(dropDownID) {
    let dropDown = document.getElementById(dropDownID);
    let eventTarget = event.target; // Das Element, auf das geklickt wurde

    if (!eventTarget.matches("#removeTagButton, #removeTagButton img")) {
        dropDown.classList.toggle("expanded");
    }
}

function closeAllDropdowns() {
    let dropdowns = document.querySelectorAll('.dropdownContent');
    dropdowns.forEach(dropdown => {
        dropdown.classList.remove("expanded");
    });
}

function selectTagNewItem(dropDownID) {
    let dropDown = document.getElementById(dropDownID);

    document.addEventListener("click", function(event) {
        if (!event.target.closest(".selectBox") || !event.target.closest(".selectBox-edit")) {
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

function selectTag(tag, dropDownID) {
    let selectedOption = document.getElementById('selectedOption');

    if (!selectedOption) {
        console.error('Fehler: Das Element mit der ID "selectedOption" wurde nicht gefunden.');
        return;
    }
    selectedOption.classList.add("selected-option");
    selectedOption.style.border = "1px solid #2BB8EE";
    selectedOption.style.backgroundColor = tag.color;
    selectedOption.innerHTML = tag.tag_name;
    document.getElementById(`dropdownContent${dropDownID}`).classList.remove("expanded");

    if (dropDownID === 'Edit') {
        selectTagEditProduct(tag);
        document.getElementById("currentTagId").value = tag.ID;
    }
    document.getElementById("tagId").value = tag.ID;
}

function selectTagEditProduct(tag) {
    let currentTag = document.getElementById('currentTag');
    currentTag.className = 'tag current';
    currentTag.innerHTML = /*html*/`
        ${tag.tag_name}
        <span onclick="removeCurrentTag()" id="removeTagButton">
            <img src="./assets/img/remove-tag.png">
        </span>`;
    currentTag.style.backgroundColor = tag.color;

    let selectedOptionEdit = document.getElementById('selectedOptionEdit');
    selectedOptionEdit.innerHTML = '';
}

function updateNewTag(newTagID, tagName, tagColor) {
    showTagsOptions('tagOptionsContainer', '')
    .then(() => {
        return showTagsOptions('tagOptionsEditContainer', 'Edit');
    })
    .then(() => {
        setTimeout(() => {
            scrollToLastElement('#tagOptionsContainer', '.option');
            scrollToLastElement('#tagOptionsEditContainer', '.option');
            let newTag = { ID: newTagID, tag_name: tagName, color: tagColor };
            selectTag(newTag, '');
        }, 100);
    })
    .catch(error => {
        console.error('Fehler beim Aktualisieren und Auswählen des neuen Tags:', error);
    });
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

function updateProductCount(categoryID, operator) {
    let categoryElement = document.querySelector(`.item-info[data-category-id="${categoryID}"]`);
    if (categoryElement) {
        let productCountElement = categoryElement.querySelector('.item-title h6');
        if (productCountElement) {
            let currentCount = parseInt(productCountElement.textContent.split(' ')[0]);
            let newCount = operator === 'add' ? currentCount + 1 : currentCount - 1;
            let productLabel = newCount === 1 ? 'Produkt' : 'Produkte';
            productCountElement.textContent = `${newCount} ${productLabel}`;
        }
    }
}

function formatPrice(price) {
    if (price && price.trim() !== '') {
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
    } else {
        return '0,00 €';
    }
}

async function openProductDetailPopup(categoryID, productID, name, amount, price, information, tagName, tagStyle, imageUrl) {
    togglePopup('productDetailPopup');
    let formattedPrice = formatPrice(price);
    let tagHtml = getTagHTML(tagName, tagStyle);
    let infoItems = await getInfoItems(name, amount, formattedPrice, information, tagHtml, productID);
    let editUploadedImage = currentImageUrl[productID] ? currentImageUrl[productID] : imageUrl;
    let infoHtml = generateItemInfoHTML(categoryID, infoItems, editUploadedImage, productID);
    document.getElementById('productDetailContent').innerHTML = infoHtml;
    let productDetailPopup = document.getElementById('productDetailPopup');
    productDetailPopup.dataset.productId = productID;
    productDetailPopup.dataset.categoryId = categoryID;
}

function getTagHTML(tagName, tagStyle) {
    if (tagName && tagStyle) {
        let backgroundColor = tagStyle.match(/background-color:\s*([^;]+)/)[1];
        return /*html*/`<div class="tag value" style="background-color: ${backgroundColor};">${tagName}</div>`;
    }
    return '';
}

async function getInfoItems(name, amount, formattedPrice, information, tagHtml, productID) {
    let allInfoItems = [
        { label: 'Produkt', value: name },
        { label: 'Menge', value: amount },
        { label: 'Wert', value: formattedPrice },
        { label: 'Tag', value: tagHtml },
        { label: 'Beschreibung', value: information, isDescription: true }
    ];

    let customValues = await getProductById(productID);
    let userCustomFields = switchData.filter(item => {
        return item.userID !== undefined && item.dataType !== undefined && item.columnID !== undefined;
    });

    userCustomFields.forEach(field => {
        let value = '';
        if (customValues.custom_fields[field.columnID]) {
            value = customValues.custom_fields[field.columnID];
        }
        allInfoItems.push({ label: field.value, value: value, dataType: field.dataType, columnID: field.columnID });
    });


    return allInfoItems.filter(item => {
        let switchItem = switchData.find(s => s.value.toLowerCase() === item.label.toLowerCase());
        return switchItem && switchItem.sliderValue === 'checked';
    });
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
    let targetID = event.target.id;
    let files = event.target.files;
    let file = files && files.length > 0 ? files[0] : null;
    let editImageElement = document.querySelector('#editUploadImageForm .edit-img-upload');
    let removeImageNewElement = document.getElementById('remove-new-image');

    if (!targetID || !file) return;

    if (!isImageValid(file)) {
        console.error('Error: Invalid image file.');
        return;
    }

    if (targetID === 'uploadImage') {
        showImage(file, 'uploadedImage', 'removeImgUpload');
    } else if (targetID === 'editUploadImage') {
        showImage(file, 'editUploadedImage', 'removeEditImgUpload');
        editImageElement.style.backgroundImage = 'none';
        await productAlreadyExist(file);
    } else if (targetID === 'currentImage') {
        showNewImage(file );
    }

    if (targetID === 'currentImage') {
        if (file) {
            removeImageNewElement.style.display = 'block';
        } else {
            removeImageNewElement.style.display = 'none';
        }
    }
});

function isImageValid(file) {
    let imageFileType = file.type.toLowerCase();
    let validTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (!validTypes.includes(imageFileType)) {
        console.error('Error: Invalid file type.');
        return false;
    }

    if (file.size > 500000) {
        console.error('Error: File is too large.');
        return false;
    }
    return true;
}


async function productAlreadyExist(file) {
    let productID = document.getElementById('editUploadedImageId').value; 
            
    if (productID) {
        let formData = new FormData();
        formData.append('editUploadImage', file); 
        formData.append('productID', productID); 
        await saveUploadImageInDatabase(file, formData);
    }
}

async function addImageToProduct(updatedProduct, productID) {
    try {
        let imageCell = document.getElementById(`imageColumn_${productID}_${updatedProduct.categoryID}`);
        if (imageCell) {
            let imageHTML = updatedProduct.imageURL ? `<img src="php/uploads/${updatedProduct.imageURL}">` : '';
            imageCell.innerHTML = imageHTML;
        } else {
            console.error('Bildzelle oder Vorschau-Bild nicht gefunden.');
        }
    } catch (error) {
        console.error('Fehler beim Aktualisieren des Produktbilds:', error.message);
    }
}

async function deleteUploadedImage(categoryID, productID, uploadInputElementId, uploadedImageElementId, uploadedImageIdInputId, removeImgElementID) {
    let inputValueUpload = document.getElementById('editUploadedImageId').value;
    let imageID = inputValueUpload.split(',')[1].trim();

    const formData = new FormData();
    formData.append('productID', productID);
    formData.append('imageID', imageID);

    await deleteImageFromDatabase(formData);
    resetUploadImage(categoryID, productID, uploadedImageElementId, uploadedImageIdInputId, uploadInputElementId, removeImgElementID);    
}

function resetUploadImage(categoryID, productID, uploadedImageElementId, uploadedImageIdInputId, uploadInputElementId, removeImgElementID) {
    resetElements(uploadedImageElementId, [
        { name: 'src', value: '' },
        { name: 'style.display', value: 'none' }
    ]);
    resetElements(uploadedImageIdInputId, [{ name: 'value', value: '' }]);
    resetElements(uploadInputElementId, [{ name: 'value', value: null }]);
    resetElements(removeImgElementID, [{ name: 'style.display', value: 'none' }]);
    let editImgUploadForm = document.querySelector('#editUploadImageForm');

    if (editImgUploadForm) {
        let editImgUpload = editImgUploadForm.querySelector('.edit-img-upload');
        if (editImgUpload) {
            editImgUpload.style.backgroundImage = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3e%3crect width='100' height='100' fill='none' rx='100' ry='100' stroke='%2305FBFBFF' stroke-width='3' stroke-dasharray='3 7' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`;
        }
    }

    currentImageUrl[productID] = '';
    let imageCell = document.getElementById(`imageColumn_${productID}_${categoryID}`);
    imageCell && (imageCell.innerHTML = '');
}

function togglePopupDeleteProduct(el) {
    let productDetailPopup = el.closest('#productDetailPopup');
    let productID = productDetailPopup.dataset.productId;
    let categoryID = productDetailPopup.dataset.categoryId;
    let confirmationText = document.getElementById('confirmationTextProduct');
    confirmationText.innerHTML = /*html*/`
        Bist du sicher, dass du dieses Produkt löschen möchtest?`;

    let deleteConfirmationPopup = document.getElementById('deleteProductConfirmation');
    deleteConfirmationPopup.dataset.productId = productID;
    deleteConfirmationPopup.dataset.categoryId = categoryID;
    togglePopup('deleteProductConfirmation'); 
}

function removeProductFromHTML(productID) {
    let productRowElement = document.getElementById(`productRow_${productID}`);
    if (productRowElement) {
        productRowElement.remove();
    }
}

async function togglePopupEditProduct() {
    resetTagStyle();
    document.getElementById('newImage').style.filter = 'grayscale(0)';
    document.getElementById('remove-new-image').style.display = 'none';
    let productId = document.getElementById('productDetailPopup').getAttribute('data-product-id');
    let categoryId = document.getElementById('productDetailPopup').getAttribute('data-category-id');

    try {
        let product = await getProductById(productId);

        if (product) {
            await prepareProductData(product, categoryId);
            await getCurrentImage(product);
            togglePopup('editProductPopup');
            adjustFormBySwitchTableColumn('editProductForm', '.selectBox-edit', '.edit-upload-container', switchData);
            isEditInputValid();
        } else {
            console.error('Product not found');
        }
    } catch (error) {
        console.error('Error fetching product:', error);
    }
    closeAllDropdowns();
}

async function prepareProductData(product, categoryId) {
    let tag = product.tag_ID ? await getTagPerProduct(product.tag_ID) : null;
    let tagHtml = tag ? getTagHTML(tag.tag_name, `background-color: ${tag.color};`) : '';
    
    if (tagHtml) {
        tagHtml = /*html*/`
            <span class="tag current" style="background-color: ${tag.color};">
                ${tag.tag_name}
                <span onclick="removeCurrentTag()" id="removeTagButton">
                    <img src="./assets/img/remove-tag.png">
                </span>
            </span>`;
    }

    let userCustomFields = switchData.filter(item => {
        return item.userID !== undefined && item.dataType !== undefined && item.columnID !== undefined;
    });

    createCustomFields(userCustomFields, 'customFieldsContainer', product.id);
    
    let formattedPrice = formatPrice(product.price).replace('€', '').trim();
    let fieldValues = getFieldValues(product, tagHtml, formattedPrice, categoryId);
    setFieldValues(fieldValues);
    document.getElementById('currentImageId').value = product.image_ID || '';
    document.getElementById('currentTagId').value = product.tag_ID || '';
}

function setDynamicInputValue(inputId, value) {
    let inputElement = document.getElementById(inputId);
    if (inputElement) {
        inputElement.value = value;
    }
}

function isEditInputValid() {
    let productNameInput = document.getElementById('productCurrentName');
    let editItemButton = document.getElementById('editItemButton');

    if (!productNameInput.hasAttribute('data-original-value')) {
        productNameInput.setAttribute('data-original-value', productNameInput.value.trim());
    }

    editItemButton.disabled = productNameInput.value.trim() === '';
}

function resetTagStyle() {
    let currentTag = document.getElementById('currentTag');
    let styleProperties = ['padding', 'border-radius', 'font-size', 'background-color'];

    styleProperties.forEach(property => {
        currentTag.style.removeProperty(property);
    });
}

function removeCurrentTag() {
    let currentTag = document.getElementById('currentTag');
    currentTag.innerHTML = '';
    document.getElementById('currentTagId').value = '';
    resetTagStyle();
}

function setFieldValues(fieldValues) {
    fieldValues.forEach(({ id, value }) => {
        if (id === 'currentTag') {
            document.getElementById(id).innerHTML = value;
        } else {
            document.getElementById(id).value = value;
        }
    });
}

function getFieldValues(product, tagHtml, formattedPrice, categoryId) {
    return [
        { id: 'productCurrentName', value: product.name },
        { id: 'currentAmount', value: product.amount },
        { id: 'currentProductValue', value: formattedPrice },
        { id: 'currentProductInfo', value: product.information },
        { id: 'currentTag', value: tagHtml },
        { id: 'currentProductID', value: product.id },
        { id: 'currentCategoryID', value: categoryId }
    ];
}

class InputValidator {
    restrictToNumeric(event) {
        const input = event.target;
        input.value = input.value.replace(/[^0-9]/g, '').slice(0, 3);
    }

    restrictToAlphanumeric(event) {
        const input = event.target;
        input.value = input.value.replace(/[^\w\säöüß.,]/gi, '').slice(0, 35);
    }
}

const inputValidator = new InputValidator();

async function createCustomFields(customFields, containerId, productID) {
    let container = document.getElementById(containerId);
    let customValues = await getProductById(productID);
    container.innerHTML = '';

    customFields.forEach(field => {
        if (field.sliderValue === 'checked') {
            let formGroup = document.createElement('div');
            formGroup.className = 'form-group';
    
            let label = document.createElement('label');
            let inputId = `${field.columnID}_${productID}`;
            label.setAttribute('for', inputId);
            label.textContent = field.value + ':';
    
            let input = document.createElement('input');
            input.id = inputId;
            input.className = 'input-new-item';
            input.name = `${inputId}_value`;

            let storedDate = customValues.custom_fields[field.columnID];

            setInputTypeAndValidation(input, field.dataType, storedDate);
        
            let hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = `${inputId}_column`;
            hiddenInput.value = field.dataType;

            formGroup.appendChild(hiddenInput);
            formGroup.appendChild(label);
            formGroup.appendChild(input);
            container.appendChild(formGroup);

            setInputValuesCustomColumns(customValues.custom_fields, field.columnID, productID);
        }
    });
}

function setInputTypeAndValidation(input, dataType, storedDate) {
    switch (dataType) {
        case 'DATE':
            input.setAttribute('readonly', 'readonly');
            flatpickr(input, {
                dateFormat: "d.m.Y",
                defaultDate: storedDate ? storedDate : null,
                locale: {
                    firstDayOfWeek: 1,
                    weekdays: {
                        shorthand: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
                        longhand: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
                    },
                    months: {
                        shorthand: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
                        longhand: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
                    },
                },
                onReady: function(selectedDates, dateStr, instance) {
                    const yearDropdown = createYearDropdown(instance, selectedDates);
                    const monthContainer = instance.calendarContainer.querySelector('.flatpickr-current-month');

                    instance.yearElements.forEach(yearElement => {
                        yearElement.style.display = 'none';
                    });

                    const numInputWrapper = monthContainer.querySelector('.numInputWrapper');
                    numInputWrapper.appendChild(yearDropdown);
                },
                onChange: function(selectedDates, dateStr, instance) {
                    input.value = dateStr;
                }
            });
            break;
        case 'INT':
            input.type = 'text';
            input.addEventListener('input', inputValidator.restrictToNumeric);
            input.maxLength = 3;
            break;
        case 'VARCHAR':
        default:
            input.type = 'text';
            input.addEventListener('input', inputValidator.restrictToAlphanumeric);
            input.maxLength = 35;
            break;
    }
}

function createYearDropdown(instance, selectedDates) {
    const yearDropdown = document.createElement('select');
    yearDropdown.className = 'flatpickr-yearDropdown';

    const currentYear = new Date().getFullYear();
    const yearsRange = Array.from({ length: 41 }, (_, i) => currentYear - 20 + i);

    yearsRange.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearDropdown.appendChild(option);
    });

    const currentSelectedYear = selectedDates[0] ? selectedDates[0].getFullYear() : new Date().getFullYear();
    yearDropdown.value = currentSelectedYear;
    yearDropdown.addEventListener('change', function() {
        instance.currentYear = parseInt(yearDropdown.value);
        instance.redraw();
    });

    return yearDropdown;
}

function setInputValuesCustomColumns(customFields, columnID, productId) {
    if (customFields && customFields[columnID]) {
        let inputId = `${columnID}_${productId}`;
        let value = customFields[columnID];
        let inputElement = document.getElementById(inputId);
        
        if (inputElement) {
            inputElement.value = value;
        } else {
            console.error(`Element with ID ${inputId} not found.`);
        }
    }
}

async function getCurrentImage(product) {
    let image = product.image_ID ? await getImagePerProduct(product.image_ID) : null;
    let imageUrl = image ? image.url : '';
    let newImageElement = document.getElementById('newImage');
    let removeImageElement = document.getElementById('remove-image');

    if (imageUrl) {
        newImageElement.src = `php/uploads/${imageUrl}`;
        newImageElement.style.display = 'block';
        removeImageElement.style.display = 'block';
    } else {
        newImageElement.style.display = 'none';
        removeImageElement.style.display = 'none';
    }
    toggleEventListenerUploadImg(newImageElement);
    document.getElementById('currentImageUrl').value = imageUrl;
}

function toggleEventListenerUploadImg(newImageElement) {
    function openImageSelection() {
        document.getElementById('currentImage').click();
    }
    if (!imageSelectionListenerAdded) {
        newImageElement.removeEventListener('click', openImageSelection);
        newImageElement.addEventListener('click', openImageSelection);
        imageSelectionListenerAdded = true;
    }
}

function showNewImage(file) {
    let newImageElement = document.getElementById('newImage');

    if (newImageElement) {
        let reader = new FileReader();
        reader.onload = function(e) {
            newImageElement.src = e.target.result;
            newImageElement.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

async function editProduct(event) {
    event.preventDefault();
    let formData = new FormData(this);
    let currentImageUrl = document.getElementById('currentImageUrl').value;
    let currentTag = document.getElementById('currentTagId').value;

    if (currentImageUrl) {
        formData.append('current-image-url', currentImageUrl);
    }

    if (!currentTag) {
        formData.append('tag-id', '');
    }
    
    if (deleteImageFlag) {
        formData.append('imageToRemove', 'true');
    } else {
        formData.delete('imageToRemove');
    }

    await saveEditProductInDatabase(formData);
    resetUploadImageSrc('currentImage', 'newImage', 'currentImageId', null);
    document.getElementById('newImage').style.filter = 'grayscale(0)';
    deleteImageFlag = false;
}

function removeImage() {
    deleteImageFlag = true;
    document.getElementById('newImage').style.filter = 'grayscale(1)';
    document.getElementById('remove-image').style.display = 'none';
}

async function updateProductTable(updatedProduct, categoryID) {
    if (updatedProduct.hasOwnProperty('ID')) {
        updatedProduct.id = updatedProduct.ID;
        delete updatedProduct.ID;
    }
    let productRow = document.getElementById(`productRow_${updatedProduct.id}`);
    if (productRow) {
        let tag = await getTagPerProduct(updatedProduct.tag_ID);
        let image = await getImagePerProduct(updatedProduct.image_ID);
        let newRowHTML = generateTableRow(updatedProduct, categoryID, tag, image);
        productRow.outerHTML = newRowHTML;
    }
}

async function updateProductDetail(updatedProduct) {
    let tag = await getTagPerProduct(updatedProduct.tag_ID);
    let tagHtml = tag ? getTagHTML(tag.tag_name, `background-color: ${tag.color}; padding: 5px 10px; border-radius: 5px; font-size: 15px`) : '';
    let image = await getImagePerProduct(updatedProduct.image_ID);
    let imageUrl = image && image.url ? image.url : '';

    let infoItems = [
        { label: 'Produkt', value: updatedProduct.name },
        { label: 'Menge', value: updatedProduct.amount },
        { label: 'Preis', value: formatPrice(updatedProduct.price) },
        { label: 'Tag', value: tagHtml },
        { label: 'Information', value: updatedProduct.information }
    ];

    let customValues = await getProductById(updatedProduct.id);
    let userCustomFields = switchData.filter(item => item.userID !== undefined && item.dataType !== undefined && item.columnID !== undefined);

    userCustomFields.forEach(field => {
        let value = '';
        if (customValues.custom_fields[field.columnID] !== undefined) {
            value = customValues.custom_fields[field.columnID];
        }
        infoItems.push({ label: field.value, value: value, dataType: field.dataType, columnID: field.columnID });
    });

    infoItems = infoItems.filter(item => {
        let switchItem = switchData.find(s => s.value.toLowerCase() === item.label.toLowerCase());
        return switchItem && switchItem.sliderValue === 'checked';
    });

    let infoHtml = generateItemInfoHTML(updatedProduct.categoryId, infoItems, imageUrl, updatedProduct.id);
    document.getElementById('productDetailContent').innerHTML = infoHtml;
}

function openSettings() {
    togglePopup('settingsPopup');
    isSelectEnabled = false;
    toggleSelection('.image-checkbox', '.gallery img', 'image');
    toggleSelection('.tag-checkbox', '.tags-container', 'tag');
    resetSelectButton();
}

async function goBackToMain(clickedButton) {
    document.querySelector('.category-item-container').style.display = 'flex';
    document.getElementById('itemContainer').style.display = 'flex';
    document.getElementById('galleryContainer').style.display = 'none';
    document.getElementById('editTableViewContainer').style.display = 'none';
    document.getElementById('userAccount').style.display = 'none';
    selectedImageIDs = [];
    selectedTagIDs = [];
    isSelectEnabled = false;
    toggleSelection('.image-checkbox', '.gallery img', 'image');
    toggleSelection('.tag-checkbox', '.tags-container', 'tag');
    resetSelectButton();
    let deleteColumnIcon = document.getElementById('deleteColumnIcon');
    deleteColumnIcon.classList.remove('toggle-delete-column-icon');
    deleteColumnIcon.classList.add('delete-icon');
    deleteColumnIcon.src = './assets/img/delete.png';
    deleteMode = false;

    if (clickedButton.id === 'backBtnTableView') {
        await isEditTableColumn();
    } 
}

async function isEditTableColumn() {
    updateItemInfos();
    updateCategoryItems();
    updateProductContainers();
}

async function updateItemInfos() {
    let itemContainer = document.getElementById('itemContainer');
    let itemInfoList = itemContainer.querySelectorAll('.item-info');

    for (let itemInfo of itemInfoList) {
        let categoryName = itemInfo.querySelector('.item-title h4').innerHTML;
        let productCountText = itemInfo.querySelector('.item-title h6').innerHTML;
        let productCount = parseInt(productCountText.split(' ')[0]);

        let newItemInfo = itemInfo.cloneNode(true); // Clone existing item-info element
        newItemInfo.classList.add('open');
        newItemInfo.querySelector('.item-title h4').innerHTML = categoryName;
        newItemInfo.querySelector('.item-title h6').innerHTML = `${productCount} ${productCount === 1 ? 'Produkt' : 'Produkte'}`;
        itemInfo.parentNode.replaceChild(newItemInfo, itemInfo);
    }
}

async function updateCategoryItems() {
    let categoryItems = document.querySelectorAll('.main-content .category-item');
    for (let categoryItem of categoryItems) {
        if (categoryItem.classList.contains('active')) {
            categoryItem.classList.remove('active');
            categoryItem.classList.add('active');
        }
    }
}

async function updateProductContainers() {
    let itemContainer = document.getElementById('itemContainer');
    let itemInfoList = itemContainer.querySelectorAll('.item-info');

    for (let itemInfo of itemInfoList) {
        let categoryID = itemInfo.dataset.categoryId;
        let categoryContainer = document.querySelector(`.item-info[data-category-id="${categoryID}"]`);
        let productContainer = categoryContainer.querySelector('.productContainer');

        productContainer.innerHTML = generateTableHTML();

        let products = await getProductsByCategory(categoryID);
        for (let product of products) {
            await showProduct(product, categoryID);
        }
    }
}

function toggleSelect() {
    isSelectEnabled = !isSelectEnabled;
    toggleSelection('.image-checkbox', '.gallery img', 'image');
    toggleSelection('.tag-checkbox', '.tags-container', 'tag');
    updateSelectButton();
}

function toggleSelection(checkboxSelector, elementSelector, type) {
    let containers = document.querySelectorAll(checkboxSelector);
    containers.forEach(container => {
        if (isSelectEnabled) {
            showSelect(container);
        } else {
            removeSelect(container, type);
        }
    });

    let elements = document.querySelectorAll(elementSelector);
    elements.forEach(el => {
        el.style.cursor = isSelectEnabled ? 'pointer' : 'default';
        el.classList.toggle('select-enabled', isSelectEnabled);
        let closestContainer = type === 'image' ? el.closest('.image-container') : el.closest('.tags-container');
        if (closestContainer) {
            closestContainer.classList.toggle('hover-effect', isSelectEnabled);
        }
    });
}

function showSelect(container) {
    container.style.display = 'block';
}

function removeSelect(container, type) {
    container.style.display = 'none';

    if (type === 'image') {
        selectedImageIDs = [];
        resetSelection('.image-container img', '.image-checkbox', 'deleteImage');
    } else if (type === 'tag') {
        selectedTagIDs = [];
        resetSelection('.tags-container div', '.tag-checkbox', 'deleteTag');
    }
}

function toggleCheckbox(itemID, itemType) {
    if (isSelectEnabled) {
        let checkbox = document.querySelector(`.${itemType}-checkbox[data-${itemType}-id="${itemID}"]`);
        checkbox.checked = !checkbox.checked;

        if (itemType === 'image') {
            selectImageForDelete({ target: checkbox });
        } else if (itemType === 'tag') {
            selectTagForDelete({ target: checkbox });
        }
    }
}

function resetSelection(elementSelector, checkboxSelector, deleteButtonId) {
    let elements = document.querySelectorAll(elementSelector);
    elements.forEach(element => {
        element.style.opacity = "1";
    });

    let checkboxes = document.querySelectorAll(checkboxSelector);
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    document.getElementById(deleteButtonId).style.display = 'none';
}

function resetSelectButton() {
    document.getElementById('select-btn').style.backgroundColor = "#051C25";
    document.getElementById('select-btn').style.color = "white";
}

function updateSelectButton() {
    if (isSelectEnabled) {
        document.getElementById('select-btn').style.backgroundColor = "#2BB8EE";
        document.getElementById('select-btn').style.color = "#051C25";
    } else {
        document.getElementById('select-btn').style.backgroundColor = "#051C25";
        document.getElementById('select-btn').style.color = "white";
    }
}

async function showImages(images) {
    let gallery = document.getElementById('gallery');
    let tagsContainer = document.getElementById('tagsContainer');

    gallery.innerHTML = '';
    gallery.addEventListener('change', selectImageForDelete);
    
    images.forEach(async image => {
        let imageHtml = generateImageView(image);
        gallery.insertAdjacentHTML('beforeend', imageHtml);
    });

    gallery.style.display = 'flex';
    tagsContainer.style.display = 'none';
    document.getElementById('galleryContainer').style.display = 'flex';
    togglePopup('settingsPopup');
    document.querySelector('.category-item-container').style.display = 'none';
    document.getElementById('itemContainer').style.display = 'none';
    document.getElementById('editTableViewContainer').style.display = 'none';
    document.getElementById('userAccount').style.display = 'none';
}

async function selectImageForDelete(event) {
    let imgElement = event.target.closest('.image-container').querySelector('img');
    let checkbox = event.target;

    if (checkbox.matches('.image-checkbox')) {
        let imageID = checkbox.dataset.imageId;
        
        if (checkbox.checked) {
            if (!selectedImageIDs.some(item => item.imageID === imageID)) {
                let { imageID: fetchedImageId, productID } = await getProductsByImage(imageID);
                if (!Array.isArray(productID)) {
                    productID = [productID];
                }
                productID.forEach(productID => {
                    selectedImageIDs.push({ imageId: fetchedImageId, productId: productID });
                });
                imgElement.style.opacity = "0.5";
                document.getElementById('deleteImage').style.display = 'flex';
            }
        } else {
            selectedImageIDs = selectedImageIDs.filter(item => item.imageId !== imageID);
            imgElement.style.opacity = "1";
            if (selectedImageIDs.length === 0) {
                document.getElementById('deleteImage').style.display = 'none';
            }
        }
    }
}

function deleteImageConfirmation() {
    let confirmationText = document.getElementById('confirmationTextImage');
    let imageLabel = selectedImageIDs.length === 1 ? 'Bild' : 'Bilder';
    let quantityText = selectedImageIDs.length === 1 ? 'das eine' : `die ${selectedImageIDs.length}`;
    confirmationText.innerHTML = /*html*/`
        Bist du sicher, dass du ${quantityText} ${imageLabel} löschen möchtest?`;
    togglePopup('deleteImageConfirmation');
}

function showTags(tags) {
    let tagsContainer = document.getElementById('tagsContainer');
    let gallery = document.getElementById('gallery');

    tagsContainer.innerHTML = '';
    tagsContainer.addEventListener('change', selectTagForDelete);

    tags.forEach(tag => {
        let tagHtml = generateTagsView(tag);
        tagsContainer.insertAdjacentHTML('beforeend', tagHtml);
    });

    tagsContainer.style.display = 'flex';
    gallery.style.display = 'none';
    document.getElementById('galleryContainer').style.display = 'flex';
    togglePopup('settingsPopup');
    document.querySelector('.category-item-container').style.display = 'none';
    document.getElementById('itemContainer').style.display = 'none';
    document.getElementById('editTableViewContainer').style.display = 'none';
    document.getElementById('userAccount').style.display = 'none';
}

function showEditViewTable() {
    let elementsToHide = ['itemContainer', 'galleryContainer', 'tagsContainer', 'gallery', 'userAccount'];
    setDisplayNone(elementsToHide);
    document.querySelector('.category-item-container').style.display = 'none';
    document.getElementById('editTableViewContainer').style.display = 'flex';
    togglePopup('settingsPopup');
    toggleSwitches();
    saveSwitchData();
}

async function toggleSwitches() {
    let switchContainer = document.getElementById('switchContainer');
    let switchContent = await generateEditTable(switchData);
    switchContainer.innerHTML = switchContent;

    let checkboxes = switchContainer.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            let slider = checkbox.nextElementSibling;
            if (slider.classList.contains('slider')) {
                let sliderName = slider.getAttribute('data-name'); 
                updateSliderValue(sliderName, checkbox.checked);
            }
        });
    });
}

function updateSliderValue(name, isChecked) {
    let item = switchData.find(item => item.value === name);
    if (item) {
        item.sliderValue = isChecked ? 'checked' : '';
    }
    saveSwitchData();
}

async function saveSwitchData() {
    let userID = await getCurrentUserID();
    localStorage.setItem(`switchData_${userID}`, JSON.stringify(switchData));
}

async function loadSwitchData() {
    let userId = await getCurrentUserID();
    let storedData = localStorage.getItem(`switchData_${userId}`);
    if (storedData) {
        const parsedData = JSON.parse(storedData);
        
        if (switchData.length < parsedData.length) {
            for (let i = switchData.length; i < parsedData.length; i++) {
                switchData.push({ value: '', sliderValue: '', userID: '', dataType: '', columnID: '' });
            }
        }
        parsedData.forEach((item, index) => {
            switchData[index].value = item.value;
            switchData[index].sliderValue = item.sliderValue;
            switchData[index].userID = item.userID;
            switchData[index].dataType = item.dataType;
            switchData[index].columnID = item.columnID;
        });
    }
}

function setDisplayNone(elements) {
    elements.forEach(elementID => document.getElementById(elementID).style.display = 'none');
}

async function selectTagForDelete(event) {
    let tagElement = event.target.closest('.tags-container').querySelector('div');
    let checkbox = event.target;

    if (checkbox.matches('.tag-checkbox')) {
        let tagID = checkbox.dataset.tagId;

        if (checkbox.checked) {
            if (!selectedTagIDs.some(item => item.tagId === tagID)) {
                let { tagID: fetchedTagId, productIDs } = await getProductsByTag(tagID);
                let productIdArray = Array.isArray(productIDs) ? productIDs : [];
                productIdArray.forEach(productId => {
                    selectedTagIDs.push({ tagId: fetchedTagId, productId: productId || '' });
                });
                if (productIdArray.length === 0) {
                    selectedTagIDs.push({ tagId: fetchedTagId, productId: '' });
                }
                tagElement.style.opacity = "0.5";
                document.getElementById('deleteTag').style.display = 'flex';
            }
        } else {
            selectedTagIDs = selectedTagIDs.filter(item => item.tagId !== tagID);
            tagElement.style.opacity = "1";
            if (selectedTagIDs.length === 0) {
                document.getElementById('deleteTag').style.display = 'none';
            }
        }
    }
}

function deleteTagConfirmation() {
    let uniqueTagIDs = [...new Set(selectedTagIDs.map(tag => tag.tagId))];
    let numberOfUniqueTags = uniqueTagIDs.length;
    let tagLabel = numberOfUniqueTags === 1 ? 'Tag' : 'Tags';
    let quantityText = numberOfUniqueTags === 1 ? 'das eine' : `die ${numberOfUniqueTags}`;
    let confirmationText = document.getElementById('confirmationTextTag');
    confirmationText.innerHTML = /*html*/`
        Bist du sicher, dass du ${quantityText} ${tagLabel} löschen möchtest?`;
    togglePopup('deleteTagConfirmation');
}

function removeTagFromDropdown(tagID) {
    let options = document.querySelectorAll(`.option[data-tag-id="${tagID}"]`);
    options.forEach(option => {
        option.remove();
    });
}

function adjustTableStyle() {
    let tableCells = document.querySelectorAll('td[data-label="Bild"]');
    let style = (window.innerWidth >= 1261) ? 'padding: 0;' : ''; 
    
    tableCells.forEach(cell => {
        cell.style.cssText = style;
    });
}

function adjustFormBySwitchTableColumn(formID, tagElement, imageElement, switchData) {
    let form = document.getElementById(formID);
    let formGroups = form.querySelectorAll('.form-group');

    formGroups.forEach(group => {
        adjustFormGroups(group, switchData);
    });
    tagFormGroup(tagElement, switchData);
    imageFormGroup(imageElement, switchData);
}

function adjustFormGroups(group, switchData) {
    let label = group.querySelector('label');
    if (label) {
        let labelText = label.innerHTML.trim();
        labelText = labelText.slice(0, -1);
        let fieldName = labelText.toLowerCase();
        let switchItem = switchData.find(item => item.value.toLowerCase() === fieldName);
        if (switchItem && switchItem.sliderValue === 'checked') {
            group.style.display = 'block';
        } else {
            group.style.display = 'none';
        }
    }
}

function tagFormGroup(tagElement, switchData) {
    let tagSwitchItem = switchData.find(item => item.value.toLowerCase() === 'tag');
    if (tagSwitchItem && tagSwitchItem.sliderValue === 'checked') {
        document.querySelector(tagElement).style.display = 'block';
    } else {
        document.querySelector(tagElement).style.display = 'none';
    }
}

function imageFormGroup(imageElement, switchData) {
    let imageSwitchItem = switchData.find(item => item.value.toLowerCase() === 'bild');
    if (imageSwitchItem && imageSwitchItem.sliderValue === 'checked') {
        document.querySelector(imageElement).style.display = 'flex';
    } else {
        document.querySelector(imageElement).style.display = 'none';
    }
}

function showAccount() {
    let elementsToHide = ['itemContainer', 'galleryContainer', 'tagsContainer', 'gallery', 'editTableViewContainer'];
    setDisplayNone(elementsToHide);
    document.querySelector('.category-item-container').style.display = 'none';
    document.getElementById('userAccount').style.display = 'flex';
    togglePopup('settingsPopup');
    generateUserAccountView();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}.${month}.${year}`;
}


function changeValueUserInfo(value, element, inputType) {
    let el = document.querySelector(element);
    let input = document.createElement('input');
    input.type = inputType;
    input.value = value;
    input.name = inputType === 'text' ? 'newUserName' : 'newEmail';

    el.style.paddingTop = '9px';
    el.style.paddingBottom = '9px';

    let saveButton = createIconButton('./assets/img/save-icon.png', 'save-icon', () => saveEdit(element, input));
    let cancelButton = createIconButton('./assets/img/remove-img.png', 'cancel-icon', () => cancelEdit(element, value));

    el.innerHTML = '';
    el.appendChild(input);
    el.appendChild(saveButton);
    el.appendChild(cancelButton);
    input.focus();
}

function createIconButton(img, style, clickHandler) {
    let button = document.createElement('img');
    button.src = img;
    button.classList.add(style);
    button.addEventListener('click', clickHandler);
    return button;
}

function cancelEdit(element, value) {
    let el = document.querySelector(element);
    el.style.paddingTop = '15px';
    el.style.paddingBottom = '15px';
    if (el.classList.contains('username') || el.classList.contains('email')) {
        el.innerHTML = /*html*/`
            ${value}
            <img onclick="changeValueUserInfo('${value}', '${element}', '${element.includes('username') ? 'text' : 'email'}')" class="edit-icon right-10" src="./assets/img/edit.png">`;
    }
}

async function saveEdit(element, inputElement) {
    let newValue = inputElement.value;
    let elementType = inputElement.type;
    await updateUserDataInDatabase(element, newValue, elementType);
    cancelEdit(element, newValue);
    if (element === '.username') {
        document.querySelector('.greeting-text').textContent = `Hallo ${newValue}!`;
    }
}

function togglePopupDeleteUser() {
    togglePopup('deleteUserConfirmation')
}

function backToAccountView() {
    let accountContainer = document.getElementById('accountContainer');
    accountContainer.innerHTML = userAccountView;
}


function changePasswort() {
    fetch('popups/changePasswordForm.php')
    .then(response => response.text())
    .then(html => {
        document.getElementById('accountContainer').innerHTML = html;
        document.getElementById('currentPassword').addEventListener('input', validateAndEnableButton);
        document.getElementById('newChangePassword').addEventListener('input', validateAndEnableButton);
        document.getElementById('confirmNewPassword').addEventListener('input', validateAndEnableButton);
    })
    .catch(error => {
        console.error('Error loading HTML:', error);
    });
}

function validateAndEnableButton() {
    let currentPassword = document.getElementById('currentPassword').value.trim();
    let newPassword = document.getElementById('newChangePassword').value.trim();
    let confirmNewPassword = document.getElementById('confirmNewPassword').value.trim();
    let changePasswordButton = document.getElementById('changePasswordButton');
    let newPasswordConfirmError = document.getElementById('newPasswordConfirmError');

    if (currentPassword !== '' && newPassword !== '' && confirmNewPassword !== '') {
        if (newPassword === confirmNewPassword) {
            changePasswordButton.removeAttribute('disabled');
            newPasswordConfirmError.innerHTML = '';
        } else {
            changePasswordButton.setAttribute('disabled', 'disabled');
            newPasswordConfirmError.innerHTML = 'Die Passwörter stimmen nicht überein.';
        }
    } else {
        changePasswordButton.setAttribute('disabled', 'disabled');
    }
}

function togglePopupNewTableColumn() {
    togglePopup('newTableColumnPopup');
}

async function validateAddColumnForm(event) {
    event.preventDefault();
    let dataTypeSelected = false;
    let options = document.querySelectorAll('.type-radio');
    let errorElement = document.getElementById('typeError');

    options.forEach((option => {
        if (option.checked) {
            dataTypeSelected = true;
        }
    }));

    if (!dataTypeSelected) {
        errorElement.innerHTML = 'Bitte wähle einen Datentyp aus.';
        return false;
    } else {
        await saveColumnData();
        return true;
    }
}

function calculateColumnWidths() {
    const presetWidths = {
        'Produkt': 32,
        'Menge': 8,
        'Wert': 8,
        'Beschreibung': 35,
        'Tag': 10,
        'Bild': 7
    };

    const dataTypeWidths = {
        'VARCHAR': 35,
        'INT': 8,
        'DATE': 8
    };

    let dynamicColumns = switchData.filter(item => item.sliderValue === 'checked').map(item => ({
        label: item.value,
        dataType: item.dataType
    }));

    let totalWidth = calculateTotalWidth(dynamicColumns, presetWidths, dataTypeWidths);
    let columnStyles = generateColumnStyles(dynamicColumns, totalWidth, presetWidths, dataTypeWidths);

    applyColumnStyles(columnStyles);
}

function calculateTotalWidth(dynamicColumns, presetWidths, dataTypeWidths) {
    let totalWidth = 0;
    dynamicColumns.forEach(column => {
        let width = presetWidths[column.label] || dataTypeWidths[column.dataType] || 0;
        totalWidth += width;
    });
    return totalWidth;
}

function generateColumnStyles(dynamicColumns, totalWidth, presetWidths, dataTypeWidths) {
    let columnStyles = '';

    dynamicColumns.forEach((column, index, array) => {
        let width = presetWidths[column.label] || dataTypeWidths[column.dataType] || 0;
        let percentWidth = (width / totalWidth) * 100;

        if (window.innerWidth >= 1260) {
            columnStyles += `
                td[data-label="${column.label}"], th[data-label="${column.label}"] {
                    width: ${percentWidth}%;
                }`;

            if (column.dataType === 'VARCHAR') {
                columnStyles += `
                    td[data-label="${column.label}"] {
                        padding-left: 2%;
                    }
                    th[data-label="${column.dataType}"] {
                        width: ${percentWidth}%;
                        padding-left: 2%;
                    }`;
            }

            if (column.dataType === 'INT' || column.dataType === 'DATE') {
                columnStyles += `
                    th[data-label="${column.dataType}"] {
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        width: ${percentWidth}%;
                        text-align: center;
                        max-width: 5px;
                        padding: 0 5px;
                    }
                    td[data-label="${column.label}"] {
                        padding: 0 5px;
                        text-align: center;
                    } `;
            }
        } else {
            columnStyles += `
                td[data-label="${column.label}"], th[data-label="${column.label}"] {
                    width: 100%;
                    padding-left: 10px;
                }`;

            if (index === array.length - 1) {
                columnStyles += `
                    tr td[data-label="${column.label}"] {
                        border: 1px solid #2BB8EE;
                        border-top: 0;
                    }`;
            } else {
                columnStyles += `
                    tr td[data-label="${column.label}"] {
                        border-left: 1px solid #2BB8EE;
                        border-right: 1px solid #2BB8EE;
                        border-top: none;
                        border-bottom: none;
                    }`;
            }
        }
    });

    return columnStyles;
}

function applyColumnStyles(columnStyles) {
    let existingStyleElement = document.getElementById('dynamicColumnStyles');
    if (existingStyleElement) {
        existingStyleElement.innerHTML = columnStyles;
    } else {
        let styleElement = document.createElement('style');
        styleElement.id = 'dynamicColumnStyles';
        styleElement.innerHTML = columnStyles;
        document.head.appendChild(styleElement);
    }
}

async function toggleDeleteColumn(element) {
    try {
        deleteMode = !deleteMode;
        let currentUserID = await getCurrentUserID();
        let userSpecificData = switchData.filter(item => item.userID && item.userID === parseInt(currentUserID, 10));

        userSpecificData.forEach(item => {
            let switchItem = document.querySelector(`.switch-item .slider[data-name="${item.value}"]`);
            if (switchItem) {
                if (deleteMode) {
                    showDeleteColumnView(switchItem, element, item);
                } else {
                    hideDeleteColumnView(switchItem, element);
                }
            }
        });
    } catch (error) {
        console.error('Error in toggleDeleteColumn:', error);
    }
}

function showDeleteColumnView(switchItem, element, item) {
    let deleteIcon = document.createElement('span');
    deleteIcon.textContent = 'X';
    deleteIcon.classList.add('delete-column-icon');
    deleteIcon.onclick = async () => {
        await deleteSwitchItem(item.columnID);
    };
    switchItem.style.display = 'none';
    element.src = './assets/img/delete-toggle.png';
    element.classList.add('toggle-delete-column-icon');
    element.classList.remove('delete-icon');
    switchItem.parentElement.insertBefore(deleteIcon, switchItem);
}

function hideDeleteColumnView(switchItem, element) {
    let deleteIcon = switchItem.parentElement.querySelector('.delete-column-icon');
    if (deleteIcon) {
        deleteIcon.remove();
        element.classList.remove('toggle-delete-column-icon');
        element.classList.add('delete-icon');
        element.src = './assets/img/delete.png';
    }
    switchItem.style.display = '';
}


function deleteFromLocalStorage(columnID, userID) {
    let localStorageData = localStorage.getItem(`switchData_${userID}`);

    if (localStorageData) {
        let parsedData = JSON.parse(localStorageData);
        let updatedLocalStorageData = parsedData.filter(item => item.columnID !== columnID);
        localStorage.setItem(`switchData_${userID}`, JSON.stringify(updatedLocalStorageData));
    }
}

function removeColumnFromHTML(columnID, userID) {
    let element = document.querySelector(`.slider[data-id="${columnID}"]`);
    if (element) {
        element.closest('.switch-item').remove();
    }

    switchData = switchData.filter(item => item.columnID !== columnID);

    let userSpecificData = switchData.filter(item => item.userID && item.userID === parseInt(userID, 10));
    
    if (userSpecificData.length > 0) {
        document.getElementById('deleteColumnIcon').style.display = 'flex';
    } else {
        document.getElementById('deleteColumnIcon').style.display = 'none';
        let deleteColumnIcon = document.getElementById('deleteColumnIcon');
        deleteColumnIcon.classList.remove('toggle-delete-column-icon');
        deleteColumnIcon.classList.add('delete-icon');
        deleteColumnIcon.src = './assets/img/delete.png';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    getCategories();
    addNewItemAfterLoadDOM();
    selectTagNewItem('dropdownContent');
    selectTagNewItem('dropdownContentEdit');
    generateColorOptions();
    showTagsOptions('tagOptionsContainer', '');
    showTagsOptions('tagOptionsEditContainer', 'Edit');
    document.getElementById('editProductForm').addEventListener('submit', editProduct);
    document.getElementById('currentImage').addEventListener('change', function() {
        document.getElementById('newImage').style.filter = 'none';
    });
    loadSwitchData();
    adjustTableStyle();
    adjustFormBySwitchTableColumn('addProductForm', '.selectBox', '.upload-container', switchData);
    adjustFormBySwitchTableColumn('editProductForm', '.selectBox-edit', '.edit-upload-container', switchData);
    getCostumTableColumn();
});

window.addEventListener('resize', adjustTableStyle);
window.addEventListener('resize', calculateColumnWidths);