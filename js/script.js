let currentCategoryID;
let tableSortOrder = {};
let currentImageUrl = {}; 
let expanded = false;
const colors = ['#FF5733', '#38761d', '#3366FF', '#FF33F3', '#bf9000', '#FF0000', '#6a329f', '#2BB8EE', '#5b5b5b'];
let selectedImageIDs = [];
let imageSelectionListenerAdded = false;
let isSelectEnabled = false;
let deleteImageFlag = false;

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
    dropDown.classList.toggle("expanded");
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
    let additionalStyles = `height: unset; padding: 1px 10px; border-radius: 5px; font-size: 17px`;
    currentTag.style.cssText += additionalStyles;
    currentTag.innerHTML = tag.tag_name;
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
    let infoItems = getInfoItems(name, amount, formattedPrice, information, tagHtml);
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
        let additionalStyles = `height: unset; width: 100px; padding: 3px 10px; font-size: 17px; border-radius: 5px`;
        return /*html*/`<span class="tag" style="background-color: ${backgroundColor}; ${additionalStyles};">${tagName}</span>`;
    }
    return '';
}

function getInfoItems(name, amount, formattedPrice, information, tagHtml) {
    return [
        { label: 'Name', value: name },
        { label: 'Menge', value: amount },
        { label: 'Preis', value: formattedPrice },
        { label: 'Tag', value: tagHtml },
        { label: 'Information', value: information }
    ];
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
        showNewImage(file);
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
    let productId = document.getElementById('productDetailPopup').getAttribute('data-product-id');
    let categoryId = document.getElementById('productDetailPopup').getAttribute('data-category-id');

    try {
        let product = await getProductById(productId);
        
        if (product) {
            console.log(product)
            await prepareProductData(product, productId, categoryId);
            await getCurrentImage(product);
            togglePopup('editProductPopup');
            isEditInputValid();
        } else {
            console.error('Product not found');
        }
    } catch (error) {
        console.error('Error fetching product:', error);
    }
    closeAllDropdowns();
}

