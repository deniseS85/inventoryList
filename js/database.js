async function getCurrentUserID() {
    try {
        const response = await fetch('php/getUserID.php');
        if (!response.ok){
            throw new Error('Fehler beim Abrufen der Benutzer-ID');
        }
        const userID = await response.text();
        return userID;
    } catch (error) {
        console.error('Error fetching current user ID:', error);
        return null;
    }
}

async function getCategories() {
    try {
        const response = await fetch('php/getCategories.php');
        let categories = await response.json();
        categories.sort((a, b) => a.name.localeCompare(b.name));
        showCategoryItems(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
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

async function getProductsByCategory(categoryID) {
    try {
        const response = await fetch(`php/getProductsByCategory.php?category_id=${categoryID}`);
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

async function getProductById(productId) {
    try {
        const response = await fetch(`php/getProductByID.php?product_id=${productId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const product = await response.json();
        return product;
    } catch (error) {
        console.error('Error fetching product:', error);
    }
}

async function getTagPerProduct(tagID) {
    try {
        const response = await fetch(`php/getTags.php`);
        const tags = await response.json();
        let tag = tags.find(tag => tag.ID === tagID);
        return tag;
    } catch (error) {
        console.error('Error fetching tag by ID:', error);
    }
}

async function getImagePerProduct(imageID) {
    try {
        const response = await fetch(`php/getImages.php`);
        const images = await response.json();
        let image = images.find(image => image.ID === imageID);
        return image;
    } catch (error) {
        console.error('Error fetching image by ID:', error);
    }
}

function addNewTag() {
    let tagName = document.getElementById('tagInput').value;
    let tagColor = document.getElementById('tagColorInput').value;

    fetch('php/addTag.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tagName, tagColor })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            togglePopupNewTag();
            updateNewTag(data.id, tagName, tagColor);
        } else {
            console.error('Fehler beim Hinzufügen des Tags:', data.message);
        }
    })
    .catch(error => {
        console.error('Fehler beim Hinzufügen des Tags:', error);
    });
}

async function showTagsOptions(tagOptionsContainerID, dropDownID) {
    try {
        const response = await fetch('php/getTagsByUserID.php');
        const tags = await response.json();
        let tagOptionsContainer = document.getElementById(tagOptionsContainerID);

        tagOptionsContainer.innerHTML = '';

        tags.forEach(tag => {
            let option = document.createElement('div');
            option.classList.add('option');
            option.dataset.tagId = tag.ID;
            option.addEventListener('click', function() {
                selectTag(tag, dropDownID);
            });

            let span = document.createElement('span');
            span.classList.add('selected-option');
            span.textContent = tag.tag_name;
            span.style.backgroundColor = tag.color; 

            option.appendChild(span);
            tagOptionsContainer.appendChild(option);
        });
    } catch (error) {
        console.error('Error showing tag options:', error);
    }
}

async function saveUploadImageInDatabase(file, formData) {
    let formDataImage = new FormData();
    formDataImage.append('uploadImage', file);

    try {
        let response = await fetch('php/addImage.php', {
            method: 'POST',
            body: formDataImage
        });
        let uploadedImageId = await response.text();
        if (uploadedImageId.includes('Error:')) {
            alert(uploadedImageId);
        } else {
            if (formData.has('productID')) {
                formData.append('imageID', uploadedImageId);
                await addImageToDatabase(formData);
            } else {
                formData.append('uploadedImageId', uploadedImageId);
                await saveProductInDatabase(formData);
            }
        }
    } catch (error) {
        console.error('Upload failed', error);
    }
}

async function saveProductInDatabase(formData) {
    fetch('php/addItem.php', {
        method: 'POST',
        body: formData
    }) 
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(response.statusText);
        }
    })
    .then(newProduct => {
        showProduct(newProduct, newProduct.category_ID);
        togglePopupNewItem(null);
        setTimeout(() => scrollToLastElement(`.item-info[data-category-id="${newProduct.category_ID}"] .productContainer`, 'tbody tr'), 100);
        updateProductCount(newProduct.category_ID, 'add');
    })
    .catch(error => {
        console.error('Fehler beim Hinzufügen des Produktes:', error.message);
    });
}

async function addImageToDatabase(formData) {
    try {
        let response = await fetch('php/addImageToProduct.php', {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        let updatedProduct = await response.json();
        let productID = document.getElementById('editUploadedImageId').value;
        let imageID = updatedProduct.imageID;
        document.getElementById('editUploadedImageId').value = `${productID}, ${imageID}`;

        if (updatedProduct.imageURL) {
            currentImageUrl[productID] = updatedProduct.imageURL;
        } 
        addImageToProduct(updatedProduct, productID);
    } catch (error) {
        console.error('Fehler beim Aktualisieren des Produktbilds:', error.message);
    }
}

async function deleteImageFromDatabase(formData) {
    try {
        const response = await fetch('php/deleteImageFromProduct.php', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.error('Fehler beim Löschen des Bildes:', error.message)
    }
}

async function deleteProductItem() {
    try {
        let productID = document.getElementById('deleteProductConfirmation').dataset.productId;
        let categoryID = document.getElementById('deleteProductConfirmation').dataset.categoryId;

        const response = await fetch('php/deleteProduct.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ID: productID })
        });
        
        if (!response.ok) {
            throw new Error('Fehler beim Löschen des Produkts');
        }
        removeProductFromHTML(productID);
        togglePopup('deleteProductConfirmation');
        togglePopup('productDetailPopup');
        updateProductCount(categoryID, 'remove');
    } catch (error) {
        console.error('Fehler beim Löschen des Produkts:', error.message);
    }
}

async function saveEditProductInDatabase(formData) {
    try {
        const response = await fetch('php/editProduct.php', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const updatedProduct = await response.json();
        
        if (updatedProduct.error) {
            console.error('Fehler beim Ändern des Produktes:', updatedProduct.error);
            return;
        }
        togglePopupEditProduct(null);
        updateProductTable(updatedProduct, updatedProduct.categoryId);
        updateProductDetail(updatedProduct); 
        resetUploadImage(updatedProduct.categoryId, updatedProduct.id, 'editUploadedImage', 'editUploadedImageId', 'editUploadImage', 'removeEditImgUpload');
    } catch (error) {
        console.error('Fehler beim Ändern des Produktes:', error.message);
    }
}

async function getAllImages() {
    try {
        const currentUserID = await getCurrentUserID();
        if (currentUserID === null) {
            throw new Error('Benutzer-ID nicht verfügbar');
        }
        const response = await fetch('php/getImages.php');
        if (!response.ok){
            throw new Error('Fehler beim Laden der Bilder');
        }
        const images = await response.json();
        const userImages = images.filter(image => image.user_id === currentUserID);
        showImages(userImages);
    } catch (error) {
        console.error('Error fetching all images:', error);
    }
}

async function getAllTags() {
    try {
        const currentUserID = await getCurrentUserID();
        if (currentUserID === null) {
            throw new Error('Benutzer-ID nicht verfügbar');
        }
        const response = await fetch('php/getTags.php');
        if (!response.ok) {
            throw new Error('Fehler beim Laden der Tags');
        }
        const tags = await response.json();
        const userTags = tags.filter(tag => tag.user_id === currentUserID);
        showTags(userTags);
    } catch (error) {
        console.error('Error fetching all tags:', error);
    }
}

async function getProductsByImage(imageID) {
    try {
        const response = await fetch(`php/getProductsByImageID.php?image_id=${imageID}`);
        const productID = await response.json();
        return { imageID: imageID, productID: productID.toString() };
    } catch (error) {
        console.error('Fehler beim Abrufen der Produkt-ID für Bild:', error);
    }
}

async function getProductsByTag(tagID) {
    try {
        const response = await fetch(`php/getProductsByTagID.php?tag_id=${tagID}`);
        const productIDs = await response.json();
        
        if (Array.isArray(productIDs)) {
            return { tagID: tagID, productIDs: productIDs.map(String) };
        } else {
            return { tagID: tagID, productIDs: [] };
        }
    } catch (error) {
        console.error('Fehler beim Abrufen der Produkt-IDs für Tag:', error);
        return { tagID: tagID, productIDs: [] }; 
    }
}

async function deleteImages() {
    for (let item of selectedImageIDs) {
        let formData = new FormData();
        formData.append('productID', item.productId);
        formData.append('imageID', item.imageId);
        
        try {
            const response = await fetch('php/deleteImageFromProduct.php', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();

            if (response.ok && result.success) {
                await updateUIafterDeleteImages(item.imageId, item.productId, result.category_ID);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    selectedImageIDs = [];
    document.getElementById('deleteImage').style.display = 'none';
    togglePopup('deleteImageConfirmation');
    toggleSelect();
}

async function updateUIafterDeleteImages(imageID, productID, categoryID) {
    let imageElement = document.querySelector(`[data-image-id="${imageID}"]`);
    if (imageElement) {
        let imageContainer = imageElement.closest('.image-container');
        imageContainer && (imageContainer.remove());
        resetUploadImage(categoryID, productID, 'editUploadedImage', 'editUploadedImageId', 'editUploadImage', 'removeEditImgUpload');
        removeSelect(imageElement, 'image');
        try {
            let product = await getProductById(productID);
            updateProductTable(product, categoryID);
            updateProductDetail(product);
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    } else {
        console.error('Image element with ID', imageID, 'not found.');
    }
}

async function deleteTags() {
    for (let item of selectedTagIDs) {
        let formData = new FormData();
        formData.append('productID', item.productId);
        formData.append('tagID', item.tagId);

        try {
            const response = await fetch('php/deleteTag.php', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();

            if (response.ok && result.success) {
                await updateUIafterDeleteTag(item.tagId, item.productId, result.category_ID)
            }
        } catch (error) {
            console.error('Error', error);
        }
    }
    selectedTagIDs = [];
    document.getElementById('deleteTag').style.display = 'none';
    togglePopup('deleteTagConfirmation');
    toggleSelect();
}

async function updateUIafterDeleteTag(tagID, productID, categoryID) {
    let tagElement = document.querySelector(`[data-tag-id="${tagID}"]`);
    if (tagElement) {
        let tagContainer = tagElement.closest('.tags-container');
        tagContainer && (tagContainer.remove());
        removeTagFromDropdown(tagID);
        removeSelect(tagElement, 'tag');
        try {
            let product = await getProductById(productID);
            updateProductTable(product, categoryID);
            updateProductDetail(product);
            
        } catch {
            console.error('Error fetching product:', error);
        }
    } else {
        console.error('Tag element with ID', tagID, 'not found.');
    }
}

async function exportToExcel() {
    try {
        const response = await fetch('php/exportToExcel.php');
        if (!response.ok) {
            throw new Error('Fehler beim Exportieren der Tabelle');
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'products.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        togglePopup('settingsPopup');
    } catch (error) {
        console.error('Fehler beim Exportieren der Tabelle:', error);
    }
}











