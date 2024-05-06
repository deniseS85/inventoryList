async function getCategories() {
    try {
        await fetch('php/getCategories.php')
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
        const response = await fetch(`php/getProducts.php?category_id=${categoryID}`);
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
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
        body: JSON.stringify({tagName, tagColor })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        togglePopupNewTag();
        showTagsOptions();
        setTimeout(() => scrollToLastElement('.tagOptionsContainer', '.option'), 100);
    })
    .catch(error => {
        console.error('Fehler beim Hinzufügen des Tags:', error);
    });
}

async function showTagsOptions() {
    try {
        const response = await fetch('php/getTags.php');
        const tags = await response.json();
        let tagOptionsContainer = document.querySelector('.tagOptionsContainer');

        tagOptionsContainer.innerHTML = '';

        tags.forEach(tag => {
            let option = document.createElement('div');
            option.classList.add('option');
            
            option.addEventListener('click', function() {
                selectTag(tag);
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
                await updateProductImageInDatabase(formData);
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
        updateProductCount(newProduct.category_ID);
    })
    .catch(error => {
        console.error('Fehler beim Hinzufügen des Produktes:', error.message);
    });
}

async function updateProductImageInDatabase(formData) {
    try {
        let response = await fetch('php/updateProductImage.php', {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        let updatedProduct = await response.json();
        let productID = document.getElementById('editUploadedImageId').value;
        if (updatedProduct.imageURL) {
            currentImageUrls[productID] = updatedProduct.imageURL;
        } 
        updateProductImage(updatedProduct, productID);
    } catch (error) {
        console.error('Fehler beim Aktualisieren des Produktbilds:', error.message);
    }
}