async function prepareProductData(product, productId, categoryId) {
    let tag = product.tag_ID ? await getTagPerProduct(product.tag_ID) : null;
    let tagHtml = tag ? getTagHTML(tag.tag_name, `background-color: ${tag.color}; height: 20px; padding: 5px 10px; border-radius: 5px; font-size: 15px`) : '';
    let formattedPrice = formatPrice(product.price).replace('€', '').trim();
    let fieldValues = getFieldValues(product, tagHtml, formattedPrice, productId, categoryId);
    setFieldValues(fieldValues);
    document.getElementById('currentImageId').value = product.image_ID || '';
    document.getElementById('currentTagId').value = product.tag_ID || '';
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
    let styleProperties = ['height', 'padding', 'border-radius', 'font-size', 'background-color'];

    styleProperties.forEach(property => {
        currentTag.style.removeProperty(property);
    });
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

function getFieldValues(product, tagHtml, formattedPrice, productId, categoryId) {
    return [
        { id: 'productCurrentName', value: product.product_name },
        { id: 'currentAmount', value: product.amount },
        { id: 'currentProductValue', value: formattedPrice },
        { id: 'currentProductInfo', value: product.information },
        { id: 'currentTag', value: tagHtml },
        { id: 'currentProductID', value: productId },
        { id: 'currentCategoryID', value: categoryId }
    ];
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

    if (currentImageUrl) {
        formData.append('current-image-url', currentImageUrl);
    }
    
    if (deleteImageFlag) {
        formData.append('imageToRemove', 'true');
    } else {
        // Lösche das Flag, falls kein Bild gelöscht werden soll
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
    /* document.getElementById('currentImage').value = '';
    document.getElementById('currentImageUrl').value = ''; */
}

async function updateProductTable(updatedProduct, categoryID) {
    console.log('Updated Product:', updatedProduct);
    let productRow = document.getElementById(`productRow_${updatedProduct.id}`);
    if (productRow) {
        let tag = await getTagPerProduct(updatedProduct.tagID);
        let image = await getImagePerProduct(updatedProduct.imageID);
        let newRowHTML = generateTableRow(updatedProduct, categoryID, tag, image);
        productRow.outerHTML = newRowHTML;
    } else {
        console.error('Product row not found for product ID:', updatedProduct.id);
    }
}

async function updateProductDetail(updatedProduct) {
    let tag = await getTagPerProduct(updatedProduct.tagID);
    let tagHtml = tag ? getTagHTML(tag.tag_name, `background-color: ${tag.color}; height: 20px; padding: 5px 10px; border-radius: 5px; font-size: 15px`) : '';
    let imageUrl = updatedProduct.imageUrl || null;

    let infoItems = [
        { label: 'Name', value: updatedProduct.name },
        { label: 'Menge', value: updatedProduct.amount },
        { label: 'Preis', value: formatPrice(updatedProduct.price) },
        { label: 'Tag', value: tagHtml },
        { label: 'Information', value: updatedProduct.information }
    ];
   
    let infoHtml = generateItemInfoHTML(updatedProduct.categoryId, infoItems, imageUrl, updatedProduct.id);
    document.getElementById('productDetailContent').innerHTML = infoHtml;
}

function openSettings() {
    togglePopup('settingsPopup');
}

async function showImages(images) {
    let gallery = document.getElementById('gallery');

    gallery.innerHTML = '';
    gallery.addEventListener('change', selectImageForDelete);
    
    images.forEach(async image => {
        let imageHtml = generateImageView(image);
        gallery.insertAdjacentHTML('beforeend', imageHtml);
    });
    document.getElementById('galleryContainer').style.display = 'flex';
    togglePopup('settingsPopup');
    document.querySelector('.category-item-container').style.display = 'none';
    document.getElementById('itemContainer').style.display = 'none';
}

function goBackToMain() {
    document.querySelector('.category-item-container').style.display = 'flex';
    document.getElementById('itemContainer').style.display = 'flex';
    document.getElementById('galleryContainer').style.display = 'none';
    document.getElementById('select-btn').style.backgroundColor = "#051C25";
    document.getElementById('select-btn').style.color = "white";
    selectedImageIDs = [];
}

function toggleSelect() {
    isSelectEnabled = !isSelectEnabled;
    let selectContainers = document.querySelectorAll('.image-checkbox');
    let images = document.querySelectorAll('.gallery img');

    selectContainers.forEach(container => {
        container.style.display === 'none' ? showSelectedImages(container) : removeSelectedImages(container);
    });

    images.forEach(img => {
        img.style.cursor = isSelectEnabled ? 'pointer' : 'default';
        img.classList.toggle('select-enabled', isSelectEnabled);
        img.closest('.image-container').classList.toggle('hover-effect', isSelectEnabled);
    });
}

function showSelectedImages(container) {
    container.style.display = 'block';
    document.getElementById('select-btn').style.backgroundColor = "#2BB8EE";
    document.getElementById('select-btn').style.color = "#051C25";
}

function removeSelectedImages(container) {
    container.style.display = 'none';
    document.getElementById('select-btn').style.backgroundColor = "#051C25";
    document.getElementById('select-btn').style.color = "white";
    selectedImageIDs = [];
    let images = document.querySelectorAll('.image-container img');
    images.forEach(img => {
        img.style.opacity = "1";
    });
    let checkboxes = document.querySelectorAll('.image-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    document.getElementById('deleteImage').style.display = 'none';
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

function toggleCheckbox(imageID) {
    if (isSelectEnabled) {
        let checkbox = document.querySelector(`.image-checkbox[data-image-id="${imageID}"]`);
        checkbox.checked = !checkbox.checked;
        selectImageForDelete({ target: checkbox });
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
});